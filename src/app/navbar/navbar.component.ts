import { Component, OnInit } from '@angular/core';
import {HackerNewsService, HN_SECTION} from '../hacker-news.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  section: string[];
  constructor(public hackerNewsService: HackerNewsService) { }

  ngOnInit() {
    this.section = HN_SECTION.map(s => s.name);
  }

}
