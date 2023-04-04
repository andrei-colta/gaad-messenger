import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavbarComponent } from 'src/common/navbar/navbar.component';
import { LoginComponent } from './access/login/login.component';
import { SignupComponent } from './access/signup/signup.component';
import { AccessModule } from './access/access.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileModule } from './profile/profile.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from './profile/profile/profile.component';
import { FriendsComponent } from './messenger/friends/friends.component';
import { MessengerComponent } from './messenger/messenger/messenger.component';
import { MessengerModule } from './messenger/messenger.module';
import { SocketService } from './socket.service';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AccessModule,
        MessengerModule,
        NgbModule,
        BrowserAnimationsModule,
        ProfileModule,
        RouterModule.forRoot([
            { path: 'login', component: LoginComponent },
            { path: 'signup', component: SignupComponent },
            { path: 'edit-profile', component: EditProfileComponent },
            { path: 'profile/:id', component: ProfileComponent },
            { path: 'friends', component: FriendsComponent },
            { path: 'messenger', component: MessengerComponent },
            { path: '', component: MessengerComponent }
        ])
    ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, SocketService],
    bootstrap: [AppComponent]
})
export class AppModule { }
