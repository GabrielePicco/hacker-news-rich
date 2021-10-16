import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {DOCUMENT, Location} from '@angular/common';
import {HackerNewsSearchService} from '../_services/hacker-news-search.service';
import {NgForm} from '@angular/forms';
import {HackerNewsUserService} from '../_services/hacker-news-user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @ViewChild('header', {static: false}) header: ElementRef;

  constructor( private router: Router,
               private location: Location,
               private hackerNewsSearchService: HackerNewsSearchService,
               public hackerNewsUserService: HackerNewsUserService,
               @Inject(DOCUMENT) public document: Document) {
  }

  ngOnInit() {
  }

  onSearchChange(term: string) {
    const searchPath = '/hn/search';
    this.location.go(searchPath + '?query=' + term);
    this.router.navigate([searchPath]);
    this.hackerNewsSearchService.searchStory(term);
  }

  onSearchSubmit(form: NgForm) {
    this.hackerNewsSearchService.searchStory(form.value.query);
  }

  logout() {
    this.header.nativeElement.click();
    this.hackerNewsUserService.logout();
  }
}
