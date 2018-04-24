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

  hasbandName = ""
  /** 年份开始时间 用于计算非公元年的 */
  public yeasStart
  /** 设置时间选择对象 */
  yearPicker: any = YearPicker;

  /** 当前操作的用户类型 */
  userType = "husband"

  BirthdaylunlarDate = ""
  BirthdaysolarDate = ""

  DiedsolarDate = ""
  DiedlunlarDate = ""

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
    ICON_FILES_ID: "",
    COUPLE_ID: null,
    iconFiles: {}
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
      NAME: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
      SEX: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      LEVEL_ID: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
      BIRTHDAY_PLACE: ['', [Validators.minLength(0), Validators.maxLength(200)]],
      DIED_PLACE: ['', [Validators.minLength(0), Validators.maxLength(200)]],
      REMARK: ['', [Validators.minLength(0), Validators.maxLength(200)]],
    });
  }



  ionViewDidLoad() {
    console.log(this.params);

    switch (this.params.data.optype) {
      case "edit":
        this.GetSingleEnt(this.params.get("userId"))
        break
      case "addSon":
        this.bean.FATHER_ID = this.params.data.userId
        break
    }


  }

  /**
   * 获取实体
   */
  GetSingleEnt(userId) {
    this.commonService.showLoading()
    this.toPostService.Post("UserInfo/Single", { "Key": userId }).then((currMsg) => {
      this.commonService.hideLoading()
      if (!currMsg.IsSuccess) {
        this.commonService.hint(currMsg.Msg)
        this.navCtrl.pop();
      }
      else {
        this.bean = currMsg.Data;
        if (this.bean.BIRTHDAY_TIME != null) {
          this.bean.BIRTHDAY_TIME = this.bean.BIRTHDAY_TIME.replace(' ', 'T')
        }
        if (this.bean.DIED_TIME != null) {
          this.bean.DIED_TIME = this.bean.DIED_TIME.replace(' ', 'T')
        }
        if (this.bean.iconFiles == null) this.bean.iconFiles = {}

        if (this.userType == "husband") this.hasbandName = this.bean.NAME
        this.SetForm(this.bean);
      }
    })
    // this.title = "修改[" + this.params.get("userName") + "]的资料";
  }

  SetForm(inEnt) {
    this.userForm.get('NAME').setValue(inEnt.NAME)
    this.userForm.get('SEX').setValue(inEnt.SEX)
    this.userForm.get('LEVEL_ID').setValue(inEnt.LEVEL_ID)
    this.userForm.get('BIRTHDAY_PLACE').setValue(inEnt.BIRTHDAY_PLACE)
    this.userForm.get('DIED_PLACE').setValue(inEnt.DIED_PLACE)
    this.userForm.get('REMARK').setValue(inEnt.REMARK)
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
    if(this.bean.BIRTHDAY_TIME!=null){
      this.bean.BIRTHDAY_TIME = this.bean.BIRTHDAY_TIME.replace('T', ' ').replace('Z', '')
    }
    if(this.bean.DIED_TIME!=null)
    {
      this.bean.DIED_TIME = this.bean.DIED_TIME.replace('T', ' ').replace('Z', '')
    }
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
    let t = new Date(inDate)
    if (inDate == null || inDate == "") return;
    let dataStr = inDate.substr(0, 10)
    if (this.bean.YEARS_TYPE == "阳历") {
      this.BirthdaysolarDate = dataStr
      this.BirthdaylunlarDate = ""
      this.toPostService.Post("Public/GetLunarDate", { Data: { "Data": dataStr } }, (currMsg) => {
        if (currMsg.IsSuccess) {
          let nowDate = new Date(currMsg.Msg)
          this.BirthdaylunlarDate = nowDate.getFullYear() + "年" + (nowDate.getMonth() + 1) + "月" + nowDate.getDate() + "日" + t.getUTCHours() + "时"

        }
      });
    } else {

      this.BirthdaylunlarDate = dataStr
      this.BirthdaysolarDate = ""
      this.toPostService.Post("Public/GetSolarDate", { Data: { "Data": dataStr } }, (currMsg) => {
        if (currMsg.IsSuccess) {
          let nowDate = new Date(currMsg.Msg)
          this.BirthdaysolarDate = nowDate.getFullYear() + "年" + (nowDate.getMonth() + 1) + "月" + nowDate.getDate() + "日" + t.getUTCHours() + "时"
        }
      });
    }

  }
  /** 选择去世时间事件 */
  DoneDiedTime(inDate: any) {
    console.log(inDate)
    let t = new Date(inDate)

    if (inDate == null || inDate == "") return;
    let dataStr = inDate.substr(0, 10)
    if (this.bean.YEARS_TYPE == "阳历") {
      this.DiedsolarDate = dataStr
      this.DiedlunlarDate = ""
      this.toPostService.Post("Public/GetLunarDate", { Data: { "Data": dataStr } }, (currMsg) => {
        if (currMsg.IsSuccess) {
          let nowDate = new Date(currMsg.Msg)
          this.DiedlunlarDate = nowDate.getFullYear() + "年" + (nowDate.getMonth() + 1) + "月" + nowDate.getDate() + "日" + t.getUTCHours() + "时"
        }
      });
    } else {
      this.DiedlunlarDate = dataStr
      this.DiedsolarDate = ""
      this.toPostService.Post("Public/GetSolarDate", { Data: { "Data": dataStr } }, (currMsg) => {
        if (currMsg.IsSuccess) {
          let nowDate = new Date(currMsg.Msg)
          this.DiedsolarDate = nowDate.getFullYear() + "年" + (nowDate.getMonth() + 1) + "月" + nowDate.getDate() + "日" + t.getUTCHours() + "时"
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

  allFiles = []
  ChangeAllFileJson(obj) {
    console.log('编辑界面获取到值')
    this.commonService.PlatformsExists("core") ? console.log(obj) : console.log(JSON.stringify(obj));
    if (obj != null) {
      this.allFiles = obj;
    }
  }

  UserTypeChanged(obj) {
    console.log(obj.value)

    this.BirthdaylunlarDate = ""
    this.BirthdaysolarDate = ""

    this.DiedsolarDate = ""
    this.DiedlunlarDate = ""
    switch (obj.value) {
      case "husband":
        this.GetSingleEnt(this.params.get("userId"))
        break;
      case "wife":
        if (this.bean.COUPLE_ID != null) {
          this.GetSingleEnt(this.bean.COUPLE_ID)
        }
        else {
          this.userForm.reset()
          this.bean = {
            YEARS_TYPE: "阳历",
            SEX: "女",
            IS_LIVE: 1,
            LEVEL_ID: 1,
            DIED_TIME: '',
            BIRTHDAY_TIME: '',
            ICON_FILES_ID: "",
            COUPLE_ID: this.params.get("userId"),
            iconFiles: {}

          }
        }
        break;
    }

  }
}
