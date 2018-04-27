import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthFindPwdPage } from './auth-find-pwd';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    AuthFindPwdPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(AuthFindPwdPage),
  ],
})
export class AuthFindPwdPageModule {}
