import { Component, OnInit } from '@angular/core';
import {HackerNewsSearchService} from '../_services/hacker-news-search.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  constructor(public hackerNewsSearchService: HackerNewsSearchService) { }

  ngOnInit() {
  }

  onScroll() {
    this.hackerNewsSearchService.getMoreStory();
  }

}
