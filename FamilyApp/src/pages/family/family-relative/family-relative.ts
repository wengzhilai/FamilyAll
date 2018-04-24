
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, App, FabContainer, AlertController } from 'ionic-angular';

import { NetronGraph } from '../../../Classes/Netron/Graph';
import { NetronElement } from "../../../Classes/Netron/Element";

import { CommonService } from "../../../Service/Common.Service";
import { ToPostService } from "../../../Service/ToPost.Service";
import { FileUpService } from "../../../Service/FileUp.Service";

import { AppGlobal } from "../../../Classes/AppGlobal";
import { Dictionary } from "../../../Classes/Dictionary";
import { max } from 'rxjs/operator/max';


@IonicPage()
@Component({
  selector: 'page-family-relative',
  templateUrl: 'family-relative.html',
})
export class FamilyRelativePage implements OnInit {
  @ViewChild('canvas') mapElement: ElementRef;
  @ViewChild('fab') fab: FabContainer;
  public graph: NetronGraph = null;
  public userId: number;
  public userName: string;
  public tempCheckUser: any;
  public userRelative: any;
  public allRelative: Dictionary = new Dictionary();
  public userInfoList: any;
  constructor(
    public navCtrl: NavController,
    public commonService: CommonService,
    public fileUpService: FileUpService,
    private alertCtrl: AlertController,
    public toPostService: ToPostService
  ) {

  }
  ngOnInit() {
    this.onSucc();
    // this.test()
    // var ctx=this.mapElement.nativeElement.getContext("2d");
    // ctx.fillStyle="#FF0000";
    // ctx.fillRect(0,0,10,10);
  }
  IsLogin(){
    return AppGlobal.IsLogin
  }
  CancelKey(ev: any) {
    this.userInfoList = [];
  }
  filterItems(ev: any) {
    let val = ev.target.value;
    if (val && val.trim() !== '') {
      var postBean = {
        SearchKey: [{ "Key": "NAME", "Type": "like", "Value": val.trim() }]
      }
      this.toPostService.Post("UserInfo/list", postBean, (currMsg) => {
        if (!currMsg.IsSuccess) {
          this.commonService.hint(currMsg.Message);
        }
        else {
          if (currMsg.Msg > 1) {
            this.userInfoList = currMsg.Data;
          }
          else if (currMsg.Msg == 1) {
            this.userInfoList = [];
            this.userName = currMsg.Data[0].NAME;
            this.SelectUser(currMsg.Data[0])
          }
          else {
            this.userInfoList = [];
          }
        }
      })
    }
    else {
      this.userInfoList = [];
    }
  }


  onSucc(postUserId = null) {
    if(postUserId==null){
      postUserId=AppGlobal.GetPropertyId()
    }

    this.userId = postUserId;
    this.fab._mainButton.getElementRef().nativeElement.parentNode.style.display = "none"

    // if(this.fab!=null){
    //   this.fab.toggleList();
    // }
    this.commonService.showLoading();
    this.toPostService.Post("Family/Relative", { Key: postUserId }, (currMsg) => {
      this.commonService.hideLoading();
      if (!currMsg.IsSuccess) {
        this.commonService.hint(currMsg.Msg);
      } else {
        this.userRelative = currMsg.Data;
        this.commonService.showLongToast("总" + this.userRelative.ItemList.length + "人")
        // 计算宽高
        let maxX = 0;
        let maxY = 0
        for (var i = 0; i < this.userRelative.ItemList.length; i++) {
          var item = this.userRelative.ItemList[i];
          if (maxX < item.x) maxX = item.x
          if (maxY < item.y) maxY = item.y
        }
        let canvas = this.mapElement.nativeElement
        maxX = maxX * 15 + 100
        maxY = maxY * 90 + 200
        if(maxX<screen.width)maxX=screen.width
        if(maxY<screen.height)maxY=screen.height
        canvas.width = maxX
        canvas.height = maxY
        canvas.style.width = canvas.width + "px";
        canvas.style.height = canvas.height + "px";
        // 计算高宽
        this.graph = new NetronGraph(this.mapElement.nativeElement);
        this.graph.ClickBlack = (x) => {
          this.fab._mainButton.getElementRef().nativeElement.parentNode.style.display = "none"
        }
        for (let i = 0; i < this.userRelative.ItemList.length; i++) {
          let item = this.userRelative.ItemList[i];
          let e1 = this.graph.addElement(this.personTemplate, { x: item.x * 15 + 20, y: item.y * 90 + 50 }, item.Name, item);
          this.allRelative.add(item.Id, e1);
        }
        let allR = this.allRelative.toLookup();
        this.userRelative.RelativeList.forEach(element => {
          if (allR[element.V] != null && allR[element.K] != null) {
            this.graph.addConnection(allR[element.V].getConnector("reports"), allR[element.K].getConnector("manager"));
          }
        });





        this.graph.update();
      }
    })
  }


