import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FeedComponent} from './feed/feed.component';
import {PostComponent} from './post/post.component';
import {ProfileComponent} from './profile/profile.component';
import {HN_SECTION} from './hacker-news.service';

const routes: Routes = [
  { path: '', redirectTo: '/feed/' + HN_SECTION[0].name, pathMatch: 'full' },
  { path: 'feed/:section', component: FeedComponent},
  { path: 'post/:id', component: PostComponent},
  { path: 'profile/:username', component: ProfileComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
