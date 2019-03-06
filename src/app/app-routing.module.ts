import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FeedComponent} from './feed/feed.component';
import {PostComponent} from './post/post.component';
import {ProfileComponent} from './profile/profile.component';
import {HN_SECTION} from './hacker-news.service';
import {SearchComponent} from './search/search.component';

const routes: Routes = [
  { path: '', redirectTo: '/' + HN_SECTION[0].name, pathMatch: 'full' },
  { path: ':section', component: FeedComponent},
  { path: 'post/:id', component: PostComponent},
  { path: 'profile/:username', component: ProfileComponent},
  { path: 'search', component: SearchComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
