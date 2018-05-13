/**
 * Created by wengzhilai on 2017/1/12.
 */
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Config } from "../Classes/Config";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { CommonService } from "./Common.Service";
import { AppGlobal } from "../Classes/AppGlobal";
import { AppReturnDTO } from "../Model/Transport/AppReturnDTO"

@Injectable()
export class ToPostService {
  constructor(
    private http: Http,
    private commonService: CommonService
  ) {
  }

  Post(apiName, postBean: any, headers = new Headers()) {
    console.group("开始请求[" + apiName + "]参数：");
    console.time("Post时间");

    headers.append('Content-Type', 'application/json');
    if (AppGlobal.GetToken() != null) {
      headers.append('Authorization', 'Bearer ' + AppGlobal.GetToken());
    }

    console.log(headers)
    this.commonService.PlatformsExists("core") ? console.log(postBean) : console.log(JSON.stringify(postBean));
    let options = new RequestOptions({ headers: headers });

    return this.http
      .post(Config.api + apiName, postBean, options)
      .toPromise()
      .then((res: any) => {
        console.log("返回结果：");
        let response: any = res.json();
        this.commonService.PlatformsExists("core") ? console.log(response) : console.log(JSON.stringify(response));
        if (response.Status!=null) {
          if(response.Status == "Success"){
            response.IsSuccess = true
            if(response.Msg==null){
              response.Msg=response.Message
            }
          }
          else{
            response.IsSuccess = false
          }
        }

        if (!response.IsSuccess) {
          this.commonService.PlatformsExists("core") ? console.warn(response.Msg) : console.warn(JSON.stringify(response.Msg));
        }
        console.timeEnd("Post时间");
        console.groupEnd();
        return response;
      }, (error) => {
        console.error('请求失败:');

        this.commonService.PlatformsExists("core") ? console.error(error) : console.error(JSON.stringify(error)); // for demo purposes only
        console.error("接中地址：" + Config.api + apiName)
        console.error("参数")
        this.commonService.PlatformsExists("core") ? console.error(postBean) : console.error(JSON.stringify(postBean)); // for demo purposes only
        console.timeEnd("Post时间");

        console.groupEnd();
        // this.commonService.showError(error);
        return { IsSuccess: false, Msg: "网络错误", Status: "Fail" }
      })
      .catch(this.handleError);
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

  Soap(apiName, postBean: any) {
    var headers = new Headers();
    headers.append('Content-Type', "text/xml");
    headers.append('SOAPAction', "http://tempuri.org/IApp/Register");
    let sendBody = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:{apiName}>
         {iem} 
      </tem:{apiName}>
   </soapenv:Body>
</soapenv:Envelope>
    `
    sendBody = sendBody.replace(/\{apiName\}/g, apiName)
    let iem = []
    for (var item in postBean) {
      var objV = postBean[item];
      iem.push("<tem:" + item + ">" + objV + "</tem:" + item + ">");
    }
    sendBody = sendBody.replace("{iem}", iem.join("\r\n"))
    return this.Post("", sendBody, headers)
  }

  handleError(error: any): Promise<any> {
    console.error('请求失败');
    console.error(error);
    //this.commonService.showError(error)
    let errorMsg: AppReturnDTO = new AppReturnDTO();
    errorMsg.IsSuccess = false;
    errorMsg.Msg = error.message;
    return Promise.reject(errorMsg);
  }

}
