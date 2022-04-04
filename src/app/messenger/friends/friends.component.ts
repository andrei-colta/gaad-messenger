import { Component, OnInit } from '@angular/core';
import { MessengerService } from '../messenger.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-friends',
    templateUrl: './friends.component.html',
    styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

    myFriends = [];
    friendIDs = [localStorage.getItem('user_id')];
    results = [];
    searchWord = '';
    myID = localStorage.getItem('user_id');

    constructor(private messengerService: MessengerService, private router: Router) { }

    ngOnInit() {
        this.getFriends();
    }

    getFriends() {
        this.friendIDs = [this.myID];
        this.messengerService.getFriends()
            .then((response) => {
                console.log(response);
                if (response.status === 'DataRetrieved') {
                    this.myFriends = response.data;
                    this.friendIDs = response.friendIDs;
                    this.friendIDs.push(this.myID);
                }
            });
    }

    search() {
        this.messengerService.search(this.searchWord, this.friendIDs)
            .then((response) => {
                console.log(response);
                if (response.status === 'DataRetrieved') {
                    this.results = response.data;
                    this.results.forEach(f => {
                        f.age = ((new Date().getTime() - new Date(f.birthday).getTime()) / (365 * 24 * 3600000))
                            .toString().split('.')[0];
                    });
                }
            });
    }

    sendRequest(friend_id) {
        this.messengerService.sendRequest(friend_id)
            .then((response) => {
                console.log(response);
                this.friendIDs = [this.myID];
                this.messengerService.getFriends()
                    .then((resp) => {
                        console.log(resp);
                        if (resp.status === 'DataRetrieved') {
                            this.myFriends = resp.data;
                            this.friendIDs = resp.friendIDs;
                            this.friendIDs.push(this.myID);
                        }

                        this.search();
                    });
            });
    }

    removeFriend(f) {
        let friend_id;
        if (f.id_user.toString() === this.myID.toString()) {
            friend_id = f.id_friend;
        } else {
            friend_id = f.id_user;
        }

        this.messengerService.removeFriend(friend_id)
            .then((response) => {
                console.log(response);
                this.getFriends();
            });
    }

}
