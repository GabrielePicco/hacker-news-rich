import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, mergeMap, tap} from 'rxjs/operators';
import {Story} from './story';
import {User} from './user';
import {Comment} from './comment';
import {ActivatedRoute} from '@angular/router';

const mercuryHttpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'x-api-key': 'vNHCrF4nFnTVKD6I50YYiwZiJlVcgnDcnqwJYmjS'
  })
};

export const HN_SECTION = [
  {name: 'Top Story', subpath: 'topstories'},
  {name: 'New Story', subpath: 'newstories'},
  {name: 'Best Story', subpath: 'beststories'},
  {name: 'Show', subpath: 'showstories'},
  {name: 'Ask', subpath: 'askstories'},
  {name: 'Job', subpath: 'jobstories'}
];

@Injectable({
  providedIn: 'root'
})
export class HackerNewsService {
  private baseApiUrl = 'https://hacker-news.firebaseio.com/v0/';
  private mercuryBaseApiUrl = 'https://mercury.postlight.com/parser?url=';
  private defaultStoryImageUrls = [
    'https://androidwidgetcenter.com/wp-content/uploads/2013/02/Google-Now.jpeg',
    'http://www.revistasmartphone.com/wp-content/uploads/2016/07/android-lollipop-wallpapers-google-now-wallpaper-3.png',
    'https://wallpaperhdzone.com/wp-content/uploads/2016/09/york-wallpaper-outlet-HD3.jpg',
    'https://i.imgur.com/LnMirAw.png',
    'https://userscontent2.emaze.com/images/8a6449e6-1c86-457f-9cfc-e64d11e89fd1/8cdd930935b8ba2786ddf02f7ad8792d.png',
    'https://www.aivanet.com/wp-content/uploads/2016/01/Materail-and-Flat-Wallpapers-840x473-2.jpg',
    'https://cdn.wallpapersafari.com/4/10/xI3Vk0.png',
    'https://cdn.wallpapersafari.com/55/85/4Tm6rZ.png',
    'https://cdn.wallpapersafari.com/85/49/qZtyor.png',
    'https://i.pinimg.com/originals/0a/58/4b/0a584b8a68560bb617b95180f0e38c70.png',
    'http://www.tokkoro.com/thumbs/5014351-minimalism-beach-boat-mountains-sunset-birds-hd-artist-artwork-digital-art-sea-4k-5k-8k.jpg',
    'http://farm9.staticflickr.com/8258/8781996610_bebf06f966_c.jpg'
  ];
  private newsIDs: number[] = [];
  private currentPosition: number;
  private batchSize = 3;
  private currentSection = HN_SECTION[0].name;
  TITLE = 'Hacker News';

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.params.subscribe(routeParams => {
      this.currentSection = routeParams.section;
    });
    const payload = {
      'acct': 'piccogabriele',
      'pw': '2495GAPI+',
      'goto': 'news'
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, HEAD',
        'Access-Control-Allow-Headers': 'X-PINGOTHER, Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Access-Control-Max-Age': '1728000',
      })
    };
    console.log('Try login');
    this.http.post('https://news.ycombinator.com/login', payload, httpOptions)
      .pipe(
        tap(
          data => console.log(data),
          error => console.log(error)
        )
      ).subscribe(result => console.log(result));
  }

  /**
   * Return a User object given an username
   * @param username: the username
   */
  getUserByUsername(username: String): Observable<User> {
    return this.http.get<User>(this.baseApiUrl + 'user/' + username + '.json').pipe(catchError(this.handleError(null)),
      mergeMap((user: User) => {
        user.profileImage = 'assets/img/demo/m' + this.getRandomInt(1, 4) + '.png';
        return of(user);
      }));
  }

  /**
   * Return a story or a comment given an ID
   */
  getCommentOrStory(id: number): Observable<any> {
    return this.http.get(this.baseApiUrl + 'item/' + id + '.json')
      .pipe(
        catchError(this.handleError(null)),
        mergeMap((item) => {
          if (item.type === 'comment') {
            return of(item);
          }
          return this.getEnrichedStory(item);
        })
      );
  }

  /**
   * Return a comment given a comment ID
   * @param id: the comment id
   */
  getCommentByID(id: number): Observable<Comment> {
    return this.http.get<Comment>(this.baseApiUrl + 'item/' + id + '.json')
      .pipe(catchError(this.handleError(null)));
  }

  /**
   * Get a story from the HN API, enriching the information querying the article URL with the mercury API
   * @param id: the HN story ID
   */
  getEnrichedStoryByID(id: Number): Observable<Story> {
    return this.http.get<Story>(this.baseApiUrl + 'item/' + id + '.json')
      .pipe(
        catchError(this.handleError(null)),
        mergeMap((story: Story) => {
          return this.getEnrichedStory(story);
        })
      );
  }

  /**
   * Return the parent Story (not enriched) given an id
   * @param id: the story ID
   */
  getParentStoryByID(id: Number): Observable<Story> {
    return this.http.get<Story>(this.baseApiUrl + 'item/' + id + '.json')
      .pipe(
        catchError(this.handleError(null)),
        mergeMap(item => {
          if (item.type !== 'story') {
            return this.getParentStoryByID(item.parent);
          } else {
            return this.getEnrichedStory(item);
          }
        })
      );
  }

  /**
   * Enrich a basic story with image and information from the mercury API
   * @param story: the story HN item
   */
  getEnrichedStory(story: Story): Observable<Story> {
    story.leadImageUrl = this.defaultStoryImageUrls[this.getRandomInt(0, this.defaultStoryImageUrls.length - 1)];
    if (story.url !== undefined) {
      return this.http.get(this.mercuryBaseApiUrl + story.url, mercuryHttpOptions)
        .pipe(
          catchError(this.handleError(null)),
          mergeMap(mercuryStory => {
            this.enrichStory(story, mercuryStory);
            return of(story);
          })
        );
    } else {
      story.description = story.text;
      return of(story);
    }
  }

  /**
   * Enrich a story with the info retrievied with a mercury URL query
   * @param story: the story to be enriched
   * @param mercuryStory: the mercury query result
   */
  private enrichStory(story: Story, mercuryStory) {
    if (story == null || mercuryStory == null) {
      return;
    }
    if (mercuryStory.lead_image_url !== null) {
      story.leadImageUrl = mercuryStory.lead_image_url;
    }
    story.content = mercuryStory.content;
    story.domain = mercuryStory.domain;
    story.description = mercuryStory.excerpt;
    if (mercuryStory.excerpt.length > story.description.length) {
      story.description = mercuryStory.excerpt;
    }
    story.wordCount = mercuryStory.wordCount;
  }

  getNewsIDs(section = HN_SECTION[0].name): Observable<number[]> {
    const selectedSection = HN_SECTION.filter(function (item) {
      return item.name === section;
    })[0];
    section = selectedSection.subpath;
    this.currentSection = selectedSection.name;
    this.currentPosition = 0;
    return this.http.get<number[]>(this.baseApiUrl + section + '.json')
      .pipe(
        catchError(this.handleError([])),
        mergeMap(newsIDs => {
          this.newsIDs = newsIDs;
          return this.getNextNewsIDs();
        })
      );
  }

  /**
   * Return next batch of the selected story
   */
  getNextNewsIDs(): Observable<number[]> {
    return of(this.newsIDs.slice(this.currentPosition, this.currentPosition + this.batchSize))
      .pipe(
        tap(_ => this.currentPosition += this.batchSize)
      );
  }

  /**
   * Return the name of the current selected section
   */
  getCurrentSectionName(): string {
    return this.currentSection;
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
   * Return a random integer between min and max
   * @param min: min
   * @param max: max
   */
  private getRandomInt(min, max): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
