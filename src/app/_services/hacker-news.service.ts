import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, from} from 'rxjs';
import {catchError, mergeMap, switchMap, tap} from 'rxjs/operators';
import {Story} from '../_models/story';
import {User} from '../_models/user';
import {Comment} from '../_models/comment';
import {ActivatedRoute} from '@angular/router';
import {HackerNewsSearchService} from './hacker-news-search.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import * as firebase from 'firebase';
import {GoogleImagesService} from './google-images.service';

export const HN_SECTION = [
  {name: 'TopStory', subpath: 'topstories'},
  {name: 'NewStory', subpath: 'newstories'},
  {name: 'BestStory', subpath: 'beststories'},
  {name: 'Show', subpath: 'showstories'},
  {name: 'Ask', subpath: 'askstories'},
  {name: 'Job', subpath: 'jobstories'},
  {name: 'Launch', subpath: 'launch'}
];

@Injectable({
  providedIn: 'root'
})
export class HackerNewsService {

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              private hackerNewsSearch: HackerNewsSearchService,
              private googleImagesService: GoogleImagesService,
              private firestore: AngularFirestore) {
    this.route.params.subscribe(routeParams => {
      this.currentSection = routeParams.section;
    });
    this.cache = firestore.collection<Story>('cache');
  }
  private baseApiUrl = 'https://hacker-news.firebaseio.com/v0/';
  private mercuryBaseApiUrl = '/hackernews/parse?url=';
  private defaultStoryImageUrls = [
    'https://i.imgur.com/DX877VD.png',
    'https://i.imgur.com/o0CDhjr.jpg',
    'https://i.imgur.com/QGeDXnG.png',
    'https://i.imgur.com/LnMirAw.png',
    'https://i.imgur.com/0TaSNEy.png',
    'https://i.imgur.com/XzHiGKy.jpg',
    'https://i.imgur.com/aWvC7UB.png',
    'https://i.imgur.com/64ShGwN.jpg',
    'https://i.imgur.com/TwzilYz.png',
    'https://i.imgur.com/oyRsrCZ.jpg',
    'https://i.imgur.com/DIVgtHa.png',
    'https://i.imgur.com/k3C388y.jpg'
  ];
  private newsIDs: number[] = [];
  private currentPosition: number;
  private batchSize = 3;
  private currentSection = HN_SECTION[0].name;
  private cache: AngularFirestoreCollection<Story>;
  TITLE = 'Hacker News';

  /**
   * Enrich a story with the info retrieved with a mercury URL query
   * @param story: the story to be enriched
   * @param mercuryStory: the mercury query result
   */
  private enrichStory(story: Story, mercuryStory): Story {
    if (story === undefined || mercuryStory === undefined) {
      return story;
    }
    if (mercuryStory.lead_image_url !== undefined && mercuryStory.lead_image_url != null) {
      story.leadImageUrl = mercuryStory.lead_image_url;
    }
    story.content = mercuryStory.content;
    story.domain = mercuryStory.domain;
    story.description = mercuryStory.description;
    if (story.description === undefined && mercuryStory.excerpt !== undefined) {
      story.description = mercuryStory.excerpt;
    }
    return story;
  }

  /**
   * Return a User object given an username
   * @param username: the username
   */
  getUserByUsername(username: string): Observable<User> {
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
  getEnrichedStoryByID(id: number): Observable<Story> {
    return this.http.get<Story>(this.baseApiUrl + 'item/' + id + '.json')
      .pipe(
        catchError(this.handleError(null)),
        mergeMap((story: Story) => {
          return this.getEnrichedStory(story);
        })
      );
  }

  /**
   * Get a story from the HN API
   * @param id: the HN story ID
   */
  getStoryByID(id: number): Observable<Story> {
    return this.http.get<Story>(this.baseApiUrl + 'item/' + id + '.json')
      .pipe(
        catchError(this.handleError(null)),
        mergeMap((story: Story) => {
          story.description = story.text;
          return of(story);
        })
      );
  }

  /**
   * Get a default image based on a string (used as the pseudo-random seed)
   * @param seed: the string seed
   */
  getDefaultImage(seed: string): string {
    const rnd = seed.charCodeAt(0) + seed.charCodeAt(1) + seed.charCodeAt(2);
    return this.defaultStoryImageUrls[rnd % this.defaultStoryImageUrls.length];
  }

  /**
   * Return the parent Story (not enriched) given an id
   * @param id: the story ID
   */
  getParentStoryByID(id: number): Observable<Story> {
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
   * Use as Cloud Firestore Collection as a cache
   * @param story: the story HN item
   */
  getEnrichedStory(story: Story): Observable<Story> {
    if (story.url !== undefined) {
      try {
        return from(this.cache.doc(story.id.toString()).ref.get())
          .pipe(
            mergeMap((doc: DocumentSnapshot) => {
              if (doc.exists) {
                const mercuryStory = doc.data();
                mercuryStory.lead_image_url = mercuryStory.leadImageUrl;
                return of(this.enrichStory(story, mercuryStory));
              } else {
                return this.getMercuryEnrichedStory(story);
              }
            })
          );
      } catch (e) {
        return this.getMercuryEnrichedStory(story);
      }
    } else {
      story.description = story.text;
      return this.getGoogleEnrichedStory(story);
    }
  }

  /**
   * Enrich the story retrieving information from Google
   * @param story: the simple HN story
   */
  getGoogleEnrichedStory(story): Observable<Story> {
    const query = story.title.replace('Show HN:', '').replace('Ask HN:', '').replace('Tell HN:', '').replace('Show HN:', '');
    return this.googleImagesService.searchImage(query)
      .pipe(
        switchMap((img: string) => {
          story.leadImageUrl = img;
          return of(story);
        }),
        catchError(this.handleError(story))
      );
  }

  /**
   * Enrich the story retrieving information from the mercury API
   * @param story: the simple HN story
   */
  getMercuryEnrichedStory(story): Observable<Story> {
    return of(story)
      .pipe(
        switchMap(s => {
          return this.http.get(this.mercuryBaseApiUrl + s.url)
            .pipe(
              mergeMap(mercuryStory => {
                s = this.enrichStory(s, mercuryStory);
                return of(s);
              }),
              catchError(this.handleError(story))
            );
        }),
        switchMap((s: Story) => {
          if (s.leadImageUrl === undefined) {
            return this.getGoogleEnrichedStory(s);
          }
          return of(s);
        }),
        tap(s => {
          try {
            this.cache.doc(story.id.toString()).set(s);
          } catch (e) {
          }
        }),
        catchError(this.handleError(story))
      );
  }

  /**
   * Retrieve the full list of IDs for the selected HN section
   * @param section: the HN section
   */
  getNewsIDs(section = HN_SECTION[0].name): Observable<number[]> {
    const selectedSection = HN_SECTION.filter( (item) => {
      return item.name === section;
    })[0];
    section = selectedSection.subpath;
    this.currentSection = selectedSection.name;
    this.currentPosition = 0;
    if (section !== 'launch') {
      return this.http.get<number[]>(this.baseApiUrl + section + '.json')
        .pipe(
          mergeMap(newsIDs => {
            this.newsIDs = newsIDs;
            return this.getNextNewsIDs();
          }),
          catchError(this.handleError([]))
        );
    } else {
      return this.hackerNewsSearch.getLaunchHNStory()
        .pipe(
          mergeMap(newsIDs => {
            this.newsIDs = newsIDs;
            return this.getNextNewsIDs();
          })
        );
    }
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
      // console.error(error);
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
