import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthRegPage } from './auth-reg';

@NgModule({
  declarations: [
    AuthRegPage,
  ],
  imports: [
    IonicPageModule.forChild(AuthRegPage),
  ],
})
export class AuthRegPageModule {}
