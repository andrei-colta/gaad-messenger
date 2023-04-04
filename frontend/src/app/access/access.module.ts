import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AccessService } from './access.service';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [LoginComponent, SignupComponent],
  providers: [AccessService]
})
export class AccessModule { }
