import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthLoginPage } from './auth-login';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    AuthLoginPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(AuthLoginPage),
  ],
})
export class AuthLoginPageModule {}
