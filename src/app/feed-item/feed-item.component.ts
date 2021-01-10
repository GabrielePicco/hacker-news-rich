import {Component, Input, OnInit} from '@angular/core';
import {Story} from '../_models/story';
import {HackerNewsService} from '../_services/hacker-news.service';
import {HackerNewsUserService} from '../_services/hacker-news-user.service';

@Component({
  selector: 'app-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.css']
})
export class FeedItemComponent implements OnInit {

  @Input() itemID: number;
  @Input() animateIn = false;
  @Input() showLoading = false;
  article = {story : undefined};
  direction = 'up';

  constructor(private hackerNewsService: HackerNewsService,
              public hackerNewsUserService: HackerNewsUserService) { }

  ngOnInit() {
    this.hackerNewsService.getStoryByID(this.itemID).subscribe((story: Story) => {
      this.hackerNewsService.getEnrichedStory(story).subscribe(itemRich => {
        this.article.story = itemRich;
      });
      this.article.story = story;
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

  onImgError(event, title: string) {
    event.target.src = this.hackerNewsService.getDefaultImage(title);
  }
}
