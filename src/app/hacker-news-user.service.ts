import { Injectable } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HackerNewsUserService {

  constructor(private http: HttpClient, private cookieService: CookieService) {
    const body = 'goto=news&acct=piccogabriele&pw=2495GAPI%2B';
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    console.log('Try login');
    this.http.post('/hackernews/login', body, {headers: headers, responseType: 'text', withCredentials: true})
      .pipe(catchError(this.handleError(null)))
      .subscribe(result => {
        if (result.length < 1300 && result.indexOf('Bad login.') !== -1) {
          console.log('login incorrect');
        } else {
          console.log('login correct !');
        }
        this.cookieService.set( 'userinfo', 'Hello World' );
        console.log(cookieService.getAll());
        console.log(result);
        console.log(result.length);
      });
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
