import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendsComponent } from './friends/friends.component';
import { MessengerService } from './messenger.service';
import { MessengerComponent } from './messenger/messenger.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgbTooltipModule
    ],
    declarations: [FriendsComponent, MessengerComponent],
    providers: [MessengerService]
})
export class MessengerModule { }
