import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { YearPicker } from "../../../Classes/YearPicker"
import { FileUpService, CommonService, ToPostService } from "../../../Service/"
import { AppGlobal } from '../../../Classes/AppGlobal';

@IonicPage()
@Component({
  selector: 'page-vip-person-edit',
  templateUrl: 'vip-person-edit.html',
})
export class VipPersonEditPage {
  /** 多语言 */
  i18n = "vip-person-edit"

  /** 表单 */
  userForm: FormGroup;
  bean:any = {
    "Name": "名称",
    "Gender": "性别",
    "Nationlity": "国籍",
    "MaritalStatus": "婚姻状况",
    "DOB": "生日",
    "Occupation": "职业",
    "EducationLevel": "教育程度",
  }
  constructor(
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public alerCtrl: AlertController,
    public params: NavParams,
    public fileUpService: FileUpService,
    public commonService: CommonService,
    public toPostService: ToPostService
  ) {
    this.userForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
      Gender: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2)]],
      Nationlity: ['', [Validators.minLength(1), Validators.maxLength(20)]],
      MaritalStatus: ['', [Validators.minLength(1), Validators.maxLength(3)]],
      DOB: ['',[Validators.minLength(1), Validators.maxLength(20)]],
      Occupation: ['',[Validators.minLength(1), Validators.maxLength(20)]],
      EducationLevel: ['',[Validators.minLength(1), Validators.maxLength(20)]]
    });
  }

  SetForm(inEnt) {
    this.userForm.get('Name').setValue(inEnt.Name)
    this.userForm.get('Gender').setValue(inEnt.Gender)
    this.userForm.get('Nationlity').setValue(inEnt.Nationlity)
    this.userForm.get('MaritalStatus').setValue(inEnt.MaritalStatus)
    this.userForm.get('DOB').setValue(inEnt.DOB)
    this.userForm.get('Occupation').setValue(inEnt.Occupation)
    this.userForm.get('EducationLevel').setValue(inEnt.EducationLevel)
  }

  ionViewDidLoad() {
    console.log(this.i18n);
    console.log(this.params);
    this.bean = this.params.data.user
    this.SetForm(this.bean)
  }
  
  ChangeFileJson(obj) {
    console.log('编辑界面获取到值')
    this.commonService.PlatformsExists("core") ? console.log(obj) : console.log(JSON.stringify(obj));
    if (obj != null) {
      this.bean.ICON_FILES_ID = obj.ID;
    }
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
    if (this.bean.DOB != null) {
      this.bean.DOB = this.bean.DOB.replace('T', ' ').replace('Z', '')
    }

    this.commonService.PlatformsExists("core") ? console.log(this.bean) : console.log(JSON.stringify(this.bean));

    this.commonService.showLoading()
    this.toPostService.Post("PersonSave", { Data: this.bean, "SaveKeys": this.commonService.GetBeanNameStr(this.bean) }).then((currMsg) => {
      this.commonService.hideLoading()
      if (!currMsg.IsSuccess) {
        this.commonService.hint(currMsg.Msg)
      }
      else {
        this.commonService.hint("保存成功")
        this.navCtrl.pop();
      }
    })
  }
}
