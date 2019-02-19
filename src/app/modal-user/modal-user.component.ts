import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {HackerNewsUserService} from '../hacker-news-user.service';
import {Login} from '../login.enum';

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.css']
})
export class ModalUserComponent implements OnInit {

  constructor(private hackerNewsAccount: HackerNewsUserService) { }

  ngOnInit() {
  }

  onLogin(login: NgForm) {
    if (login.valid) {
      this.hackerNewsAccount.login(login.value.username, login.value.password)
        .subscribe(res => {
          if (res === Login.Ok) {
            alert('Login correct');
          } else {
            alert('login not correct !');
          }
        });
    }
  }
}
