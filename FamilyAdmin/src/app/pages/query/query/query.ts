import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ToPostService } from '../../../@core/Service/ToPost.Service';
import { CommonService } from '../../../@core/Service/Common.Service';
import { RequestPagesModel } from "../../../@core/Model/Transport/RequestPagesModel";
import { AppReturnDTO } from "../../../@core/Model/Transport/AppReturnDTO";
import { RequestSaveModel, PostBaseModel } from "../../../@core/Model/Transport";
import { ServerDataSource } from "../../../@core/Classes/SmartTable/ServerDataSource";
import { Http } from '@angular/http';
import { ViewCell } from 'ng2-smart-table';
import { concat } from 'rxjs/observable/concat';
import { SmartTableFormatValuePage } from "../../../components/SmartTable/formatValue";
import { fail } from 'assert';
import { Config } from '../../../@core/Classes/Config';
import { BsModalService } from 'ngx-bootstrap/modal';

import { EditComponent } from "../../../components/edit/edit.component";
import { RoleEditComponent } from "../../../components/role-edit/role-edit.component";
@Component({
  selector: 'query',
  templateUrl: './query.html',
  styleUrls: ['./query.scss']
})
export class QueryQueryComponent implements OnInit {
  @ViewChild('smartTable') smartTable: ElementRef;

  source: ServerDataSource;
  queryEnt: any = {
    REMARK:"　"
  };
  /**
   * 表头按钮
   */
  headBtnSet: Array<any> = [];
  /**
   * 行按钮
   */
  rowBtnSet: Array<any> = [];

  LoadSetting: boolean = false;
  /**
   * 用于绑定table的设置
   */
  settings: any = ServerDataSource.getDefaultSetting();
  /**
   * 读取配置文件的设置
   */
  configJson: any = {}
  selectedArr = []
  code: any;
  thisUrl: string = ""
  constructor(
    private routerIonfo: ActivatedRoute,
    private toPostService: ToPostService,
    private commonService: CommonService,
    private modalService: BsModalService,

    http: Http,
  ) {
    console.log(this.routerIonfo.snapshot)
    this.CheckUrl();
  }

  /** 用于检测URL地址是否改变，如已经变则刷新该页面 */
  CheckUrl() {
    setTimeout(() => {
      if (window.location.href.indexOf("/pages/query/query/") > -1) {
        if (window.location.href != this.thisUrl) {
          this.thisUrl = window.location.href
          this.LoadSetting = false;
          this.LoadData().then(x => {
            this.LoadSetting = true;

            this.CheckUrl()
          })
        }
        else {
          this.CheckUrl()
        }
      }
    }, 1000)
  }
  LoadData() {
    this.code = this.routerIonfo.snapshot.params["code"];

    let postClass: PostBaseModel = new PostBaseModel();
    postClass.Key = this.code;
    return this.toPostService.Post("query/single_code", postClass).then((data: AppReturnDTO) => {
      if (data.IsSuccess) {
        this.queryEnt = data.Data
        //隐藏，hide=true的字段
        let t: any = {}
        //设置列配置
        eval("t=" + this.queryEnt.QUERY_CFG_JSON)
        this.configJson = t
        //设置表头按钮配置
        eval("t=" + this.queryEnt.HEARD_BTN)
        this.headBtnSet = t
        //读取行按钮
        try {
          eval("t=" + this.queryEnt.ROWS_BTN)
          this.rowBtnSet = t
        } catch (error) {

        }
        if (this.rowBtnSet == null) this.rowBtnSet = []

        let tempCol = ServerDataSource.ReMoveHideItem(this.configJson);
        for (const item in tempCol) {
          if (tempCol[item]["renderComponent"] == "SmartTableFormatValuePage") {
            tempCol[item]["renderComponent"] = SmartTableFormatValuePage
          }
        }
        this.settings.columns = tempCol
        this.LoadSetting = true
        //配置是否有筛选框
        if (this.queryEnt.SHOW_CHECKBOX != 1) {
          this.settings.selectMode = "single"
        }

        if (this.rowBtnSet.length > 1) {
          this.settings.actions.edit = true
          this.settings.edit.editButtonContent = '<i class="' + this.rowBtnSet[0].class + '"></i>'
        }
        if (this.rowBtnSet.length > 2) {
          this.settings.actions.edit = true
          this.settings.delete.deleteButtonContent = '<i class="' + this.rowBtnSet[1].class + '"></i>'
        }
        this.source = new ServerDataSource(this.toPostService, this.commonService, { endPoint: 'query/query' }, this.code);
      }
      else {
        this.commonService.hideLoading()
      }
    }, (x) => {
      console.log(x)
    })
  }
  ngOnInit() {

  }

