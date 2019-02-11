import {Component, Input, OnInit} from '@angular/core';
import {Story} from '../story';
import {HackerNewsService} from '../hacker-news.service';

@Component({
  selector: 'app-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.css']
})
export class FeedItemComponent implements OnInit {

  @Input() itemID: number;
  @Input() showLoading: false;
  item: Story = undefined;

  constructor(private hackerNewsService: HackerNewsService) { }

  ngOnInit() {
    this.hackerNewsService.getEnrichedStoryByID(this.itemID).subscribe(item => this.item = item);
  }

}
