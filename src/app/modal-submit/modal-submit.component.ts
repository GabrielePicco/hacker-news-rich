import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {HackerNewsUserService} from '../hacker-news-user.service';
import {Submit} from '../submit.enum';
import {Router} from '@angular/router';
import {HN_SECTION} from '../hacker-news.service';

@Component({
  selector: 'app-modal-submit',
  templateUrl: './modal-submit.component.html',
  styleUrls: ['./modal-submit.component.css']
})
export class ModalSubmitComponent implements OnInit {

  @ViewChild('closeAccountDialog') closeBtn: ElementRef;

  error = {'title': '', 'desc': ''};
  loading = false;

  constructor(private router: Router,
              private hackerNewsUserService: HackerNewsUserService) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm, url = true) {
    if (form.valid) {
      this.error.title = '';
      this.loading = true;
      this.hackerNewsUserService.submit(form.value.title, form.value.content, url)
        .subscribe(res => {
          this.loading = false;
          if (res === Submit.Ok) {
            this.closeBtn.nativeElement.click();
            this.router.navigate([`/${HN_SECTION[1].name}`]);
          } else if (res === Submit.ExistingLink) {
            this.closeBtn.nativeElement.click();
            this.router.navigate([`/post/${this.hackerNewsUserService.existingArticleId}`]);
          } else if (res === Submit.InvalidLink) {
            this.error.title = 'Error !';
            this.error.desc = 'Invalid';
          } else if (res === Submit.TooFast) {
            this.error.title = 'Error !';
            this.error.desc = 'You\'re posting too fast. Please slow down. Thanks.';
          }
        });
    }
  }

}
