import { Injectable, OnInit } from "@angular/core";
import sha256 from "crypto-js/sha256";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { SocketService } from "../socket.service";

@Injectable({
  providedIn: "root",
})
export class AccessService implements OnInit {
  rootURL = "https://node.startupskylab.com/medical/";
  signupURL = this.rootURL + "gd_signup";
  loginURL = this.rootURL + "gd_login";
  alertTimeout = 2000;

  loggedObservable = new Subject<boolean>();

  constructor(private http: HttpClient, private socketService: SocketService) {}

  ngOnInit() {
    this.loggedObservable.next(localStorage.getItem("user_id") !== null);
  }

  signup(email, password) {
    console.log("email is " + email);
    const input = {
      email: email,
      password: sha256(password).toString(),
    };

    return new Promise<any>((resolve) => {
      this.http.post(this.signupURL, input).subscribe((response) => {
        resolve(response);
      });
    });
  }

  login(email, password) {
    const input = {
      email: email,
      password: sha256(password).toString(),
    };

    return new Promise<any>((resolve) => {
      this.http.post(this.loginURL, input).subscribe((response: any) => {
        if (response.status === "LoginSuccessful") {
          this.socketService.initSocket(response.data.id);
        }
        resolve(response);
      });
    });
  }

  logout() {
    localStorage.clear();
    this.socketService.closeSocket();
    this.loggedObservable.next(false);
  }
}
