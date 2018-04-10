/**
 * Created by wengzhilai on 2017/1/12.
 */
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Config } from "../Classes/Config";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { CommonService } from "./Common.Service";
import { AppGlobal } from "../Classes/AppGlobal";
import { AppReturnDTO } from "../Model/Transport/AppReturnDTO"
import { AppDTO } from "../Model/Transport/AppDTO"
import { KeyValuePair } from "../Model/Transport/KeyValuePair"

@Injectable()
export class ToPostService {
  constructor(
    private http: Http,
    private commonService: CommonService
  ) {
  }

  List(apiName: string, postBean: AppDTO, callback = null) {
    postBean.InitUser();
    postBean.User.Token = AppGlobal.GetToken();
    postBean.InitPageParam();
    if (postBean.PageParam.PageSize == null || postBean.PageParam.PageSize == 0) {
      postBean.PageParam.PageSize = Config.pageSize;
    }
    if (postBean.PageParam.PageIndex == null || postBean.PageParam.PageIndex == 0) {
      postBean.PageParam.PageIndex = 1;
    }
    return this.Post(apiName, postBean, callback)
  }

  SaveOrUpdate(apiName: string, bean, saveKeyStr: string = null, para: Array<KeyValuePair> = null, callback = null) {
    if (saveKeyStr == null || saveKeyStr == '') {
      saveKeyStr = this.commonService.GetBeanNameStr(bean);
    }
    if (saveKeyStr == "") {
      this.commonService.hint("保存参数saveKeys不能为空");
      return;
    }
    var postBean: AppDTO = new AppDTO();
    postBean.InitUser();
    postBean.User.Token = AppGlobal.GetToken();
    postBean.Data = bean;
    postBean.para = para;
    postBean.PropertyCode = saveKeyStr;
    return this.Post(apiName, postBean, callback)
  }


  Search(apiName, postBean: any, callback = null): Observable<any> {
    console.log("请求[" + apiName + "]参数：");
    console.log(postBean);
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (AppGlobal.GetToken() != null) {
      headers.append('Authorization', 'Bearer ' + AppGlobal.GetToken());
    }
    let options = new RequestOptions({ headers: headers });
    return this.http
      .post(Config.api + apiName, postBean, options)
      .map(response => response.json());
  }

  Post(apiName, postBean: any, callback = null) {
    console.group("开始请求[" + apiName + "]参数：");
    console.time("Post时间");

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (AppGlobal.GetToken() != null) {
      headers.append('Authorization', 'Bearer ' + AppGlobal.GetToken());
    }
    // console.log(headers)
    this.commonService.PlatformsExists("core") ? console.log(postBean) : console.log(JSON.stringify(postBean));
    let options = new RequestOptions({ headers: headers });

    return this.http
      .post(Config.api + apiName, postBean, options)
      .toPromise()
      .then((res: any) => {
        console.log("返回结果：");
        let response: any = res.json();
        this.commonService.PlatformsExists("core") ? console.log(response) : console.log(JSON.stringify(response));
        if (response.IsSuccess) {
          if (callback) {
            callback(response);
          }
        }
        else {
          this.commonService.PlatformsExists("core") ? console.warn(response.Msg) : console.warn(JSON.stringify(response.Msg));
        }
        console.timeEnd("Post时间");
        console.groupEnd();
        return response;
      }, (error) => {
        console.error('请求失败:');
        this.commonService.PlatformsExists("core") ? console.error(error) : console.error(JSON.stringify(error)); // for demo purposes only
        console.timeEnd("Post时间");
        console.groupEnd();

        let errorMsg: AppReturnDTO = new AppReturnDTO();
        errorMsg.IsSuccess = false;
        errorMsg.Msg = "连接网络失败";
        return errorMsg
      })
      .catch(this.handleError);
  }


  PostToObservable(apiName, postBean: any, callback = null) {
    console.group("开始请求[" + apiName + "]参数：");
    console.time("Post时间");

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (AppGlobal.GetToken() != null) {
      headers.append('Authorization', 'Bearer ' + AppGlobal.GetToken());
    }
    // console.log(headers)
    this.commonService.PlatformsExists("core") ? console.log(postBean) : console.log(JSON.stringify(postBean));
    let options = new RequestOptions({ headers: headers });

    return this.http.post(Config.api + apiName, postBean, options).map((res) => {
      console.log("返回结果：");
      let response: any = res.json();
      this.commonService.PlatformsExists("core") ? console.log(response) : console.log(JSON.stringify(response));
      if (response.IsSuccess) {
        if (callback) {
          callback(response);
        }
      }
      else {
        this.commonService.PlatformsExists("core") ? console.warn(response.Msg) : console.warn(JSON.stringify(response.Msg));
      }
      console.timeEnd("Post时间");
      console.groupEnd();
      return response;
    })
  }

  PostContentType(apiName, postStr: string, contentType: string) {
    console.group("请求[" + apiName + "]参数：");
    console.time("Post时间");
    console.log(postStr);

    var headers = new Headers();
    headers.append('Content-Type', contentType);
    let options = new RequestOptions({ headers: headers });

    return this.http
      .post(Config.api + apiName, postStr, options)
      .toPromise()
      .then((res: Response) => {
        console.log("返回结果：");
        this.commonService.PlatformsExists("core") ? console.log(res) : console.log(res);
        console.timeEnd("Post时间");
        console.groupEnd();
        let response: any = res.json();
        return response;
      }, (error) => {
        console.log('请求失败'); // for demo purposes only
        this.commonService.PlatformsExists("core") ? console.log(error) : console.log(JSON.stringify(error));
        console.timeEnd("Post时间");
        console.groupEnd();
      })
      .catch(this.handleError);
  }

  /**
   * 查询单条数据
   * 
   * @param {any} apiName 接口名称
   * @param {any} id 参数
   * @param {any} [callback=null] 
   * @returns 
   * @memberof ToPostService
   */
  Single(apiName, id, callback = null) {
    if (id == null && id == 0) {
      alert("查询id不能为空");
      return;
    }
    var postBean: AppDTO = new AppDTO();
    postBean.InitUser();
    postBean.User.Token = AppGlobal.GetToken();
    postBean.Data = id;
    return this.Post(apiName, postBean, callback)
  }

  handleError(error: any): Promise<any> {
    console.error('请求失败', error); // for demo purposes only
    //this.commonService.showError(error)
    let errorMsg: AppReturnDTO = new AppReturnDTO();
    errorMsg.IsSuccess = false;
    errorMsg.Msg = error.message;
    return Promise.reject(errorMsg);
  }

  /**
   * 退出登录,并关闭tabls的监听
   */

  LoginOut() {
    Config.homeSubscribeNotification = false;
    return this.Post("UserPls/LogoutedEquipment",
      {
        EquipmentCode: AppGlobal.CooksGet("EquipmentCode")
      }
    );

  }
}
