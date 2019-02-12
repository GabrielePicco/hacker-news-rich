import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { SearchComponent } from './search/search.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { ShareModule } from '@ngx-share/core';

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
    ProfileActivityComponent,
    SearchComponent,
    SidebarComponent,
    HeaderComponent,
    SearchResultsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    InfiniteScrollModule,
    EmojifyModule,
    ShareModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
