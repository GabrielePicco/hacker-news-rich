import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {catchError, mergeMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Login} from './login.enum';
import {Credentials} from './credentials';
import * as CryptoJS from 'crypto-js';
import {Submit} from './submit.enum';

@Injectable({
  providedIn: 'root'
})
export class HackerNewsUserService {

  isAuthenticated = false;
  username: string;
  existingArticleId: string;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.validateCredentials();
  }

  /**
   * Login and registration function, call the HN API
   * @param username: the username
   * @param password: the password
   * @param createAccount: if true, manage as a registration
   */
  login(username: string, password: string, createAccount = false): Observable<Login> {
    const body = new URLSearchParams();
    body.set('goto', 'news');
    body.set('acct', username);
    body.set('pw', password);
    if (createAccount) {
      body.set('creating', 't');
    }
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache'
    };
    console.log(body.toString());
    return this.http.post('/hackernews/login', body.toString(), {
      headers: headers,
      responseType: 'text',
      withCredentials: false
    }).pipe(
        mergeMap((result: string) => {
          console.log(result);
          if (result.length > 2000) {
            password = CryptoJS.AES.encrypt(password, username).toString();
            this.cookieService.deleteAll();
            this.cookieService.set('userinfo', `${username}&${password}`, 5000);
            this.username = username;
            this.isAuthenticated = true;
            return of(Login.Ok);
          } else if (result.indexOf('That username is taken. Please choose another') !== -1) {
            return of(Login.UserAlreadyExist);
          } else {
            return of(Login.Wrong);
          }
        }),
        catchError(this.handleError(null))
      );
  }


  /**
   * Add a comment
   * @param parentId: the id of the parent item
   * @param text: the comment
   */
  comment(parentId: string, text: string) {
    const body = new URLSearchParams();
    const credentials = this.getCredentials();
    //body.set('acct', credentials.username);
    //body.set('pw', credentials.password);
    body.set('parent', parentId);
    body.set('text', text);
    body.set('goto', 'news');
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    return this.http.post('/hackernews/comment', body.toString(), {
      headers: headers,
      responseType: 'text',
      withCredentials: false
    }).pipe(
      catchError(this.handleError(null))
    ).subscribe(result => console.log(result));
  }

  /**
   * Add a vote to an item
   * @param itemId: the id of the item
   * @param how: up or un (unvote)
   */
  vote(itemId: string, how: string) {
    const body = new URLSearchParams();
    const credentials = this.getCredentials();
    body.set('acct', credentials.username);
    body.set('pw', credentials.password);
    body.set('id', itemId);
    body.set('how', how);
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    return this.http.post('/hackernews/vote', body.toString(), {
      headers: headers,
      responseType: 'text',
      withCredentials: false
    }).pipe(
      catchError(this.handleError(null))
    ).subscribe();
  }

  /**
   * Submit a new story or link
   * @param title: the title
   * @param content: the url or text
   * @param isUrl: default True
   */
  submit(title: string, content: string, isUrl = true): Observable<Submit> {
    const body = new URLSearchParams();
    const credentials = this.getCredentials();
    body.set('acct', credentials.username);
    body.set('pw', credentials.password);
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    return this.http.post('/hackernews/submit', body.toString(), {
      headers: headers,
      responseType: 'text',
      withCredentials: false
    }).pipe(
      mergeMap((html: string) => {
        const fnid = this.getInputValue(html, 'fnid');
        const fnop = this.getInputValue(html, 'fnop');
        body.set('fnop', fnop);
        body.set('fnid', fnid);
        if (isUrl === true) {
          body.set('url', content);
        } else {
          body.set('text', content);
        }
        body.set('title', title);
        return this.http.post('/hackernews/r', body.toString(), {
          headers: headers,
          responseType: 'text',
          withCredentials: false
        }).pipe(
          mergeMap((result: string) => {
            let path = result.match('login\\?goto=[^"]+')[0];
            path = path.replace('login?goto=', '');
            const existingLinkPath = 'item%3Fid%3D';
            if (path.indexOf(existingLinkPath) !== -1) {
              const id = path.replace('item%3Fid%3D', '');
              this.existingArticleId = id;
              return of(Submit.ExistingLink);
            } else {
              return of(Submit.Ok);
            }
          }),
          catchError(this.handleSubmitError()),
        );
      }),
      catchError(this.handleError(Submit.InvalidLink))
    );
  }


  /**
   * Not yet implemented in graphics and not tested
   * @param itemId: the id of the item to be deleted
   */
  delete(itemId) {
    const body = new URLSearchParams();
    const credentials = this.getCredentials();
    body.set('acct', credentials.username);
    body.set('pw', credentials.password);
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    this.http.post(`/hackernews/delete-confirm?id=${itemId}`, body.toString(), {
      headers: headers,
      responseType: 'text',
      withCredentials: false
    }).pipe(
      mergeMap((html: string) => {
        const hmac = this.getInputValue(html, 'hmac');
        body.set('hmac', hmac);
        body.set('id', itemId);
        body.set('d', 'Yes');
        return this.http.post('/hackernews/xdelete', body.toString(), {
          headers: headers,
          responseType: 'text',
          withCredentials: false
        });
      }),
      catchError(this.handleError(this.handleError()))
    ).subscribe();
  }

  /**
   * Get the value attribute from an input box
   * @param html: the html strinh
   * @param name: the input box name
   */
  private getInputValue(html: string, name: string): string {
    const value = html.match(`<\\s*input[^>]*name="${name}"[^>]*>`);
    if (value != null) {
      return value[0].match('value[^"]*"([^"]*)"')[1];
    } else {
      return null;
    }
  }


  /**
   * Get the credentials from the cookies
   */
  getCredentials(): Credentials {
    if (!this.cookieService.check('userinfo')) {
      return null;
    } else {
      const credentials = new Credentials();
      const field = this.cookieService.get('userinfo').split('&');
      credentials.username = field[0];
      credentials.password = CryptoJS.AES.decrypt(field[1], credentials.username).toString(CryptoJS.enc.Utf8);
      return credentials;
    }
  }


  /**
   * Validate the credentials stored in tbe cookies
   */
  validateCredentials(trial = 0) {
    const credentials = this.getCredentials();
    if (credentials !== null) {
      this.username = credentials.username;
      this.isAuthenticated = true;
      this.login(credentials.username, credentials.password)
        .subscribe(res => {
          if (res === Login.Ok) {
            this.username = credentials.username;
            this.isAuthenticated = true;
          } else {
            this.isAuthenticated = false;
            if (trial < 3) {
              this.validateCredentials(trial += 1);
            } else {
              this.cookieService.deleteAll();
            }
          }
        });
    }
  }


  logout() {
    this.cookieService.deleteAll();
    this.isAuthenticated = false;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  /**
   * Handle the submit errors
   */
  private handleSubmitError<T>() {
    return (error: any): Observable<Submit> => {
      if (error.url.indexOf('story-toofast') !== -1) {
        return of(Submit.TooFast);
      } else {
        return of(Submit.InvalidLink);
      }
    };
  }
}
