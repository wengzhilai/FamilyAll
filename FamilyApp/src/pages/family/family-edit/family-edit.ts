import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { YearPicker } from "../../../Classes/YearPicker"
import { FileUpService } from "../../../Service/FileUp.Service";
import { CommonService } from "../../../Service/Common.Service";
import { ToPostService } from "../../../Service/ToPost.Service";
import { AppGlobal } from '../../../Classes/AppGlobal';


@IonicPage()
@Component({
  selector: 'page-family-edit',
  templateUrl: 'family-edit.html',
})

/**
 * 参数：
 * optype(EditFather/addSon/edit):表示操作类型
 * userId:操作用户的ID
 * userName:操作用户的名称，主要用于显示标题
 */
export class FamilyEditPage {
  /** 多语言 */
  public i18n = "family-edit"
  /** 表单 */
  userForm: FormGroup;

  /** 年份开始时间 用于计算非公元年的 */
  public yeasStart
  /** 设置时间选择对象 */
  yearPicker: any = YearPicker;


  BirthdaylunlarDate
  BirthdaysolarDate

  DiedsolarDate
  DiedlunlarDate

  // 过世的干支
  diedTianDi
  // 过世的时间间隔
  diedDistantYears

  bean: any = {
    YEARS_TYPE: "阳历",
    SEX: "男",
    IS_LIVE: 1,
    LEVEL_ID: 1,
    DIED_TIME: '',
    BIRTHDAY_TIME: '',
    ICON_FILES_ID: ""
  };
  title: string = "添加用户"

