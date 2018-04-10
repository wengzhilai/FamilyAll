import { Pipe, PipeTransform } from '@angular/core';
import { Language } from "../../@core/Classes/Language";
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
    var allLan=new Language();
    allLan.LoadAllLanguages();
    var reStr=value;
    allLan.AllLanguages.forEach((element:Language) => {
      if (element.ENName==value) {
        reStr=element.CHName;
      }
    });
    return reStr;
  }
}
