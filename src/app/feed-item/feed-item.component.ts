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
  article = {story : undefined}
  direction = 'up';

  constructor(private hackerNewsService: HackerNewsService,
              public hackerNewsUserService: HackerNewsUserService) { }

  ngOnInit() {
    this.hackerNewsService.getStoryByID(this.itemID).subscribe((item: Story) => {
      this.article.story = item;
      this.hackerNewsService.getEnrichedStory(this.article.story).subscribe(itemRich => {
        this.article.story = itemRich;
      });
    });
  }

  vote(id: string) {
    this.hackerNewsUserService.vote(id, this.direction);
    if (this.direction === 'up') {
      this.article.story.score += 1;
      this.direction = 'un';
    } else {
      this.article.story.score -= 1;
      this.direction = 'up';
    }
  }
}
