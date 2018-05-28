import { Pipe, PipeTransform } from '@angular/core';
import { Language } from "../Classes/Language";
import { Config } from "../Classes/Config";
import { AppGlobal } from "../Classes/AppGlobal";
/**
 * 语言配置
 */
@Pipe({
  name: 'Language',
})
export class LanguagePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    var allLan = AppGlobal.LanguageModelArr;
    var reStr = value;
    allLan.forEach((element: Language) => {
      if (element.Value == value) {
        reStr = (Config.Language == "CH") ? element.CH : element.EN;
      }
    });
    return reStr;
  }
}
