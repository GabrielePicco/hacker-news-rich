import { Component, OnInit } from '@angular/core';
import {HackerNewsService} from '../hacker-news.service';
import {User} from '../user';
import {ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User;
  username: string;
  current = {activities : []};
  private startIndex = 0;
  private pageSize = 5;

  constructor(private titleService: Title, private route: ActivatedRoute, private hackerNewsService: HackerNewsService) { }

  ngOnInit() {
    this.username = this.route.snapshot.params['username'];
    this.hackerNewsService.getUserByUsername(this.username).subscribe(user => {
      this.user = user;
      this.onScroll();
      this.titleService.setTitle(user.id);
    });
  }

  onScroll() {
    this.current.activities = this.current.activities.concat(this.user.submitted.slice(this.startIndex, this.startIndex + this.pageSize));
    this.startIndex += this.pageSize;
  }
}
