import { Pipe, PipeTransform } from '@angular/core';
import { AppGlobal } from "../Classes/AppGlobal";
import { Config } from "../Classes/Config";
/**
 * Generated class for the FormatEnumPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'FormatEnum',
})
export class FormatEnumPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string,type: string,enumArr=AppGlobal.enumModelArr) {
    var reStr=value
    enumArr.forEach(element => {
      if((type==null || element.Type==type) && value==element.Value)
        {
          reStr= element[Config.Language];
        }
    });
    return reStr;
  }
}
