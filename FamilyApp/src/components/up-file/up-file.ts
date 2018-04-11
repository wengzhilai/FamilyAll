import { Component, Output, Input, EventEmitter } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { Config as cfg } from '../../Classes/Config';


@Component({
  selector: 'up-file',
  templateUrl: 'up-file.html'
})
export class UpFileComponent {
  @Input()
  CanEdit: boolean = true

  @Output()
  ChangeFileJson: EventEmitter<any> = new EventEmitter<any>();

  uploader: FileUploader = new FileUploader({
    url: cfg.Api_Upfile,
    method: "POST",
    itemAlias: "file",
    autoUpload: true,
    allowedFileType: ["image", "xls", "txt"],
  });
  /**
   * 返回的信息列表
   */
  _reMsgList: Array<any> = [];
  constructor(
  ) {
    console.log("UpFileComponent")
    this.init();
  }

  init() {
    console.log('ionViewDidLoad UpFileComponent');
    //上传一个文件成功的回调 
    this.uploader.onWhenAddingFileFailed = (item: any, filter: any, options: any) => {
      console.log(item)
      console.log(filter)
      console.log(options)
      console.log('选择文件类型不允许')
      console.log('该文件类型无效：[' + item.name + '] 只允许上传[' + options.allowedFileType.join(',') + ']')
    }

    this.uploader.onAfterAddingFile = (item => {
      item.withCredentials = false
    })
    this.uploader.onCompleteAll = () => {
      console.log('上传完成')
      this.ReturnJson();
    };
    this.uploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      console.log("成功一个")
      console.log(response)

      let tempRes = JSON.parse(response);
      if (tempRes.IsSuccess) {
        this._reMsgList.push(tempRes.Data)
      }
      console.log(tempRes)
    };
    this.uploader.onAfterAddingAll = (fileItems: any) => {
      console.log("添加完所有的")
      console.log(fileItems)
    }

  }

  ReturnJson() {
    console.log('返回值')
    //所有列表，包括没有成功的，和没有上传的
    let tmpMsgList = []
    // console.log(this.uploader.queue)
    this.uploader.queue.forEach(e => {
      console.log(e)
      if (e.isSuccess) {
        for (var index = 0; index < this._reMsgList.length; index++) {
          var msg = this._reMsgList[index];
          if (msg.NAME == e.file.name) {
            tmpMsgList.push(msg)
            break;
          }
        }
      }
    })
    this._reMsgList = tmpMsgList;
    // console.log(this._reMsgList)
    this.ChangeFileJson.next(tmpMsgList)
  }
}
