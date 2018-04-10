import { NgModule } from '@angular/core';
import { FileUploadModule } from 'ng2-file-upload';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from "../pipes/pipes.module";
import { IonicUpFileComponent } from './ionic-up-file/ionic-up-file';
import { UpFileComponent } from './up-file/up-file';
import { IonicUpSinglePicComponent } from './ionic-up-single-pic/ionic-up-single-pic';

@NgModule({
	declarations: [
		UpFileComponent,
		IonicUpFileComponent,
		IonicUpSinglePicComponent,
	],
	imports: [
		FileUploadModule,
		IonicPageModule,
		PipesModule,
	],
	exports: [
		UpFileComponent,
		IonicUpFileComponent,
		IonicUpSinglePicComponent,
	]
})
export class ComponentsModule { }
