import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { Platform } from 'ionic-angular';
import { CommonService } from "../../Service/Common.Service";
import { FileUpService } from "../../Service/FileUp.Service";
import { Config } from "../../Classes/Config";

import { FileModel } from "../../Model/Transport/FileModel";
import { AppGlobal } from "../../Classes/AppGlobal";


@Component({
  selector: 'ionic-up-file',
  templateUrl: 'ionic-up-file.html'
})
export class IonicUpFileComponent implements OnInit {
  @Input()
  CanEdit: boolean = true

  @Input()
  inAllFiles: Array<any>

  @Output()
  ChangeFileJson: EventEmitter<any> = new EventEmitter<any>();
  AllFiles: Array<FileModel> = Array<FileModel>();

  isApp: boolean = false;
  constructor(
    public commonService: CommonService,
    public fileUpService: FileUpService,
    public plt: Platform
  ) {
    console.log('Hello IonicUpFileComponent Component');
    this.isApp = !this.plt.is('core')


  }
  ngOnInit() {
    console.log("获取:")
    if (this.inAllFiles == null) this.inAllFiles = [];
    console.log("inAllFiles:")
    console.log(this.inAllFiles)

    console.log("CanEdit:" + this.CanEdit)
    this.AllFiles = this.inAllFiles
  }

  AddImg() {

    var indexNo = this.AllFiles.length;
    this.AllFiles[indexNo] = new FileModel();
    this.AllFiles[indexNo].indexNo = indexNo;
    this.AllFiles[indexNo].NAME = "";
    this.AllFiles[indexNo].key = 'allFile_' + indexNo;
    this.upImg(this.AllFiles[indexNo])
  }

  /**
   * 上传图片
   * 
   * @param {FileModel} key 
   * @memberof IncidentsAddPage
   */
  upImg(key: FileModel) {
    this.commonService.PlatformsExists("core") ? console.log(key) : console.log(JSON.stringify(key));
    if (!this.CanEdit) {
      this.showFile(key.ID, key.NAME)
      return
    }
    this.fileUpService.upImg(this, key, this.CanEdit, (inFile: FileModel, url: string, fileModel: FileModel) => {
      switch (inFile.key) {
        default:
          //表示是附件
          if (inFile.key.indexOf('allFile_') == 0) {
            /**
             * 当前操作的文件
             */
            if (fileModel == null || fileModel.ID == null || fileModel.ID == 0) {
              this.AllFiles.splice(inFile.indexNo, 1); //删除
              console.log('删除图片' + inFile.indexNo)
              for (var x = 0; x < this.AllFiles.length; x++) {
                this.AllFiles[x].indexNo = x;
              }
            }
            else {
              this.AllFiles[inFile.indexNo] = fileModel;
              this.AllFiles[inFile.indexNo].URL = url;
            }
            this.ChangeFileJson.next(this.AllFiles)
          }
          break;
      }
      return true;
    });
  }

  showFile(fileId, fileName) {
    this.fileUpService.Download(Config.api + "Common/ShowImage?id=" + fileId + "&PropertyId=" + AppGlobal.GetPropertyId() + "&Product=" + AppGlobal.GetProduct(), fileName)
  }
  IsImage(fileName) {
    return this.commonService.IsPicName(fileName)
  }
  GetFileMiMe(fileName) {
    let mime = this.commonService.GetFileMIME(fileName)
    if (mime == null) {
      mime = { Type: "file" }
    }
    return mime;
  }
  changeFileJson(obj) {
    this.ChangeFileJson.next(obj)
  }
  decodeURI(str){
    return decodeURI(str)
  }
  GetAllFiles(){
    console.log(2)
    return this.inAllFiles;
  }
}
