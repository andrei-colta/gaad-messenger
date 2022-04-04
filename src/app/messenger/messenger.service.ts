import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class MessengerService {

    rootURL = 'https://node.startupskylab.com/medical/';
    getFriendsURL = this.rootURL + 'gd_getFriends';
    searchURL = this.rootURL + 'gd_search';
    sendRequestURL = this.rootURL + 'gd_addFriend';
    removeFriendURL = this.rootURL + 'gd_removeFriend';
    getMessagesURL = this.rootURL + 'gd_getMessages';
    clearMessagesURL = this.rootURL + 'gd_clearMessages';

    constructor(private http: HttpClient) { }

    getFriends() {
        return new Promise<any>(resolve => {
            this.http.get(this.getFriendsURL)
                .subscribe((response) => {
                    resolve(response);
                });
        });
    }

    search(keyword, badIDs) {
        return new Promise<any>(resolve => {
            this.http.get(this.searchURL, { params: { search: keyword, badIDs: badIDs } })
                .subscribe((response) => {
                    resolve(response);
                });
        });
    }

    sendRequest(friend_id) {
        return new Promise<any>(resolve => {
            this.http.post(this.sendRequestURL, { friend_id: friend_id })
                .subscribe((response) => {
                    resolve(response);
                });
        });
    }

    removeFriend(friend_id) {
        return new Promise<any>(resolve => {
            this.http.post(this.removeFriendURL, { friend_id: friend_id })
                .subscribe((response) => {
                    resolve(response);
                });
        });
    }

    getMessages(friend_id) {
        return new Promise<any>(resolve => {
            this.http.get(this.getMessagesURL, { params: { friend_id: friend_id } })
                .subscribe((response) => {
                    resolve(response);
                });
        });
    }

    clearConversation(friend_id) {
        return new Promise<any>(resolve => {
            this.http.get(this.clearMessagesURL, { params: { friend_id: friend_id } })
                .subscribe((response) => {
                    resolve(response);
                });
        });
    }
}
