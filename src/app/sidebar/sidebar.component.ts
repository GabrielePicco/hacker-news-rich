import { Component, OnInit } from '@angular/core';
import {HN_SECTION} from '../hacker-news.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  section: string[];

  constructor() { }

  ngOnInit() {
    this.section = HN_SECTION.map(s => s.name);
  }

}
