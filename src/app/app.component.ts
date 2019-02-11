import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Hacker News';

  constructor() { }

  scrollToTop() {
    window.scroll(0, 0);
  }

}
