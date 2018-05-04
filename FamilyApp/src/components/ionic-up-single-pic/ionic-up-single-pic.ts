import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { Platform } from 'ionic-angular';
import { CommonService } from "../../Service/Common.Service";
import { FileUpService } from "../../Service/FileUp.Service";
import { Config } from "../../Classes/Config";

import { FileModel } from "../../Model/Transport/FileModel";


@Component({
  selector: 'up-single-pic',
  templateUrl: 'ionic-up-single-pic.html'
})
export class IonicUpSinglePicComponent implements OnInit {
  /**
   * 是否可以编辑
   */
  @Input()
  CanEdit: boolean = true

  @Input()
  PicStyle = {W:80,H:80}

  /**
   * 输入的文件对象
   */
  @Input()
  FileDict: any

  @Output()
  ChangeFileJson: EventEmitter<any> = new EventEmitter<any>();

  isApp: boolean = false;
  constructor(
    public commonService: CommonService,
    public fileUpService: FileUpService,
    public plt: Platform
  ) {
    console.log('ionic-up-single-pic');
    this.isApp = !this.plt.is('core')
  }
  ngOnInit() {
    console.log("获取:")
    console.log("CanEdit:" + this.CanEdit)
    console.log("FileDict:" + this.FileDict)
    console.log(this.FileDict)
    console.log(this.PicStyle)
    if (this.FileDict == null) this.FileDict = {}
    if (this.PicStyle == null) this.PicStyle = {W:80,H:80}
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
      this.showFile(key)
      return
    }
    this.fileUpService.upImg(this, key, this.CanEdit, (outFile: FileModel, url: string, fileModel: any) => {
      if (fileModel == null) fileModel = {}
      console.log("控件获取到文件返回")

      this.FileDict = fileModel
      if (this.FileDict == null) this.FileDict = {}
      this.commonService.PlatformsExists("core") ? console.log(this.FileDict) : console.log(JSON.stringify(this.FileDict));

      /**
       * 回调方法
       */
      this.ChangeFileJson.next(fileModel)

      return true;
    });
  }

  showFile(fileObj) {
    // let url=Config.api + "Common/ShowImage?id=" + fileObj.ID + "&PropertyId=" + AppGlobal.GetPropertyId() + "&Product=" + AppGlobal.GetProduct()
    this.fileUpService.Download(Config.imgUrl + fileObj.URL, fileObj.NAME)
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
  /**
   * 格式化文件名
   * @param str 
   */
  decodeURI(str) {
    return decodeURI(str)
  }
}
