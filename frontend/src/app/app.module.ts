import { AppComponent } from "./app.component";
import { NavbarComponent } from "src/common/navbar/navbar.component";
import { AccessModule } from "./access/access.module";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./auth.interceptor";
import { ProfileModule } from "./profile/profile.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MessengerModule } from "./messenger/messenger.module";
import { SocketService } from "./socket.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";

const config: SocketIoConfig = {
  url: "http://localhost:8080",
  options: {
    path: "/messenger",
  },
};

@NgModule({
  declarations: [AppComponent, NavbarComponent],
  imports: [
    BrowserModule,
    AccessModule,
    MessengerModule,
    NgbModule,
    BrowserAnimationsModule,
    ProfileModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    SocketService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
