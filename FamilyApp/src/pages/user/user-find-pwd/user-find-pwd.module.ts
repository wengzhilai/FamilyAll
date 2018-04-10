import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserFindPwdPage } from './user-find-pwd';

@NgModule({
  declarations: [
    UserFindPwdPage,
  ],
  imports: [
    IonicPageModule.forChild(UserFindPwdPage),
  ],
})
export class UserFindPwdPageModule {}
