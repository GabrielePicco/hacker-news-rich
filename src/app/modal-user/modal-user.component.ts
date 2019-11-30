import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {HackerNewsUserService} from '../hacker-news-user.service';
import {Login} from '../login.enum';

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.css']
})
export class ModalUserComponent implements OnInit {

  @ViewChild('closeAccountDialog', {static: false}) closeBtn: ElementRef;

  error = {'title': '', 'desc': ''};
  loading = false;

  constructor(private hackerNewsAccount: HackerNewsUserService) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm, register: boolean) {
    if (form.valid) {
      this.error.title = '';
      this.loading = true;
      this.hackerNewsAccount.login(form.value.username, form.value.password, register)
        .subscribe(res => {
          this.loading = false;
          if (res === Login.Ok) {
            this.closeBtn.nativeElement.click();
          } else if (res === Login.UserAlreadyExist) {
            this.error.title = 'Error !';
            this.error.desc = 'That username is taken. Please choose another.';
          } else {
            this.error.title = 'Bad login !';
            this.error.desc = 'Wrong username or password';
          }
        });
    }
  }
}
