import {Component, Input, OnInit} from '@angular/core';
import {Story} from '../story';
import {HackerNewsService} from '../hacker-news.service';
import {HackerNewsUserService} from '../hacker-news-user.service';

@Component({
  selector: 'app-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.css']
})
export class FeedItemComponent implements OnInit {

  @Input() itemID: number;
  @Input() showLoading: false;
  item: Story = undefined;
  direction = 'up';

  constructor(private hackerNewsService: HackerNewsService,
              public hackerNewsUserService: HackerNewsUserService) { }

  ngOnInit() {
    this.hackerNewsService.getStoryByID(this.itemID).subscribe(item => {
      this.item = item;
      this.hackerNewsService.getEnrichedStory(this.item).subscribe(itemRich => this.item = itemRich);
    });
  }

  vote(id: string) {
    this.hackerNewsUserService.vote(id, this.direction);
    if (this.direction === 'up') {
      this.item.score += 1;
      this.direction = 'un';
    } else {
      this.item.score -= 1;
      this.direction = 'up';
    }
  }
}
