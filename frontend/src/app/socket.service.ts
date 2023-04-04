import { Injectable, OnInit } from '@angular/core';
import { Message } from './model/message';
import { Event } from './model/event';

import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs';


const SERVER_URL = 'https://node.startupskylab.com';

@Injectable()
export class SocketService implements OnInit {
    private socket;
    isRunning;
    unreadMessages = [];
    missedCalls: any;
    callingfromid: any;
    callingSession: any;

    ngOnInit() {
        this.isRunning = false;
    }

    public initSocket(my_id): void {
        if (!this.isRunning) {
            this.socket = socketIo(SERVER_URL, {
                path: '/messenger/socket.io', serveClient: false,
                // below are engine.IO options
                pingInterval: 10000,
                pingTimeout: 5000,
                cookie: false
            });
        }
        this.isRunning = true;
        this.socket.emit('init', { my_id: my_id });
        console.log(this.socket);
        this.subscribeUnread().subscribe(data => {
            console.log('UNREAD ', data);
            this.unreadMessages = data;
            // setTimeout(() => {
            // }, 200);
        });
    }

    public initMap(my_id): void {
        this.socket.emit('init', { my_id: my_id });
    }

    public connectSocket(): void {
        this.socket.open();
    }

    public closeSocket(): void {
        this.isRunning = false;
        this.socket.emit('disconnect');
        this.socket.close();
    }

    public send(message: Message): void {
        console.log(message);
        this.socket.emit('message', message);
    }

    public emitClearUnread(otherID, my_id) {
        console.log('CLEAR UNREAD FOR ' + otherID);
        this.socket.emit('clear_unread', { otherID: otherID, my_id: my_id });
    }

    public onMessage(): Observable<Message> {
        return new Observable<Message>(observer => {
            if (this.isRunning) {
                this.socket.on('message', (data: Message) => observer.next(data));

                this.socket.on('disconnect', (data) => { this.isRunning = false; });
            }
        });
    }

    public subscribeUnread() {
        return new Observable<any>(observer => {
            this.socket.on('unread', (data: any) => observer.next(data));
        });
    }

    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }

    public forceDisconnect() {
        if (this.isRunning) {
            this.socket.emit('disconnect');
            this.isRunning = false;
        }
    }
}
