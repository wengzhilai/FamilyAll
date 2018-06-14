import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageListPage } from './message-list';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    MessageListPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(MessageListPage),
  ],
})
export class MessageListPageModule {}
