import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {catchError, mergeMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Login} from './login.enum';
import {Credentials} from './credentials';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class HackerNewsUserService {

  isAuthenticated = false;
  username: string;

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
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    return this.http.post('/hackernews/login', body.toString(), {
      headers: headers,
      responseType: 'text',
      withCredentials: true
    }).pipe(
        catchError(this.handleError(null)),
        mergeMap((result: string) => {
          if (result.length > 2000) {
            password = CryptoJS.AES.encrypt(password, username).toString();
            this.cookieService.set('userinfo', `${username}&${password}`, 3000);
            this.username = username;
            this.isAuthenticated = true;
            return of(Login.Ok);
          } else if (result.indexOf('That username is taken. Please choose another') !== -1) {
            return of(Login.UserAlreadyExist);
          } else {
            return of(Login.Wrong);
          }
        })
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
    body.set('acct', credentials.username);
    body.set('pw', credentials.password);
    body.set('parent', parentId);
    body.set('text', text);
    body.set('goto', 'news');
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    return this.http.post('/hackernews/comment', body.toString(), {
      headers: headers,
      responseType: 'text',
      withCredentials: true
    }).pipe(
      catchError(this.handleError(null))
    ).subscribe();
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
      console.log(credentials);
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
}
