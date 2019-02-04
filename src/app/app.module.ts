import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FeedComponent } from './feed/feed.component';
import { FeedItemComponent } from './feed-item/feed-item.component';
import { NavbarComponent } from './navbar/navbar.component';
import { EmojifyModule } from 'angular-emojify';
import { PostComponent } from './post/post.component';
import { ProfileSidebarComponent } from './profile-sidebar/profile-sidebar.component';
import { CommentComponent } from './comment/comment.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileActivityComponent } from './profile-activity/profile-activity.component';

@NgModule({
  declarations: [
    AppComponent,
    FeedComponent,
    FeedItemComponent,
    NavbarComponent,
    PostComponent,
    ProfileSidebarComponent,
    CommentComponent,
    ProfileComponent,
    ProfileActivityComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    InfiniteScrollModule,
    EmojifyModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
