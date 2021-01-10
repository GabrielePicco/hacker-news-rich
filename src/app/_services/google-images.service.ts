import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleImagesService {
  /**
   * Scrape google images for retrieving an image url from a given query
   */

  constructor(private http: HttpClient) { }

  searchImage(query: string): Observable<string> {
    const headers: HttpHeaders = new HttpHeaders({Accept: 'text/html'});
    return this.http.get(`/google/search?source=lnms&hl=en&sa=X&gbv=1&tbm=isch&q=
    ${query}&oq=${query}&gs_l=img`, { headers, responseType: 'text' })
      .pipe(map ( res => {
        let imgUrl;
        const div = document.createElement('div');
        div.innerHTML = res;
        const images = div.querySelectorAll('img');
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < images.length; j++) {
          const img = images[j];
          if (img.alt !== 'Google') {
            const maxTrial = 3;
            let trial = 0;
            let elem = img as HTMLElement;
            while (!imgUrl && trial < maxTrial) {
              const links = elem.parentElement.querySelectorAll('a');
              for (let i = 0; i < links.length; i++) {
                const link = links.item(i);
                if (link.href && link.href !== '') {
                  try {
                    imgUrl = link.href.replace(window.location.origin, '');
                    imgUrl = imgUrl.substring(imgUrl.indexOf('http'), imgUrl.indexOf('&'));
                    if (imgUrl.indexOf('jpg') === -1 && imgUrl.indexOf('png') && imgUrl.indexOf('jpeg') && imgUrl.indexOf('gif')) {
                      imgUrl = undefined;
                    }
                    break;
                  } catch (err) {
                    imgUrl = undefined;
                  }
                }
              }
              elem = elem.parentElement;
              trial ++;
            }
            if (imgUrl) {
              break;
            }
          }
        }
        return imgUrl;
      }));
  }
}
