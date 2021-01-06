import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, mergeMap} from 'rxjs/operators';
import {Sorting} from '../_models/sorting.enum';

@Injectable({
  providedIn: 'root'
})
export class HackerNewsSearchService {

  public searchIDs: number[] = [];
  public searchTerm: string;
  public sorting: Sorting;

  private baseApiUrl = 'https://hn.algolia.com/api/v1/';
  private initialNStory = 4;
  private currentNOfStory = 0;

  constructor(private http: HttpClient) {}

  /**
   * Retrieve the ID of story (Sorted by relevance, then points, then number of comments)
   * given a query
   * @param query: the string query
   * @param sort: type of sorting (relevance | date)
   */
  searchStory(query: string, sort = Sorting.Date) {
    const options = {
      params: new HttpParams()
        .set('hitsPerPage', this.initialNStory.toString())
        .set('tags', 'story')
        .set('attributesToRetrieve', 'objectID')
        .set('attributesToHighlight', 'none')
        .set('page', '0')
        .set('query', query)
    };
    this.searchTerm = query;
    this.sorting = sort;
    this.http.get<number[]>(this.baseApiUrl + this.getSearchPath(sort), options)
      .pipe(
        catchError(this.handleError(null)),
        mergeMap(result => {
          return of(result.hits.map(s => parseInt(s.objectID, 10)));
        })
      ).subscribe(IDs => this.searchIDs = IDs);
  }


  /**
   * Return 500 IDs searching with the query "Launch HN"
   */
  getLaunchHNStory() {
    const options = {
      params: new HttpParams()
        .set('hitsPerPage', '500')
        .set('tags', 'story')
        .set('attributesToRetrieve', 'objectID')
        .set('attributesToHighlight', 'none')
        .set('page', '0')
        .set('query', '\"Launch HN:\"')
    };
    return this.http.get<number[]>(this.baseApiUrl + 'search_by_date/', options)
      .pipe(
        catchError(this.handleError(null)),
        mergeMap(result => {
          return of(result.hits.map(s => parseInt(s.objectID, 10)));
        })
      );
  }

  /**
   * Get the sort API path for the selected sorting method
   * @param sort: The sort type
   */
  getSearchPath(sort: Sorting) {
    let pathSearch = 'search/';
    if (sort !== Sorting.Relevance) {
      pathSearch = 'search_by_date/';
    }
    return pathSearch;
  }

  /**
   * Get more result from the same query
   */
  getMoreStory() {
    this.currentNOfStory += this.initialNStory;
    const options = {
      params: new HttpParams()
        .set('hitsPerPage', (this.currentNOfStory + this.initialNStory).toString())
        .set('tags', 'story')
        .set('attributesToRetrieve', 'objectID')
        .set('attributesToHighlight', 'none')
        .set('page', '0')
        .set('query', this.searchTerm)
    };
    this.http.get<number[]>(this.baseApiUrl + this.getSearchPath(this.sorting), options)
      .pipe(
        catchError(this.handleError(null)),
        mergeMap(result => {
          return of(result.hits.slice(this.currentNOfStory, this.currentNOfStory + this.initialNStory)
            .map(s => parseInt(s.objectID, 10)));
        })
      ).subscribe(IDs => this.searchIDs = this.searchIDs.concat(IDs));
  }

  /**
   * Change the sorting type
   * @param sort: the sorting type
   */
  changeSorting(sort: Sorting) {
    if (this.sorting !== sort) {
      this.sorting = sort;
      this.searchStory(this.searchTerm, sort);
    }
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
