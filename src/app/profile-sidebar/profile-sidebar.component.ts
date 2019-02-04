import {Component, Input, OnInit} from '@angular/core';
import {HackerNewsService} from '../hacker-news.service';
import {User} from '../user';

@Component({
  selector: 'app-profile-sidebar',
  templateUrl: './profile-sidebar.component.html',
  styleUrls: ['./profile-sidebar.component.css']
})
export class ProfileSidebarComponent implements OnInit {

  @Input() by: string;
  user: User;

  constructor(private hackerNewsService: HackerNewsService) { }

  ngOnInit() {
    this.hackerNewsService.getUserByUsername(this.by).subscribe(user => this.user = user);
  }

}
