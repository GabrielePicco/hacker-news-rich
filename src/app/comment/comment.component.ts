import {Component, Input, OnInit} from '@angular/core';
import {HackerNewsService} from '../hacker-news.service';
import {Comment} from '../comment';
import {HackerNewsUserService} from '../hacker-news-user.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() id: number;
  comment: Comment;
  showReply = false;
  replyText: string;
  replyComment: Comment;

  constructor(private hackerNewsService: HackerNewsService,
              public hackerNewsUserService: HackerNewsUserService) { }

  ngOnInit() {
    this.hackerNewsService.getCommentByID(this.id).subscribe(comment => this.comment = comment);
  }

  addComment(parentId: string, text: string) {
    if (text.length > 0) {
      this.showReply = false;
      this.replyComment = new Comment();
      this.replyComment.by = this.hackerNewsUserService.username;
      this.replyComment.text = text;
      this.replyComment.time = Date.now().toString();
      this.hackerNewsUserService.comment(parentId, text);
    }
  }
}
