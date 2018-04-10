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
  selector: 'module-list',
  templateUrl: './module-list.html',
  styleUrls: ['./module-list.scss']
})
export class ModuleListPage implements OnInit {
  source: ServerDataSource;
  settings: any = ServerDataSource.getDefaultSetting();

  constructor(
    private service: SmartTableService,
    private toPostService: ToPostService,
    private commonService: CommonService,
    http: Http,
  ) {
    this.source = new ServerDataSource(this.toPostService, this.commonService, { endPoint: 'module/list' });
    // this.settings.mode="inline"
    this.settings.columns = {
      ID: {
        title: '模块ID',
        type: 'number',
        editable: false,
      },
      NAME: {
        title: '模块名',
        type: 'string',
        editable:true
      },
      PARENT_ID: {
        title: '上级ID',
        type: 'number',
      },
      LOCATION: {
        title: '地址',
        type: 'string',
      },
      CODE: {
        title: '代码',
        type: 'string',
      },
      IS_DEBUG: {
        title: '是否调试',
        type: 'number',
        editor: {
          type: 'list',
          config: {
            list: [
              { value: '1', title: '是' }, 
              { value: '0', title: '否' }, 
            ],
          },
        },
      },
      IS_HIDE: {
        title: '是否隐藏',
        type: 'number',
      },
      SHOW_ORDER: {
        title: '排序号',
        type: 'number',
      },
      DESCRIPTION: {
        title: '描述',
        type: 'string',
        inputWidth: 12,
        editor: {
          type: 'textarea'
        }
      },
      IMAGE_URL: {
        title: '图片地址',
        type: 'string',
      },
      DESKTOP_ROLE: {
        title: '是否首页显示',
        type: 'string',
      },
      W: {
        title: '宽',
        type: 'number',
      },
      H: {
        title: '高',
        type: 'number',
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
    add.content.OkHandler = (bean,saveKeys) => {
      if (window.confirm('确定要保存吗？')) {
        let postClass: RequestSaveModel = new RequestSaveModel();
        postClass.Data = bean;
        postClass.SaveKeys = saveKeys;
        this.toPostService.Post("module/save", postClass).then((data: AppReturnDTO) => {
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
      this.toPostService.Post("module/delete", postClass).then((data: AppReturnDTO) => {
        this.commonService.hideLoading()
        if (data.IsSuccess) {
          this.source.refresh()
        }
      });
    }
  }

}
