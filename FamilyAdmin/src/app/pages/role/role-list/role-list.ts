import { Component, OnInit } from '@angular/core';
import { SmartTableService } from '../../../@core/data/smart-table.service';
import { ToPostService } from '../../../@core/Service/ToPost.Service';
import { CommonService } from '../../../@core/Service/Common.Service';
import { RequestPagesModel } from "../../../@core/Model/Transport/RequestPagesModel";
import { AppReturnDTO } from "../../../@core/Model/Transport/AppReturnDTO";
import { RequestSaveModel, PostBaseModel } from "../../../@core/Model/Transport";
import { ServerDataSource } from "../../../@core/Classes/SmartTable/ServerDataSource";
import { Http } from '@angular/http';
import { RoleEditComponent } from '../../../components/role-edit/role-edit.component';
import { BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'role-list',
  templateUrl: './role-list.html',
  styleUrls: ['./role-list.scss']
})
export class RoleListPage implements OnInit {
  source: ServerDataSource;
  settings: any = ServerDataSource.getDefaultSetting();

  constructor(
    private service: SmartTableService,
    private modalService: BsModalService,
    
    private toPostService: ToPostService,
    private commonService: CommonService,
    http: Http,
  ) {
    this.source = new ServerDataSource(this.toPostService, this.commonService, { endPoint: 'role/list' });
    this.settings.columns={
      ID: {
        title: '角色ID',
        type: 'number',
        editable: false
      },
      NAME: {
        title: '角色名',
        type: 'string',
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
    // let add = this.commonService.ShowModal({ class: 'modal-lg' },RoleEditComponent)
    let add =this.modalService.show(RoleEditComponent, { class: 'modal-lg'})
    add.content.key=event.data.ID
    add.content.SetSettingsColumns(this.settings.columns)
    add.content.ngOnInit()
    add.content.message = "修改角色"
    if (event.data != null) {
      add.content.bean = event.data
      add.content.message = "添加角色"
    }
    add.content.OkHandler = (bean,saveKeys) => {
      if (window.confirm('确定要保存吗？')) {
        let postClass: RequestSaveModel = new RequestSaveModel();
        postClass.Data = bean;
        postClass.SaveKeys = saveKeys;
        this.toPostService.Post("role/save", postClass).then((data: AppReturnDTO) => {
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
      this.toPostService.Post("role/delete", postClass).then((data: AppReturnDTO) => {
        this.commonService.hideLoading()
        if (data.IsSuccess) {
          this.source.refresh()
        }
      });
    }
  }

}
