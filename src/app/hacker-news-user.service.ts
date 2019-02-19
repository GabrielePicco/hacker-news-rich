import { Injectable } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {catchError, mergeMap} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Login} from './login.enum';

@Injectable({
  providedIn: 'root'
})
export class HackerNewsUserService {

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(username: string, password: string, createAccount = false): Observable<Login> {
    const body = new HttpParams()
      .set('goto', 'news')
      .set('acct', username)
      .set('pw', password);
    if (createAccount) {
      body.set('creating', 't');
    }
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    return this.http.post('/hackernews/login', body, {headers: headers, responseType: 'text', withCredentials: true})
      .pipe(
        catchError(this.handleError(null)),
        mergeMap((result: string) => {
          if (result.length < 1300 && result.indexOf('Bad login.') !== -1) {
            return of(Login.Wrong);
          } else {
            this.cookieService.set( 'userinfo', `${username}&${password}`, 2000 );
            return of(Login.Ok);
          }
        })
      );
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
