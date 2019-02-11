import {Component, OnInit} from '@angular/core';
import {HackerNewsSearchService} from '../hacker-news-search.service';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {Sorting} from '../sorting.enum';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  sort = new FormGroup({
    by: new FormControl('date'),
  });

  constructor(public hackerNewsSearchService: HackerNewsSearchService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.hackerNewsSearchService.searchStory(
      this.route.snapshot.queryParamMap.get('query'),
      this.getSortingType(this.sort.value.by));
  }

  onChange() {
    if (this.sort.value.by === 'relevance') {
      this.hackerNewsSearchService.changeSorting(Sorting.Relevance);
    } else {
      this.hackerNewsSearchService.changeSorting(Sorting.Date);
    }
  }

  private getSortingType(sort: string): Sorting {
    if (sort === 'relevance') {
      return Sorting.Relevance;
    } else {
      return Sorting.Date;
    }
  }
}
