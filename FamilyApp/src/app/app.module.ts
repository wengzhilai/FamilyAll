import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import { MyApp } from './app.component';


import { HttpModule, JsonpModule } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { FileTransfer } from '@ionic-native/file-transfer';
import { AppVersion } from '@ionic-native/app-version';
import { Camera } from '@ionic-native/camera';
import { FileOpener } from '@ionic-native/file-opener';
import { FileChooser } from '@ionic-native/file-chooser';
import { ImagePicker } from '@ionic-native/image-picker';
import { Config } from "../Classes/Config";
import { AppGlobal } from "../Classes/AppGlobal";
import { ToPostService } from "../Service/ToPost.Service";
import { FileUpService } from "../Service/FileUp.Service";
import { CommonService } from "../Service/Common.Service";
import { TabsPage } from '../pages/tabs/tabs';

import { HttpClientModule } from "@angular/common/http";
import { JPush } from 'ionic3-jpush';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AppTranslationModule } from './app.translation.module';
import { Badge } from '@ionic-native/badge';
import { WebIntent } from '@ionic-native/web-intent';
import { FilePath } from '@ionic-native/file-path';


var CONFIG_DEMO: any = {
  backButtonText: '返回',
  iconMode: 'ios',
  mode: 'ios',
  monthShortNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
};

let apiUrl = AppGlobal.CooksGet('apiUrl');
if (apiUrl != null && apiUrl != '') {
  Config.api = apiUrl;
  Config.imgUrl = Config.api.toLowerCase().replace("/api", "")
}

if (AppGlobal.CooksGet('configDemo')) {
  console.log("请取配置文件")
  CONFIG_DEMO = JSON.parse(AppGlobal.CooksGet('configDemo'));
  console.log(CONFIG_DEMO)
}

@NgModule({
  declarations: [
    MyApp,

    TabsPage,

  ],
  imports: [
    HttpClientModule,
    IonicModule.forRoot(MyApp,  CONFIG_DEMO),
    HttpModule,
    JsonpModule,
    BrowserModule,
    AppTranslationModule,
  ],
  exports: [
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    FileTransfer,
    AppVersion,
    PhotoViewer,
    Camera,
    SplashScreen,
    FileOpener,
    FileChooser, 
    ImagePicker,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ToPostService,
    FileUpService,
    CommonService,
    JPush,
    InAppBrowser,
    BarcodeScanner,
    Badge,
    WebIntent,
    FilePath,
  ]
})
export class AppModule { }



