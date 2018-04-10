import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FormatStringPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'formatString',
})
export class FormatStringPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    if (value != null && typeof(value)=="string") {
      let tempStr=value.replace(/\r/g, '</ion-col></ion-row><ion-row class="row"><ion-col class="col">');
      tempStr=tempStr.replace(/\|/g, '</ion-col><ion-col class="col">');
      tempStr='<ion-row class="row"><ion-col class="col">'+tempStr+"</ion-col></ion-row>"
      return tempStr;
      // return value.replace(/\r/g, '<br />');
    }
    else {
      return value;
    }
  }
}
