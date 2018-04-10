import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserRegPage } from './user-reg';

@NgModule({
  declarations: [
    UserRegPage,
  ],
  imports: [
    IonicPageModule.forChild(UserRegPage),
  ],
})
export class UserRegPageModule {}
