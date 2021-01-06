import {Component, Input, OnInit} from '@angular/core';
import {HackerNewsUserService} from '../_services/hacker-news-user.service';

@Component({
  selector: 'app-vote-button',
  templateUrl: './vote-button.component.html',
  styleUrls: ['./vote-button.component.css']
})
export class VoteButtonComponent implements OnInit {

  @Input() itemId: string;
  direction = 'up';

  constructor(public hackerNewsUserService: HackerNewsUserService) { }

  ngOnInit() {
  }

  vote() {
    this.hackerNewsUserService.vote(this.itemId, this.direction);
    if (this.direction === 'up') {
      this.direction = 'un';
    } else {
      this.direction = 'up';
    }
  }
}