  userRowSelect(event) {
    this.selectedArr = event.selected
    console.log(this.selectedArr)
  }

  /**
   * 表头按钮事件
   * @param event 
   */
  HeadBtnClick(nowThis, event) {
    if (event != null) {
      eval(event)
    }
  }

  /**导出Excel */
  onExportXls() {

    let postBean: RequestPagesModel = new RequestPagesModel();
    postBean.Key = this.code
    this.toPostService.Post("view/export_query", postBean).then(x => {
      console.log(x)
      // Blob转化为链接
      var link = document.createElement("a");
      link.setAttribute("href", Config.imgUrl + x.Msg);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    // console.log(this.source.getFilter());
    // console.log(this.source.getSort());
  }


  /**
   * 删除事件
   * @param event 添加事件
   */
  onDelete(event): void {

    if (this.rowBtnSet.length > 1) {
      this.DeleteApi(this.rowBtnSet[1].apiUrl, event.data.ID, this.rowBtnSet[1].confirmTip)
    }

  }


  onSave(nowThis, event) {
    if (this.rowBtnSet.length > 0) {
      this.Add(this.rowBtnSet[0].apiUrl, this.rowBtnSet[0].openModal, event.data, this.rowBtnSet[0].readUrl)
    }
  }
  /**
   * 删除
   * @param apiUrl 
   * @param Key 
   * @param confirmTip 
   */
  DeleteApi(apiUrl, Key, confirmTip) {
    if (window.confirm(confirmTip)) {
      this.commonService.showLoading();
      let postClass: PostBaseModel = new PostBaseModel();
      postClass.Key = Key;
      this.toPostService.Post(apiUrl, postClass).then((data: AppReturnDTO) => {
        this.commonService.hideLoading()
        if (data.IsSuccess) {
          this.source.refresh()
        }
      });
    }
  }

  Exec(apiUrl, Key, confirmTip) {
    let allKeyList = []
    this.selectedArr.forEach(element => {
      allKeyList.push(element[Key])
    });
    this.DeleteApi(apiUrl, allKeyList.join(","), confirmTip)
  }

  /**
   * 
   * @param apiUrl 保存API
   * @param openModal 弹出对话框的组件
   * @param defaultData 默认数据
   * @param readUrl 读取默认数据的API
   */
  Add(apiUrl, openModal: any = null, defaultData = null, readUrl = null): void {
    this.GetBean(defaultData, readUrl).then(x => {
      if (x == null && !x.IsSuccess) {
        console.log("获取取初始值失败")
        return
      }
      console.log("获取取初始值")
      console.log(x.Data)
      let add = this.modalService.show(this.GetOpenComponent(openModal), { class: 'modal-lg' })

      add.content.bean = x.Data
      //会设置初始值
      add.content.SetSettingsColumns(this.configJson)

      add.content.message = "修改"
      if (defaultData != null) {
        add.content.message = "添加"
      }
      add.content.OkHandler = (bean, saveKeys) => {
        if (window.confirm('确定要保存吗？')) {
          let postClass: RequestSaveModel = new RequestSaveModel();
          postClass.Data = bean;
          postClass.SaveKeys = saveKeys;
          this.toPostService.Post(apiUrl, postClass).then((data: AppReturnDTO) => {
            console.log(data)
            if (data.IsSuccess) {
              this.source.refresh()
              add.hide()
            }
            else {
              this.commonService.hint(data.Msg)
            }
          });
        } else {
          add.hide()
        }
      }
      add.content.CancelHandler = (bean) => {
        add.hide()
      }
    })

  }
  /**
   * 获取初始值
   * @param defaultData 行选择的值
   * @param readUrl 加载的URL
   */
  GetBean(defaultData = null, readUrl = null): Promise<any> {
    if (readUrl != null) {
      return this.toPostService.Post(readUrl, { Key: defaultData.ID })
    }
    else {
      if (defaultData == null) defaultData = {}
      return new Promise((resolve, rejeact) => { resolve({ "IsSuccess": true, "Data": defaultData }) });
    }
  }

  GetOpenComponent(openModal) {
    if (openModal == null) {
      return EditComponent
    }
    else {
      switch (openModal) {
        case "RoleEditComponent":
          return RoleEditComponent
        default:
          return EditComponent
      }
    }
  }

  ReLoad() {
    this.source.refresh()
  }
}
