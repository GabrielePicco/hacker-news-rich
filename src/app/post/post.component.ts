import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Story} from '../story';
import {HackerNewsService} from '../hacker-news.service';
import {DomSanitizer, Title} from '@angular/platform-browser';
import {HackerNewsUserService} from '../hacker-news-user.service';
import {Comment} from '../comment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  post = {comments : [], article : undefined};
  replyComment: Comment;
  replyText: string;
  private id: number;
  private startIndex = 0;
  private pageSize = 3;

  constructor(private titleService: Title,
              private route: ActivatedRoute,
              private hackerNewsService: HackerNewsService,
              public hackerNewsUserService: HackerNewsUserService,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.hackerNewsService.getStoryByID(this.id).subscribe((item: Story) => {
      this.post.article = item;
      this.hackerNewsService.getEnrichedStory(this.post.article).subscribe(itemRich => {
        this.post.article = itemRich;
        this.post.article.content = this.sanitizer.bypassSecurityTrustHtml(this.post.article.content);
      });
      this.titleService.setTitle(item.title);
      this.onScroll();
    });
  }

  onScroll() {
    this.post.comments = this.post.comments.concat(this.post.article.kids.slice(this.startIndex, this.startIndex + this.pageSize));
    this.startIndex += this.pageSize;
  }

  addComment(parentId: string, text: string) {
    if (text.length > 0) {
      this.replyComment = new Comment(this.hackerNewsUserService.username, text, Date.now().toString());
      this.hackerNewsUserService.comment(parentId, text);
    }
  }
}