  test() {

    console.log(this.graph)
    var e1 = this.graph.addElement(this.personTemplate, { x: 250, y: 50 }, "Michael Scott", {});
    var e2 = this.graph.addElement(this.personTemplate, { x: 150, y: 150 }, "Angela Martin", {});
    var e3 = this.graph.addElement(this.personTemplate, { x: 350, y: 150 }, "Dwight Schrute", {});
    var e4 = this.graph.addElement(this.personTemplate, { x: 50, y: 250 }, "Kevin Malone", {});
    var e5 = this.graph.addElement(this.personTemplate, { x: 250, y: 250 }, "Oscar Martinez", {});
    this.graph.addConnection(e1.getConnector("reports"), e2.getConnector("manager"));
    this.graph.addConnection(e1.getConnector("reports"), e3.getConnector("manager"));
    this.graph.addConnection(e2.getConnector("reports"), e4.getConnector("manager"));
    this.graph.addConnection(e2.getConnector("reports"), e5.getConnector("manager"));
    this.graph.update();
  }


  public personTemplate = {
    resizable: false,
    defaultWidth: 20,
    defaultHeight: 70,
    defaultContent: "",
    connectorTemplates: [
      {
        name: "manager",
        type: "Person [in]",
        description: "",
        getConnectorPosition: (element) => {
          return {
            x: Math.floor(element.rectangle.width / 2),
            y: 0
          }
        }
      },
      {
        name: "reports",
        type: "Person [out] [array]",
        description: "",
        getConnectorPosition: (element) => {
          return {
            x: Math.floor(element.rectangle.width / 2),
            y: element.rectangle.height
          }
        }
      }
    ],
    paint: (element, context) => {
      // console.log(element.content)
      var rectangle = element.rectangle;
      rectangle.x += context.canvas.offsetLeft;
      rectangle.y += context.canvas.offsetTop;
      // console.log(JSON.stringify(rectangle))
      // var ctx=context;
      // ctx.fillStyle="#FF0000";
      // ctx.fillRect(0,0,20,70);
      //表示是自己
      if (element.Object.Id == this.userId) {
        context.fillStyle = "#c8d4e8";
        context.strokeStyle = element.selected ? "#666" : "#F00";
      }
      else {
        context.fillStyle = "#fff";
        context.strokeStyle = element.selected ? "#444" : "#000";
      }
      if (element.selected) {
        context.lineWidth = 5
      }
      else {
        context.lineWidth = 1
      }
      //画背景色
      context.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
      //画边框
      context.strokeRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
      context.font = "12px Verdana";
      context.fillStyle = context.strokeStyle;
      context.textBaseline = "bottom";
      context.textAlign = "center";
      for (var i = 0; i < element.content.length; i++) {
        context.fillText(element.content[i], rectangle.x + (rectangle.width / 2), rectangle.y + 20 + (20 * i));
      }
    },
    edit: (element: NetronElement, context, point: any) => { //点击事件
      this.tempCheckUser = element.Object;
      this.fab._mainButton.getElementRef().nativeElement.parentNode.style.display = ""
    }
  }


  AddSon() {
    this.userName = this.tempCheckUser.Name;
    this.userId = this.tempCheckUser.Id;
    this.fab.toggleList();
    this.navCtrl.push("FamilyEditPage",
      {
        optype: "addSon",
        userId: this.userId,
        userName: this.userName
      });
  }

  AddAllSon() {
    this.userName = this.tempCheckUser.Name;
    this.userId = this.tempCheckUser.Id;
    let alert = this.alertCtrl.create({
      title: '批量添加子女',
      message: '批量加的用户，默认性别:男',
      inputs: [
        {
          name: 'userNameArrStr',
          placeholder: '多个用户用逗号分开，无需填写姓'
        }
      ],
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '添加',
          handler: data => {
            console.log(data.userNameArrStr)
            var postBean = {
              authToken: AppGlobal.GetToken(),
              userId: this.userId,
              entity: data.userNameArrStr
            };
            this.toPostService.Post("UserInfo/UserInfoAddMultiSon", postBean, (currMsg) => {
              if (currMsg.IsError) {
                this.commonService.hint(currMsg.Message);
              } else {
                this.commonService.hint('成功添加' + currMsg + '个用户', '添加成功');
                this.LookRelative()
              }
            })
          }
        }
      ]
    });
    alert.present();
  }

  EditUserInfo() {
    this.userName = this.tempCheckUser.Name;
    this.userId = this.tempCheckUser.Id;
    this.fab.toggleList();
    this.navCtrl.push("FamilyEditPage",
      {
        optype: "edit",
        userId: this.userId,
        userName: this.userName
      });
  }
  DeleteUserInfo() {
    let alert = this.alertCtrl.create({
      title: '删除用户',
      message: '确定要删除该用户[' + this.tempCheckUser.Name + ']吗',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '删除',
          handler: data => {
            var postBean = {
              Key: this.tempCheckUser.Id
            };
            this.toPostService.Post("UserInfo/Delete", postBean, (currMsg) => {
              if (currMsg.IsSuccess) {
                this.tempCheckUser.Name = ""
                this.tempCheckUser.Id = ""
                this.LookRelative()
              } else {
                this.commonService.hint(currMsg.Msg);
              }
            })
          }
        }
      ]
    });
    alert.present();
  }
  LookRelative() {
    this.userName = this.tempCheckUser.Name;
    this.userId = this.tempCheckUser.Id;
    this.graph.dispose();
    this.graph = new NetronGraph(this.mapElement.nativeElement);
    this.onSucc(this.userId);
  }
  SelectUser(userInfo: any) {
    this.graph.dispose();
    this.graph = new NetronGraph(this.mapElement.nativeElement);

    this.CancelKey(null);
    this.onSucc(userInfo.ID)
  }
}
