import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HackerNewsService, HN_SECTION} from '../hacker-news.service';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  ids: number[];
  current_section = HN_SECTION[0].name;

  constructor(private route: ActivatedRoute, private hackerNewsService: HackerNewsService,
              @Inject(DOCUMENT) private document) { }

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      if (routeParams.section != null) {
        this.current_section = routeParams.section;
      } else {
        this.current_section = HN_SECTION[0].name;
      }
      this.ids = [];
      window.scroll(0, 0);
      this.hackerNewsService.getNewsIDs(this.current_section).subscribe(ids => this.ids = ids);
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
