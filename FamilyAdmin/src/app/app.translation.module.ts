import { NgModule } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
    // return new TranslateHttpLoader(http, Config.imgUrl+'Content/Apk/res/1.0.5/', '.json');
}

const translationOptions = {
  loader: {
    provide: TranslateLoader,
    useFactory: (createTranslateLoader),
    deps: [HttpClient]
  }
};

@NgModule({
  imports: [TranslateModule.forRoot(translationOptions)],
  exports: [TranslateModule],
  providers: [TranslateService]
})
export class AppTranslationModule {
  constructor(translate: TranslateService) {
    translate.addLangs(["ch"]);
    translate.setDefaultLang('ch');
    translate.use('ch');
  }
}
