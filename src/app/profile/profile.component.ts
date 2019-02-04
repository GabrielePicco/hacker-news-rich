import { Component, OnInit } from '@angular/core';
import {HackerNewsService} from '../hacker-news.service';
import {User} from '../user';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private user: User;
  private username: string;
  private current = {activities : []};
  private startIndex = 0;
  private pageSize = 5;

  constructor(private route: ActivatedRoute, private hackerNewsService: HackerNewsService) { }

  ngOnInit() {
    this.username = this.route.snapshot.params['username'];
    this.hackerNewsService.getUserByUsername(this.username).subscribe(user => {
      this.user = user;
      this.onScroll();
    });
  }

  onScroll() {
    this.startIndex += this.pageSize;
    this.current.activities = this.current.activities.concat(this.user.submitted.slice(this.startIndex, this.startIndex + this.pageSize));
  }
}
