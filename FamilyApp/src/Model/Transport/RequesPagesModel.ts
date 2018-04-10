
import { KeyValuePair } from "./KeyValuePair";
import { PostBaseModel } from "./PostBaseModel";
/**
 * 请求数据包
 * 
 * @export
 * @class RequesPagesModel
 */
export class RequesPagesModel extends PostBaseModel  {
    constructor() {
        super();
        this.AttachParams=new Array<KeyValuePair>()
        this.SearchKey=new Array<KeyValuePair>()
        this.OrderBy=new Array<KeyValuePair>()
     }
     PageIndex:number=1;
     PageSize:number=10;
     AttachParams:Array<KeyValuePair>;
     SearchKey:Array<KeyValuePair>;
     OrderBy:Array<KeyValuePair>;
     Data:any;
}