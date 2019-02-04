import {Component, Input, OnInit} from '@angular/core';
import {HackerNewsService} from '../hacker-news.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() id: number;
  comment: Comment;

  constructor(private hackerNewsService: HackerNewsService) { }

  ngOnInit() {
    this.hackerNewsService.getCommentByID(this.id).subscribe(comment => this.comment = comment);
  }

}
