import { NgModule } from '@angular/core';
import { AutoAreatextDirective } from './auto-areatext/auto-areatext';
import { CapitalizeDirective } from './capitalize/capitalize';
@NgModule({
	declarations: [AutoAreatextDirective,
    CapitalizeDirective],
	imports: [],
	exports: [AutoAreatextDirective,
    CapitalizeDirective]
})
export class DirectivesModule {}
