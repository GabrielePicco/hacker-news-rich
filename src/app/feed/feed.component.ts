import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HackerNewsService, HN_SECTION} from '../hacker-news.service';
import {DOCUMENT} from '@angular/common';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  ids: number[];
  currentSection = HN_SECTION[0].name;

  constructor(private titleService: Title, private route: ActivatedRoute, private hackerNewsService: HackerNewsService,
              @Inject(DOCUMENT) private document) { }

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      this.currentSection = routeParams.section;
      this.titleService.setTitle(`${this.hackerNewsService.TITLE} => ${this.currentSection}`);
      this.ids = [];
      window.scroll(0, 0);
      if (this.ids === undefined || this.ids.length === 0) {
        this.hackerNewsService.getNewsIDs(this.currentSection).subscribe(ids => this.ids = ids);
      }
      this.document.activeElement.blur();
    });
  }

  onScroll() {
    this.hackerNewsService.getNextNewsIDs()
      .subscribe(ids => {
        this.ids = this.ids.concat(ids);
      });
  }
}
