import { NgModule } from '@angular/core';
import { DataStrToStringPipe } from './DataStrToString';
import { DateToStringPipe } from './DateToString';
import { FormatEnumPipe } from './FormatEnum';
import { FormatStringPipe } from './FormatString';
import { ImgUrlPipe } from './ImgUrl';
import { JsonFilterPipe } from './JsonFilter';
import { LanguagePipe } from './Language';
import { MyDecimalPipe,MyPercentPipe,MyCurrencyPipe } from './MyDecimalPipe';

@NgModule({
  declarations: [
    DataStrToStringPipe,
    DateToStringPipe,
    FormatEnumPipe,
    FormatStringPipe,
    ImgUrlPipe,
    JsonFilterPipe,
    LanguagePipe,
    MyDecimalPipe,
    MyPercentPipe,
    MyCurrencyPipe,
    ],
  exports: [
    DataStrToStringPipe,
    DateToStringPipe,
    FormatEnumPipe,
    FormatStringPipe,
    ImgUrlPipe,
    JsonFilterPipe,
    LanguagePipe,
    MyDecimalPipe,
    MyPercentPipe,
    MyCurrencyPipe,
  ]
})
export class PipesModule { }
