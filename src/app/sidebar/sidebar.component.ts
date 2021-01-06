import {Component, Inject, OnInit} from '@angular/core';
import {HN_SECTION} from '../_services/hacker-news.service';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {DOCUMENT, Location} from '@angular/common';
import {HackerNewsSearchService} from '../_services/hacker-news-search.service';
import {HackerNewsUserService} from '../_services/hacker-news-user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  section: string[];

  constructor( private router: Router,
               private location: Location,
               private hackerNewsSearchService: HackerNewsSearchService,
               public hackerNewsUserService: HackerNewsUserService,
               @Inject(DOCUMENT) private document) { }

  ngOnInit() {
    this.section = HN_SECTION.map(s => s.name);
  }

  onSearchChange(term: string) {
    const searchPath = '/hn/search';
    this.location.go(searchPath + '?query=' + term);
    this.router.navigate([searchPath]);
    this.hackerNewsSearchService.searchStory(term);
  }

  onSearchSubmit(form: NgForm) {
    this.hackerNewsSearchService.searchStory(form.value.query);
    this.document.activeElement.blur();
    this.closeSlidebar();
  }


  closeSlidebar() {
    // const t = $('.ms-slidebar');
    // t.removeClass('open');
  }

}
