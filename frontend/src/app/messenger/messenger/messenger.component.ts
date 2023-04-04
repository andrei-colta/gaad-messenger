import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from "@angular/core";
import { MessengerService } from "../messenger.service";
import { SocketService } from "src/app/socket.service";

@Component({
  selector: "app-messenger",
  templateUrl: "./messenger.component.html",
  styleUrls: ["./messenger.component.css"],
})
export class MessengerComponent implements OnInit, AfterViewChecked {
  @ViewChild("scrollable") scrollable: ElementRef;

  friendIDs = [];
  myID = localStorage.getItem("user_id");
  myFriends = [];
  selectedFriend;
  friendPicture;
  ownPicture = localStorage.getItem("picture");
  message = "";
  messages;
  user;
  scrollOnce = true;

  constructor(
    private messengerService: MessengerService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    // this.user = { id: this.myID, name: this.name, avatar: this.avatar };
    setTimeout(() => {
      if (!this.socketService.isRunning) {
        console.log("ma initiez");
        // this.socketService.initSocket(this.myID);
      }
      this.socketService.onMessage().subscribe((message) => {
        console.log("RECEIVED " + message);
        console.log(message);
        if (
          this.selectedFriend &&
          (message.from.toString() === this.selectedFriend.toString() ||
            message.from.toString() === this.myID.toString())
        ) {
          if (this.sameDay(new Date(message.dt_send), new Date())) {
            message.sameDay = true;
          }

          if (this.messages) {
            this.messages.push(message);
          } else {
            this.messages = [message];
          }
          this.scrollOnce = true;
          this.scrollToBottom();
        }
      });
    }, 200);

    this.getFriends();
  }

  ngAfterViewChecked() {
    if (this.scrollOnce) {
      this.scrollToBottom();
      this.scrollOnce = false;
    }
  }

  scrollToBottom() {
    try {
      this.scrollable.nativeElement.scrollTop =
        this.scrollable.nativeElement.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  }

  clearConversation() {
    this.messengerService
      .clearConversation(this.selectedFriend)
      .then((response) => {
        console.log(response);
        this.getMessages();
      });
  }

  sendMessage(): void {
    const message = this.message;

    if (!message) {
      return;
    }

    this.socketService.send({
      from: this.myID, // this.user,
      to: this.selectedFriend.toString(),
      // conv_id: this.id,
      message: message,
    });
    this.message = null;
    console.log("trimit mesaj");
    // this.inputForm.reset();
  }

  getFriends() {
    this.friendIDs = [this.myID];
    this.messengerService.getFriends().then((response) => {
      console.log(response);
      if (response.status === "DataRetrieved") {
        this.myFriends = response.data;
        this.myFriends.forEach((f) => {
          f.selected = false;
          this.socketService.unreadMessages.forEach((u) => {
            console.log(u, f);
            if (
              u[0].toString() === f.id_user.toString() ||
              u[0].toString() === f.id_friend.toString()
            ) {
              console.log("salut");
              f.unread = u[1];
            }
          });
        });
        this.friendIDs = response.friendIDs;
        this.friendIDs.push(this.myID);
      }
    });
  }

  getMessages() {
    this.messengerService.getMessages(this.selectedFriend).then((response) => {
      console.log(response);
      this.messages = response.data;
      this.messages.forEach((m) => {
        if (this.sameDay(new Date(m.dt_send), new Date())) {
          m.sameDay = true;
        }
      });
      this.scrollOnce = true;
      this.scrollToBottom();
    });
  }

  sameDay(d1, d2) {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  selectFriend(f) {
    this.myFriends.forEach((fr) => {
      if (fr.id !== f.id) {
        fr.selected = false;
      }
    });

    f.selected = !f.selected;

    if (f.selected) {
      if (f.id_user.toString() === this.myID.toString()) {
        this.selectedFriend = f.id_friend;
      } else {
        this.selectedFriend = f.id_user;
      }
      this.friendPicture = f.picture;

      this.socketService.emitClearUnread(this.selectedFriend, this.myID);
      f.unread = 0;
      this.getMessages();
    } else {
      this.selectedFriend = null;
    }
  }
}
