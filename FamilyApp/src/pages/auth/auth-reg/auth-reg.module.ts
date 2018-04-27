import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthRegPage } from './auth-reg';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    AuthRegPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(AuthRegPage),
  ],
})
export class AuthRegPageModule {}
