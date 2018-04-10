
import { Pipe, PipeTransform } from '@angular/core';
import {Config} from "../../@core/Classes/Config";
@Pipe({name: 'ImgUrl'})
export class ImgUrlPipe implements PipeTransform {
  transform(url: string): string {
    let str=url;
    if (url != null && url != '' && url != undefined && url.indexOf('http://')==-1) {
      str= Config.imgUrl + url.replace("~", "").replace("/YL", "");
    }
    console.log("图片地址:"+str)
    return str;
  }
}
