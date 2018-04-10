import { Component } from '@angular/core';
import { JsonFilterPipe } from "../../@theme/pipes/JsonFilter";
import { ToPostService, CommonService, DefaultTreeviewI18n } from '../../@core/Service';
import {
  TreeviewI18n, TreeviewItem, TreeviewConfig, TreeviewHelper, TreeviewComponent,
  TreeviewEventParser, OrderDownlineTreeviewEventParser, DownlineTreeviewItem
} from 'ngx-treeview';


@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  providers: [
    { provide: TreeviewI18n, useClass: DefaultTreeviewI18n }
  ]
})
export class EditComponent {
  OkText = "确定"
  ChancelText = "取消"
  message: string;
  OkHandler: any;
  CancelHandler: any
  inputs = []
  inputsIsTabs = []
  bean: any = {}

  _columns: any = {}
  saveKeys = []
  key: string = ""

  items: Array<TreeviewItem> = [];


  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    maxHeight: 100
  });

  //所有用于绑定的值
  ValuesBean = {}
  ddrtreeConfig = TreeviewConfig.create({
    hasAllCheckBox: false,
    maxHeight: 100
  });


  constructor(
    private toPostService: ToPostService,
    private commonService: CommonService,
  ) {

  }

  ngOnInit() {
  }



  confirm(): void {
    if (this.OkHandler != null) {
      this.OkHandler(this.bean, this.saveKeys);
    }
  }
  decline(): void {
    if (this.CancelHandler != null) {
      this.CancelHandler(this.bean, this.saveKeys);
    }
  }


  SetSettingsColumns(columnsJson) {
    this.inputs = []
    for (const key in columnsJson) {
      this.inputs.push({
        name: key,
        title: columnsJson[key].title,
        placeholder: columnsJson[key].title,
        type: columnsJson[key].type,
        inputWidth: columnsJson[key].inputWidth,
        editable: columnsJson[key].editable,
        editor: columnsJson[key].editor,
        isTabs: columnsJson[key].isTabs ? true : false, //是否用tabs显示
        tooltip: columnsJson[key].tooltip,
      })


      if (this.bean != null && columnsJson[key].defaultValue != null) {
        //没有配置值才设置默认值
        if (this.bean[key] == null) this.bean[key] = columnsJson[key].defaultValue
      }

      if (columnsJson[key].editable != false) {
        this.saveKeys.push(key)
      }
    }

    this.inputsIsTabs = new JsonFilterPipe().transform(this.inputs, "isTabs", true);
    //传入的配置
    console.log("传入的配置")
    console.log(this.inputs)
    //传入的默认值
    console.log("传入的默认值")
    console.log(this.bean)

  }

  ItemIsNew = {};
  onSelectedChange(downlineItems: DownlineTreeviewItem[], itemName: string) {
    if (this.ItemIsNew[itemName]) {
      console.log(this.bean[itemName])
      this.bean[itemName] = downlineItems
      console.log(this.bean[itemName])
    }
  }


  isLoad = {}
  GetTreeviewConfig(fig, dataFig: any, name) {
    /** 如果已经执行过就执行 */
    if (!this.isLoad[name]) {
      this.isLoad[name] = true
      this.toPostService.Post(dataFig.api, dataFig.config).then(data => {
        if (data.IsSuccess) {
          let allItem = this.commonService.JsonToTreeJson(data.Data, "ID", "NAME", "PARENT_ID", this.bean[name]);

          const items: TreeviewItem[] = [];
          allItem.forEach(element => {
            console.log(element)
            items.push(new TreeviewItem(element))
          });
          this.ValuesBean[name] = items;
          this.ItemIsNew[name] = true
          console.log(this.ValuesBean[name]);
        }
      })
    }
    return TreeviewConfig.create(fig);
  }
  LoadSelectData(fig, dataFig: any, name) {
    console.log(234)
    /** 如果已经执行过就执行 */
    if (!this.isLoad[name]) {
      this.isLoad[name] = true
      this.toPostService.Post(dataFig.api, dataFig.config).then(data => {
        if (data.IsSuccess) {
          let allItem = this.commonService.JsonToTreeJson(data.Data, "ID", "NAME", "PARENT_ID", [this.bean[name]]);
          const items = this.commonService.TreeJsonToArrJson(allItem, "value", "text", "children", [""])

          this.ValuesBean[name] = items;
          this.ItemIsNew[name] = true
          console.log(this.ValuesBean[name]);
        }
      })
    }
    return TreeviewConfig.create(fig);
  }
}
