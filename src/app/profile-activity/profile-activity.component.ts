import {Component, Input, OnInit} from '@angular/core';
import {HackerNewsService} from '../hacker-news.service';
import {Story} from '../story';

@Component({
  selector: 'app-profile-activity',
  templateUrl: './profile-activity.component.html',
  styleUrls: ['./profile-activity.component.css']
})
export class ProfileActivityComponent implements OnInit {

  @Input() id: number;
  item;
  parentStory: Story;

  constructor(private hackerNewsService: HackerNewsService) { }

  ngOnInit() {
    this.hackerNewsService.getCommentOrStory(this.id).subscribe(item => {
      this.item = item;
      if (item.type === 'comment') {
        this.hackerNewsService.getParentStoryByID(item.parent).subscribe(story => this.parentStory = story);
      }
    });
  }

}
