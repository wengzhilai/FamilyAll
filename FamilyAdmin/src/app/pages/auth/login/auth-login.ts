import { Component, OnInit } from '@angular/core';
import { CommonService } from "../../../@core/Service/Common.Service";
import { ToPostService } from "../../../@core/Service/ToPost.Service";
import { AppGlobal } from "../../../@core/Classes/AppGlobal";

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Config as Cif } from "../../../@core/Classes/Config";
import { TranslateService } from '@ngx-translate/core'
import { concat } from 'rxjs/observable/concat';
import { Router } from '@angular/router';

@Component({
    selector: 'auth-login',
    templateUrl: 'auth-login.html',
})
export class AuthLoginPage {
    redirectDelay: number = 0;
    showMessages: any = {};
    provider: string = '';

    errors: string[] = [];
    messages: string[] = [];
    user: any = {};
    submitted: boolean = false;

    userForm: FormGroup;
    validationMessages: any;
    /**
     * 当前cook里的所有用户密码信息
     */
    userAndPwdList = []

    rememberPwd: any = false;
    constructor(
        private commonService: CommonService,
        private toPostService: ToPostService,
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private router: Router,
    ) {
        // this.commonService.hint("dddd")
        let userAndPwdListStr = AppGlobal.CooksGet("userAndPwdList")

        if (userAndPwdListStr != null && userAndPwdListStr != "") {
            try {
                this.userAndPwdList = JSON.parse(userAndPwdListStr)
            } catch (error) { this.userAndPwdList = [] }
        }

        this.userForm = this.formBuilder.group({
            loginName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
            passWord: ['', [Validators.required]]
        });
        this.validationMessages = {
            'loginName': {
                'aliasName': ""
            },
            'passWord': {
                'aliasName': ""
            }
        }

        if (Cif.debug) {
            this.userForm.get('loginName').setValue("sysadmin");
            this.userForm.get('passWord').setValue("123456");
        }
        if (this.userAndPwdList.length > 0) {
            console.log("设置值")
            this.userForm.get('loginName').setValue(this.userAndPwdList[this.userAndPwdList.length - 1].loginName);
            this.userForm.get('passWord').setValue(this.userAndPwdList[this.userAndPwdList.length - 1].passWord);
        }
        let nowRememberPwd = AppGlobal.CooksGet("rememberPwd")
        if (nowRememberPwd == null || nowRememberPwd == '' || nowRememberPwd == 'false') {
            this.rememberPwd = false
        }
        else {
            this.rememberPwd = true
        }

        let apiUrl = AppGlobal.CooksGet('apiUrl');
        if (apiUrl != null && apiUrl != '') {
            Cif.api = apiUrl;
            Cif.imgUrl = Cif.api.toLowerCase().replace("/api", "")
        }

    }
    login() {
        if (this.userForm.invalid) {
            let formErrors = this.commonService.FormValidMsg(this.userForm, this.validationMessages);
            console.log(formErrors);
            this.commonService.hint(formErrors.ErrorMessage, this.translate.instant("public.Invalid_input"))
            return;
        }
        this.user = this.userForm.value;

        let now = null
        for (let index = this.userAndPwdList.length - 1; index >= 0; index--) {
            const element = this.userAndPwdList[index];
            if (element.loginName == this.user.loginName) {
                this.userAndPwdList.splice(index, 1)
                now = element;
                element.passWord = this.rememberPwd ? this.user.passWord : "";
            }
        }
        if (now == null) {
            now = {
                "loginName": this.user.loginName,
                "passWord": this.rememberPwd ? this.user.passWord : "",
            }
        }
        this.userAndPwdList.push(now)
        AppGlobal.CooksSet("userAndPwdList", JSON.stringify(this.userAndPwdList))
        AppGlobal.CooksSet("rememberPwd", this.rememberPwd);

        this.commonService.showLoading()
        this.toPostService.Post("auth/UserLogin", this.user).then((res: any) => {
            this.commonService.hideLoading()
            if (res == null) {
                this.commonService.hint(this.commonService.LanguageStr("public.LoginError"))
                return false;
            }
            if (res.IsSuccess) {
                AppGlobal.CooksSet("loginName", this.userForm.value.loginName)
                AppGlobal.SetToken(res.Code);
                AppGlobal.SetProperty(res.Data)
                this.router.navigate(['/pages']);

                return true
            }
            else {
                this.commonService.hint(res.Msg);
                return false
            };
        }, (err) => {
            this.commonService.hint(err, this.commonService.LanguageStr("public.Error"));
            return false
        })

    }


    isOpen = false
    CheckAppUrl() {
        setTimeout(() => {
            this.isOpen = false
        }, 200);
        if (!this.isOpen) {
            this.isOpen = true;
            return;
        }
        let buttons = [
            {
                name: "初始值",
                click: (data): Promise<any> => {
                    return new Promise((resolver, reject) => {
                        Cif.api = Cif._api
                        Cif.imgUrl = Cif.api.toLowerCase().replace("/api", "")
                        console.log("imgUrl:" + Cif.imgUrl);
                        console.log("api:" + Cif.api);
                        resolver("初始值")
                    })
                }
            },
            {
                name: "确认",
                click: (data): Promise<any> => {
                    return new Promise((resolver, reject) => {
                        AppGlobal.CooksSet('apiUrl', data.apiUrl);
                        Cif.api = data.apiUrl
                        Cif.imgUrl = Cif.api.toLowerCase().replace("/api", "")
                        console.log("imgUrl:" + Cif.imgUrl);
                        console.log("api:" + Cif.api);
                        resolver("确认")
                    })
                }
            }
        ]
        let inputs = [
            {
                name: 'apiUrl',
                value: Cif.api,
                placeholder: 'API连接地址'
            }
        ]


        this.commonService.Confirm("配置接口", [], buttons, inputs)
    }
    ChangeLoginName() {
        console.log(this.userForm.value.loginName)
        this.userForm.get('passWord').setValue("");
        this.userAndPwdList.forEach(element => {
            if (element.loginName == this.userForm.value.loginName) {
                this.userForm.get('passWord').setValue(element.passWord);
            }
        });
    }
}
