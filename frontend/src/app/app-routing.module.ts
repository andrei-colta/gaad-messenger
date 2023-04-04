import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './access/login/login.component';
import { SignupComponent } from './access/signup/signup.component';
import { FriendsComponent } from './messenger/friends/friends.component';
import { MessengerComponent } from './messenger/messenger/messenger.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { ProfileComponent } from './profile/profile/profile.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'friends', component: FriendsComponent },
  { path: 'messenger', component: MessengerComponent },
  { path: '', component: MessengerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
