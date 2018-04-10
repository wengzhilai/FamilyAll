import { Component, OnInit } from '@angular/core';
import { SmartTableService } from '../../../@core/data/smart-table.service';
import { ToPostService } from '../../../@core/Service/ToPost.Service';
import { CommonService } from '../../../@core/Service/Common.Service';
import { RequestPagesModel } from "../../../@core/Model/Transport/RequestPagesModel";
import { AppReturnDTO } from "../../../@core/Model/Transport/AppReturnDTO";
import { RequestSaveModel, PostBaseModel } from "../../../@core/Model/Transport";
import { ServerDataSource } from "../../../@core/Classes/SmartTable/ServerDataSource";
import { Http } from '@angular/http';


@Component({
  selector: 'user-list',
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.scss']
})
export class UserListPage implements OnInit {
  source: ServerDataSource;
  settings: any = ServerDataSource.getDefaultSetting();

  constructor(
    private service: SmartTableService,
    private toPostService: ToPostService,
    private commonService: CommonService,
    http: Http,
  ) {
    this.source = new ServerDataSource(this.toPostService, this.commonService, { endPoint: 'user/list' });
    this.settings.columns = {
      "ID": {
        "title": '用户ID',
        "type": 'number',
        "editable": false
      },
      "NAME": {
        "title": '姓名',
        "type": 'string',
        "editable": true
      },
      "LOGIN_NAME": {
        "title": '登录名',
        "type": 'string',
        "editable": false
      },
      "LOGIN_COUNT": {
        "title": '登录次数',
        "type": 'string',
        "editable": false
      },
      "LAST_ACTIVE_TIME": {
        "title": '最后活动时间',
        "type": 'string',
        "editable": false
      },
      "IS_LOCKED": {
        "title": '状态',
        "type": 'number'
      }
    }
  }

  ngOnInit() {

  }

  /**
   * 
   * @param event 添加事件
   */
  onSave(event): void {
    console.log(event.data)
    let add = this.commonService.ShowModal({ class: 'modal-lg' })
    add.content.SetSettingsColumns(this.settings.columns)

    add.content.message = "修改模块"
    if (event.data != null) {
      add.content.bean = event.data
      add.content.message = "添加模块"
    }
    add.content.OkHandler = (bean, saveKeys) => {
      if (window.confirm('确定要保存吗？')) {
        let postClass: RequestSaveModel = new RequestSaveModel();
        postClass.Data = bean;
        postClass.SaveKeys = saveKeys;
        this.toPostService.Post("user/save", postClass).then((data: AppReturnDTO) => {
          if (data.IsSuccess) {
            this.source.refresh()
            add.hide()
          }
        });
      } else {
        add.hide()
      }
    }
    add.content.CancelHandler = (bean) => {
      add.hide()
    }
  }

  /**
   * 
   * @param event 添加事件
   */
  onDelete(event): void {
    console.log(event.data)
    if (window.confirm('确定要删除吗?')) {
      this.commonService.showLoading();
      let postClass: PostBaseModel = new PostBaseModel();
      postClass.Key = event.data.ID;
      this.toPostService.Post("user/delete", postClass).then((data: AppReturnDTO) => {
        this.commonService.hideLoading()
        if (data.IsSuccess) {
          this.source.refresh()
        }
      });
    }
  }

}
