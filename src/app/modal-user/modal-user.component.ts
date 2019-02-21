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

  @ViewChild('closeAccountDialog') closeBtn: ElementRef;

  error = {'title': '', 'desc': ''};

  constructor(private hackerNewsAccount: HackerNewsUserService) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm, register: boolean) {
    if (form.valid) {
      this.hackerNewsAccount.login(form.value.username, form.value.password, register)
        .subscribe(res => {
          if (res === Login.Ok) {
            this.closeBtn.nativeElement.click();
            alert('correct login');
          } else {
            this.error.title = 'Bad login !';
            this.error.desc = 'Wrong username or password';
          }
        });
    }
  }
}
