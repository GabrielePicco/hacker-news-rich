import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Story} from '../story';
import {HackerNewsService} from '../hacker-news.service';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  post = {comments : []};
  item: Story;
  private id: number;
  private startIndex = 0;
  private pageSize = 3;

  constructor(private titleService: Title, private route: ActivatedRoute, private hackerNewsService: HackerNewsService) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.hackerNewsService.getEnrichedStoryByID(this.id).subscribe(item => {
      this.item = item;
      this.titleService.setTitle(item.title);
      this.onScroll();
    });
  }

  onScroll() {
    this.post.comments = this.post.comments.concat(this.item.kids.slice(this.startIndex, this.startIndex + this.pageSize));
    this.startIndex += this.pageSize;
  }
}
