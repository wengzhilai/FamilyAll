import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { YearPicker } from "../../../Classes/YearPicker"
import { FileUpService } from "../../../Service/FileUp.Service";
import { CommonService } from "../../../Service/Common.Service";
import { ToPostService } from "../../../Service/ToPost.Service";


@IonicPage()
@Component({
  selector: 'page-family-edit-father',
  templateUrl: 'family-edit-father.html',
})

/**
 * 参数：
 * optype(EditFather/addSon/edit):表示操作类型
 * userId:操作用户的ID
 * userName:操作用户的名称，主要用于显示标题
 */
export class FamilyEditFatherPage {
  userForm: FormGroup;
  public userFormMsg: any;
  public formErrors = {};
  public loadTimeDied: Date = new Date("1900-1-1");
  public loadTimeBirthday: Date = new Date("1900-1-1");


  bean: any = {
    YEARS_TYPE: "阳历",
    SEX: "男",
    IS_LIVE: 1,
    LEVEL_ID: 1,
    DIED_TIME: new Date().toISOString(),
    BIRTHDAY_TIME: new Date().toISOString()
  };
  title: string = "添加父亲信息"

  yearPicker: any = YearPicker;
  yearPicker1: any = YearPicker;
  yeasTypes: number = this.yearPicker.yeasGroup1[0].value;
  yeasTypes1: number = this.yearPicker.yeasGroup1[0].value;
  tianDi: any;
  tianDi1: any;
  distantYears: number = 0;
  distantYears1: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public alerCtrl: AlertController,
    public params: NavParams,
    public fileUpService: FileUpService,
    public commonService: CommonService,
    public toPostService: ToPostService

  ) {
  }

  SetForm(inEnt) {

    this.userForm = this.formBuilder.group({
      firstName: [(inEnt.NAME == null || inEnt.NAME.length < 1) ? "" : inEnt.NAME.substr(0, 1), [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      lastName: [(inEnt.NAME == null || inEnt.NAME.length < 2) ? "" : inEnt.NAME.substr(1), [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
      SEX: [inEnt.SEX, [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      LEVEL_ID: [inEnt.LEVEL_ID, [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
      BIRTHDAY_PLACE: [inEnt.BIRTHDAY_PLACE, [Validators.minLength(0), Validators.maxLength(200)]],
      DIED_PLACE: [inEnt.DIED_PLACE, [Validators.minLength(0), Validators.maxLength(200)]],
      REMARK: [inEnt.REMARK, [Validators.minLength(0), Validators.maxLength(200)]],
    });
    this.userFormMsg = {
      'firstName': { 'aliasName': "姓" },
      'lastName': { 'aliasName': "名" },
      'SEX': { 'aliasName': "性别" },
      'LEVEL_ID': { 'aliasName': "排行" },
      'BIRTHDAY_PLACE': { 'aliasName': "出生地点" },
      'DIED_PLACE': { 'aliasName': "逝世地点" },
      'REMARK': { 'aliasName': "备注" },
    };
  }

  ngOnInit() {
    console.log('FamilyEditFatherPage');
    this.SetForm(this.bean);
  }

  ionViewDidLoad() {
    console.log(this.params);
    switch (this.params.get("optype")) {
      case "EditFather":
        this.title = "添加[" + this.params.get("userName") + "]的父亲";
        this.toPostService.Post("UserInfo/Single", {"Key":this.params.get("userId")}, (currMsg) => {
          if (currMsg.IsError) {
            this.commonService.hint(currMsg.Message)
            this.navCtrl.pop();
          }
          else {
            this.bean = currMsg;
            this.bean.DIED_TIME = new Date(this.bean.DIED_TIME).toISOString();
            this.bean.BIRTHDAY_TIME = new Date(this.bean.BIRTHDAY_TIME).toISOString();
            this.SetForm(this.bean);
          }
        })
        break;
      case "addSon":
        this.bean.FATHER_ID = this.params.get("userId")
        this.title = "添加[" + this.params.get("userName") + "]的后代";
        break;
      case "edit":
        this.bean.ID = this.params.get("userId")
        this.toPostService.Post("UserInfo/Single", {"Key":this.bean.ID}, (currMsg) => {
          if (currMsg.IsError) {
            this.commonService.hint(currMsg.Message)
            this.navCtrl.pop();
          }
          else {
            this.bean = currMsg.Date;
            // this.bean.DIED_TIME = new Date(this.bean.DIED_TIME).toISOString();
            // this.bean.BIRTHDAY_TIME = new Date(this.bean.BIRTHDAY_TIME).toISOString();
            setTimeout(()=> {
              // this.PubicToChina(this.bean.DIED_TIME,"DiedTimeChinese");
            }, 500);
            console.log(this.bean)
            this.SetForm(this.bean);
          }
        })
        this.title = "修改[" + this.params.get("userName") + "]的资料";
        break;
      default:
        this.commonService.hint("参数有误")
        this.navCtrl.pop();
        break
    }


  }
  upImg(key) {
    // this.fileUpService.upImg(this, key, (Key: string, url: string, ID: number) => {
    //   switch (key) {
    //     case "iconURL":
    //       this.bean.iconURL = url;
    //       this.bean.ICON_FILES_ID = ID;
    //       break;
    //     case "idNoUrl":
    //       this.bean.idNoUrl = url;
    //       this.bean.ID_NO_PIC_ID = ID;
    //       break;
    //   }
    // });
  }

  save() {

    if (this.userForm.invalid) {
      this.formErrors = this.commonService.FormValidMsg(this.userForm, this.userFormMsg);
      let errMsg = "";
      for (const field in this.formErrors) {
        errMsg += "<p>" + field + "：" + this.formErrors[field] + "</p>"
      }
      console.log(this.userForm);
      this.commonService.hint(errMsg, '输入无效')
      return;
    }

    console.log(this.userForm);

    var postBean = this.userForm.value;
    postBean.ID = this.bean.ID;
    postBean.ICON_FILES_ID = this.bean.ICON_FILES_ID;
    postBean.IS_LIVE = (this.bean.IS_LIVE) ? 1 : 0;
    postBean.NAME = postBean.firstName + postBean.lastName;
    postBean.DIED_TIME = new Date(this.bean.DIED_TIME).toISOString();
    postBean.BIRTHDAY_TIME = new Date(this.bean.BIRTHDAY_TIME).toISOString();
    postBean.DIED_TIME = new Date(this.bean.DIED_TIME).toISOString();
    postBean.YEARS_TYPE = this.bean.YEARS_TYPE;

    switch (this.params.get("optype")) {
      case "EditFather":
        // this.toPostService.SaveOrUpdate("Family/UserInfoFatherSave", postBean, [{ K: "userId", V: this.params.get("userId") }], (currMsg) => {
        //   if (currMsg.IsError) {
        //     this.commonService.hint(currMsg.Message)
        //   }
        //   else {
        //     this.commonService.hint("保存父辈成功！")
        //     this.navCtrl.pop();
        //   }
        // });
        break;
      case "addSon":
        // postBean.ID = 0;
        // postBean.FATHER_ID = this.params.get("userId")
        // this.toPostService.SaveOrUpdate("Family/UserInfoSave", postBean, null, (currMsg) => {
        //   if (currMsg.IsError) {
        //     this.commonService.hint(currMsg.Message)
        //   }
        //   else {
        //     this.commonService.hint("添加子辈成功！")
        //     this.navCtrl.pop();
        //   }
        // });
        break;
      case "edit":
        // postBean.ID = this.params.get("userId");
        // this.toPostService.SaveOrUpdate("Family/UserInfoSave", postBean, null, (currMsg) => {
        //   if (currMsg.IsError) {
        //     this.commonService.hint(currMsg.Message)
        //   }
        //   else {
        //     this.commonService.hint("修改成功！")
        //     this.navCtrl.pop();
        //   }
        // });
        break;
      default:
        this.commonService.hint("参数有误")
        this.navCtrl.pop();
        break
    }




  }


  showBigImage(url) {
    // this.commonService.FullScreenImage(url, this);
  }


  SetOptions() {
    let alert = this.alerCtrl.create({});
    alert.setTitle('设置时间类型');
    YearPicker.yeasGroup.forEach(element => {
      alert.addInput({
        type: 'radio',
        label: element.name,
        value: element.name + "|" + element.value,
        checked: element.name == this.bean.YEARS_TYPE
      });
    });

    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        var dataArr = data.split('|')
        this.bean.YEARS_TYPE = dataArr[0];
        this.yeasTypes = dataArr[1];
        this.yeasTypes1 = dataArr[1];
        console.log('Radio data:', data);
      }
    });
    alert.present();
  }
  selectOptions(title, subTitle) {
    return {
      title: title,
      subTitle: subTitle
    };
  }
  SelectedYeasGroup() {
    var chinaArr = YearPicker.GetTianDiByYear(this.yeasTypes);
    this.tianDi = chinaArr;
    this.distantYears = 0;
    this.setNewYear_BIRTHDAY(this.yeasTypes);
  }
  SelectedYeasGroup1() {
    var chinaArr = YearPicker.GetTianDiByYear(this.yeasTypes1);
    this.tianDi1 = chinaArr;
    this.distantYears1 = 0;
    this.setNewYear_died(this.yeasTypes1);
  }
  SelectedChinaYear() {
    var nowYear = YearPicker.GetYearByTianDi(this.yeasTypes, this.tianDi);
    this.distantYears = nowYear - this.yeasTypes;
    this.setNewYear_BIRTHDAY(nowYear);
  }
  SelectedChinaYear1() {
    var nowYear = YearPicker.GetYearByTianDi(this.yeasTypes1, this.tianDi1);
    this.distantYears1 = nowYear - this.yeasTypes1;
    this.setNewYear_died(nowYear);
  }
  ChangeDistantYears() {
    var nowYear = this.yeasTypes - 0 + (this.distantYears - 0);
    var chinaArr = YearPicker.GetTianDiByYear(nowYear);
    this.tianDi = chinaArr;
    this.setNewYear_BIRTHDAY(nowYear);
  }
  ChangeDistantYears1() {
    var nowYear = this.yeasTypes1 - 0 + (this.distantYears1 - 0);
    var chinaArr = YearPicker.GetTianDiByYear(nowYear);
    this.tianDi1 = chinaArr;
    this.setNewYear_died(nowYear);
  }


  setNewYear_BIRTHDAY(year: number) {
    if (this.bean.BIRTHDAY_TIME != null) {
      var data: Date = new Date(this.bean.BIRTHDAY_TIME);
      data.setFullYear(year);
      // this.bean.BIRTHDAY_TIME = data.toISOString();
      this.bean.BIRTHDAY_TIME = data.toISOString()
      // this.userForm.get('BIRTHDAY_TIME').setValue(data.toISOString());
    }
  }
  setNewYear_died(year: number) {
    if (this.bean.DIED_TIME != null) {
      var data: Date = new Date(this.bean.DIED_TIME);
      data.setFullYear(year);
      this.bean.DIED_TIME = data.toISOString();
      // this.userForm.get('DIED_TIME').setValue(data.toISOString());
    }
  }
  ChinaToPubic(inDate: any, outDateType: string) {
    console.log("ChinaToPubic:"+outDateType);
    switch (outDateType) {
      case "BIRTHDAY_TIME":
        if ((this.loadTimeBirthday.getTime() + 3000) > new Date().getTime()) return;
        break;
      case "DIED_TIME":
        if ((this.loadTimeDied.getTime() + 3000) > new Date().getTime()) return;
        break;
    }
    console.log(inDate);
    var postBean = {
      data: inDate.substr(0,inDate.indexOf('T')),
      para: [{ K: "inType", V: "china" }]
    }
    this.toPostService.Post("Public/GetChineseCalendar", postBean, (currMsg) => {
      if (currMsg.IsError) {
        this.commonService.hint(currMsg.Message)
      }
      else {
        switch (outDateType) {
          case "BIRTHDAY_TIME":
            let str = currMsg.Message + inDate.substr(inDate.indexOf('T'));
            this.loadTimeBirthday = new Date();
            this.bean.BIRTHDAY_TIME = str;
            break;
          case "DIED_TIME":
            str = currMsg.Message + inDate.substr(inDate.indexOf('T'));
            this.loadTimeDied = new Date();
            this.bean.DIED_TIME = str;
            break;
        }
      }
    });

  }
  PubicToChina(inDate: any, outDateType: string) {
    console.log("PubicToChina:"+outDateType);
    switch (outDateType) {
      case "BirthdayTimeChinese":
        if ((this.loadTimeBirthday.getTime() + 3000) > new Date().getTime()) return;
        break;
      case "DiedTimeChinese":
        if ((this.loadTimeDied.getTime() + 3000) > new Date().getTime()) return;
        break;
    }
    var postBean = {
      data: inDate.substr(0,inDate.indexOf('T'))
    }
    this.toPostService.Post("Public/GetChineseCalendar", postBean, (currMsg) => {
      if (currMsg.IsError) {
        this.commonService.hint(currMsg.Message)
      }
      else {
        switch (outDateType) {
          case "BirthdayTimeChinese":
            var str = currMsg.Message + inDate.substr(inDate.indexOf('T'));
            this.loadTimeBirthday = new Date();
            this.bean.BirthdayTimeChinese = str;
            break;
          case "DiedTimeChinese":
            str = currMsg.Message + inDate.substr(inDate.indexOf('T'));
            this.loadTimeDied = new Date();
            this.bean.DiedTimeChinese = str;
            break;
        }
      }
    });
  }
}
