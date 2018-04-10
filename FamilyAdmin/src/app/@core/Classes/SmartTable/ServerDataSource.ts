import { Http } from '@angular/http';
import { RequestOptionsArgs } from '@angular/http/src/interfaces';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import { ServerSourceConf } from './ServerSourceConf';
import { getDeepFromObject } from './helpers';
import { ToPostService } from '../../Service/ToPost.Service';
import { CommonService } from '../../Service/Common.Service';

import { RequestPagesModel } from '../../Model/Transport/RequestPagesModel';
import 'rxjs/add/operator/toPromise';
import { concat } from 'rxjs/observable/concat';
export class ServerDataSource extends LocalDataSource {
  protected conf: ServerSourceConf;
  protected lastRequestCount: number = 0;
  constructor(
    protected toPostService: ToPostService,
    private commonService: CommonService,
    conf: ServerSourceConf | {} = {},
    private inKey:string=null
  ) {
    super();
    this.conf = new ServerSourceConf(conf);
    if (!this.conf.endPoint) {
      throw new Error('没有设置接口地址');
    }
  }

  count(): number {
    return this.lastRequestCount;
  }

  getElements(): Promise<any> {
    return this.requestElements().map(res => {
      this.lastRequestCount = res.Msg;
      this.data = this.extractDataFromResponse(res);
      return this.data;
    }).toPromise();
  }
  /**
   * 获取默认的表参数
   */
  static getDefaultSetting() {
    return {
      noDataMessage: "无数据",
      mode: "external",
      selectMode:"multi",
      hideSubHeader:true, //隐藏默认的过滤行
      add: {
        addButtonContent: '<i class="nb-plus"></i>',
        createButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
      },
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
        saveButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
      },
      actions: {
        columnTitle: "操作",
        // position:"right"
      },
      columns: {}
    }
  }
  /**
   * 删除有Hide为true的项
   * @param objJson 
   */
  static ReMoveHideItem(objJson) {
    let reJson = {}
    for (var item in objJson) {
      if (objJson[item]["hide"] == null || objJson[item]["hide"] != true) {
        reJson[item] = objJson[item]
      }
    }
    return reJson
  }
  /**
   * Extracts array of data from server response
   * @param res
   * @returns {any}
   */
  protected extractDataFromResponse(res: any): Array<any> {
    const rawData = res;
    const data = !!this.conf.dataKey ? getDeepFromObject(rawData, this.conf.dataKey, []) : rawData;

    if (data.Data instanceof Array) {
      return data.Data;
    }
    else {
      return [];
    }
  }

  /**
   * Extracts total rows count from the server response
   * Looks for the count in the heders first, then in the response body
   * @param res
   * @returns {any}
   */
  protected extractTotalFromResponse(res: any): number {
    if (res.headers.has(this.conf.totalKey)) {
      return +res.headers.get(this.conf.totalKey);
    } else {
      const rawData = res.json();
      return getDeepFromObject(rawData, this.conf.totalKey, 0);
    }
  }

  protected requestElements(): Observable<any> {

    let allPar = this.createRequestOptions();
    let par: URLSearchParams = allPar.params as URLSearchParams
    let postBean: RequestPagesModel = new RequestPagesModel();
    par.paramsMap.forEach((vars, key) => {
      if (key == "_limit") postBean.PageSize = parseInt(vars[0]);
      if (key == "_page") postBean.PageIndex = parseInt(vars[0]);
      if (key == "_sort") postBean.OrderBy = [{ Key: vars[0], Value: par.paramsMap.get("_order")[0], Type: "" }]; //排序字段
      if (key.indexOf('_like') > 0) {
        let keyName = key.substr(0, key.indexOf('_like'));
        postBean.SearchKey.push({ Key: keyName, Value: par.paramsMap.get(key)[0], Type: "like" }); //排序字段
      }
    })
    postBean.Key=this.inKey
    this.commonService.showLoading();
    return this.toPostService.PostToObservable(this.conf.endPoint, postBean).map(x => {
      this.commonService.hideLoading();
      return x
    })
  }

  protected createRequestOptions(): RequestOptionsArgs {
    let requestOptions: RequestOptionsArgs = {};
    requestOptions.params = new URLSearchParams();

    requestOptions = this.addSortRequestOptions(requestOptions);
    requestOptions = this.addFilterRequestOptions(requestOptions);
    return this.addPagerRequestOptions(requestOptions);
  }

  protected addSortRequestOptions(requestOptions: RequestOptionsArgs): RequestOptionsArgs {
    const searchParams: URLSearchParams = <URLSearchParams>requestOptions.params;

    if (this.sortConf) {
      this.sortConf.forEach((fieldConf) => {
        searchParams.set(this.conf.sortFieldKey, fieldConf.field);
        searchParams.set(this.conf.sortDirKey, fieldConf.direction.toUpperCase());
      });
    }

    return requestOptions;
  }

  protected addFilterRequestOptions(requestOptions: RequestOptionsArgs): RequestOptionsArgs {
    const searchParams: URLSearchParams = <URLSearchParams>requestOptions.params;

    if (this.filterConf.filters) {
      this.filterConf.filters.forEach((fieldConf: any) => {
        if (fieldConf['search']) {
          searchParams.set(this.conf.filterFieldKey.replace('#field#', fieldConf['field']), fieldConf['search']);
        }
      });
    }

    return requestOptions;
  }

  protected addPagerRequestOptions(requestOptions: RequestOptionsArgs): RequestOptionsArgs {
    const searchParams: URLSearchParams = <URLSearchParams>requestOptions.params;

    if (this.pagingConf && this.pagingConf['page'] && this.pagingConf['perPage']) {
      searchParams.set(this.conf.pagerPageKey, this.pagingConf['page']);
      searchParams.set(this.conf.pagerLimitKey, this.pagingConf['perPage']);
    }

    return requestOptions;
  }
}