  constructor(
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public alerCtrl: AlertController,
    public params: NavParams,
    public fileUpService: FileUpService,
    public commonService: CommonService,
    public toPostService: ToPostService

  ) {

    console.log(this.params.data)
    console.log(this.params.data != {})
    if (Object.keys(this.params.data).length > 0) {
      AppGlobal.CooksSet(this.i18n, JSON.stringify(this.params.data))
    }
    else {
      this.params.data = JSON.parse(AppGlobal.CooksGet(this.i18n));
    }
    // console.log(typeof (this))

    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
      SEX: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      LEVEL_ID: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
      BIRTHDAY_PLACE: ['', [Validators.minLength(0), Validators.maxLength(200)]],
      DIED_PLACE: ['', [Validators.minLength(0), Validators.maxLength(200)]],
      REMARK: ['', [Validators.minLength(0), Validators.maxLength(200)]],
    });
  }

  SetForm(inEnt) {
    this.userForm.get('firstName').setValue((inEnt.NAME == null || inEnt.NAME.length < 1) ? "" : inEnt.NAME.substr(0, 1));
    this.userForm.get('lastName').setValue((inEnt.NAME == null || inEnt.NAME.length < 2) ? "" : inEnt.NAME.substr(1))
    this.userForm.get('SEX').setValue(inEnt.SEX)
    this.userForm.get('LEVEL_ID').setValue(inEnt.LEVEL_ID)
    this.userForm.get('BIRTHDAY_PLACE').setValue(inEnt.BIRTHDAY_PLACE)
    this.userForm.get('DIED_PLACE').setValue(inEnt.DIED_PLACE)
    this.userForm.get('REMARK').setValue(inEnt.REMARK)
  }

  ionViewDidLoad() {
    console.log(this.params);
    this.toPostService.Post("UserInfo/Single", { "Key": this.params.get("userId") }).then((currMsg) => {
      if (!currMsg.IsSuccess) {
        this.commonService.hint(currMsg.Msg)
        this.navCtrl.pop();
      }
      else {
        this.bean = currMsg.Data;
        this.bean.BIRTHDAY_TIME = this.bean.BIRTHDAY_TIME.replace(' ', 'T')
        this.bean.DIED_TIME = this.bean.DIED_TIME.replace(' ', 'T')
        this.SetForm(this.bean);
      }
    })
    this.title = "修改[" + this.params.get("userName") + "]的资料";
  }
  upImg(key) {

  }

  save() {
    if (this.userForm.invalid) {
      let formErrors = this.commonService.FormValidMsg(this.userForm, this.i18n);
      console.log(formErrors);
      this.commonService.hint(formErrors.ErrorMessage, '输入无效')
      return;
    }
    for (var key in this.userForm.value) {
      this.bean[key] = this.userForm.value[key];
    }
    this.bean.NAME = this.bean.firstName + this.bean.lastName;
    this.bean.BIRTHDAY_TIME = this.bean.BIRTHDAY_TIME.replace('T', ' ').replace('Z', '')
    this.bean.DIED_TIME = this.bean.DIED_TIME.replace('T', ' ').replace('Z', '')
    console.log(this.bean)

    this.toPostService.Post("UserInfo/save", { Data: this.bean, "SaveKeys": this.commonService.GetBeanNameStr(this.bean) }).then((currMsg) => {
      if (!currMsg.IsSuccess) {
        this.commonService.hint(currMsg.Msg)
      }
      else {
        this.commonService.hint("保存成功")
        this.navCtrl.pop();
      }
    })

  }



  /**
   * 设置时间类型
   */
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
        this.yeasStart = dataArr[1];
      }
    });
    alert.present();
  }
  /**
   * 选择出生时间事件
   * @param inDate 
   */
  DoneBirthdayTime(inDate: any) {
    console.log(inDate)
    if (inDate == null || inDate == "") return;
    let dataStr = inDate.substr(0, 10)
    if (this.bean.YEARS_TYPE == "阳历") {
      this.BirthdaysolarDate = dataStr
      this.BirthdaylunlarDate = ""
      this.toPostService.Post("Public/GetLunarDate", { Data: { "Data": dataStr } }, (currMsg) => {
        if (currMsg.IsSuccess) {
          this.BirthdaylunlarDate = currMsg.Msg
        }
      });
    } else {

      this.BirthdaylunlarDate = dataStr
      this.BirthdaysolarDate = ""
      this.toPostService.Post("Public/GetSolarDate", { Data: { "Data": dataStr } }, (currMsg) => {
        if (currMsg.IsSuccess) {
          this.BirthdaysolarDate = currMsg.Msg
        }
      });
    }

  }
  /** 选择去世时间事件 */
  DoneDiedTime(inDate: any) {
    if (inDate == null || inDate == "") return;
    let dataStr = inDate.substr(0, 10)
    if (this.bean.YEARS_TYPE == "阳历") {
      this.DiedsolarDate = dataStr
      this.DiedlunlarDate = ""
      this.toPostService.Post("Public/GetLunarDate", { Data: { "Data": dataStr } }, (currMsg) => {
        if (currMsg.IsSuccess) {
          this.DiedlunlarDate = currMsg.Msg
        }
      });
    } else {
      this.DiedlunlarDate = dataStr
      this.DiedsolarDate = ""
      this.toPostService.Post("Public/GetSolarDate", { Data: { "Data": dataStr } }, (currMsg) => {
        if (currMsg.IsSuccess) {
          this.DiedsolarDate = currMsg.Msg
        }
      });
    }

  }

  /**
   * 
   * @param type 1表示根据干支，0表示是根据时间间隔
   */
  SelectedChinaYearDied(type) {
    if (type == 1) {
      console.log(this.yeasStart)
      console.log(this.diedTianDi)
      var nowYear = YearPicker.GetYearByTianDi(this.yeasStart, this.diedTianDi);
      console.log(nowYear)
      // this.diedDistantYears = nowYear - this.yeasStart;
      this.DoneDiedTime(nowYear);
    }
  }

  ChangeFileJson(obj) {
    console.log('编辑界面获取到值')
    this.commonService.PlatformsExists("core") ? console.log(obj) : console.log(JSON.stringify(obj));
    if (obj != null) {
      this.bean.ICON_FILES_ID = obj.ID;
    }
  }
}
