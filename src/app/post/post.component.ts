import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Story} from '../_models/story';
import {HackerNewsService} from '../_services/hacker-news.service';
import {DomSanitizer, Title, Meta} from '@angular/platform-browser';
import {HackerNewsUserService} from '../_services/hacker-news-user.service';
import {Comment} from '../_models/comment';
import {DOCUMENT} from '@angular/common';
import {Router} from '@angular/router';

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
              private meta: Meta,
              private route: ActivatedRoute,
              private hackerNewsService: HackerNewsService,
              public hackerNewsUserService: HackerNewsUserService,
              private sanitizer: DomSanitizer,
              private router: Router,
              @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    if(this.id == 27583549){
        this.router.navigate(['/']);
    }
    this.hackerNewsService.getStoryByID(this.id).subscribe((item: Story) => {
      this.post.article = item;
      this.hackerNewsService.getEnrichedStory(this.post.article).subscribe(itemRich => {
        this.post.article = itemRich;
        this.post.article.content = this.sanitizer.bypassSecurityTrustHtml(this.getSanitizedHtml(this.post.article));
        this.setMeta(this.post.article);
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

  onImgError(event, title: string) {
    event.target.src = this.hackerNewsService.getDefaultImage(title);
  }

  /**
   * Replace localhost with proper domain and add responsive class to all images
   * @param article: the full article
   */
  private getSanitizedHtml(article: Story): string {
    const imgSrc = this.getImageSrcToRegex(article.leadImageUrl);
    return article.content
      .replace(new RegExp('<img(.)*src=\"\/', 'g'), `<img src=\"http:\/\/${article.domain}\/`)
      .replace(new RegExp('<img(.)*src=\'\/', 'g'), `<img src=\'http:\/\/${article.domain}\/`)
      .replace(new RegExp(`<img(.)*src=.${imgSrc}(.)*>`, 'g'), '')
      .replace(new RegExp('<img', 'g'), '<img class=\'img-fluid mb-4\'');
  }

  private getImageSrcToRegex(url: string): string {
    return url
      .replace(new RegExp(`\.jpg`, 'g'), '(.){0,10}\.jpg')
      .replace(new RegExp(`\.png`, 'g'), '(.){0,10}\.png')
      .replace(new RegExp(`\/`, 'g'), '.');
  }

  private setMeta(article: Story) {
    // this.meta.updateTag({ name: 'keywords', content: article.title });
    this.meta.updateTag({ name: 'description', content: article.description });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: article.title });
    this.meta.updateTag({ name: 'twitter:text:title', content: article.title });
    this.meta.updateTag({ name: 'twitter:description', content: article.description });
    this.meta.updateTag({ name: 'twitter:image', content: article.leadImageUrl });
    this.meta.updateTag({ name: 'twitter:image:alt', content: article.leadImageUrl });
    this.meta.updateTag({ property: 'og:title', content : article.title });
    this.meta.updateTag({ property: 'og:url', content: document.location.href });
    this.meta.updateTag({ property: 'og:image', content: article.leadImageUrl });
    this.meta.updateTag({ property: 'og:image:alt', content: article.leadImageUrl });
    this.meta.updateTag({ property: 'og:description', content: article.description });
  }
}
