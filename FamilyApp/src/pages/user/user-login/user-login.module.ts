import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserLoginPage } from './user-login';
import { PipesModule } from '../../../pipes/pipes.module'

@NgModule({
  declarations: [
    UserLoginPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(UserLoginPage),
  ],
})
export class UserLoginPageModule {}
