import { JsonMessage } from "./JsonMessage"
import { PagingParam } from "./PagingParam"
import { UserDTO } from "./UserDTO"
import { KeyValuePair } from "./KeyValuePair";
/**
 * 请求数据包
 * 
 * @export
 * @class AppDTO
 */
export class AppDTO {
    constructor() {

     }
    /**
     * 数据
     * 
     * @type {any}
     * @memberof AppDTO
     */
    Data: any;
    /**
     * 信息
     * 
     * @type {JsonMessage}
     * @memberof AppDTO
     */
    Message: JsonMessage;
    /**
     * 分布参数
     * 
     * @type {JqGridParam}
     * @memberof AppDTO
     */
    PageParam:PagingParam;
    /**
     * 属性代码
     * 
     * @type {string}
     * @memberof AppDTO
     */
    PropertyCode:string;
    /**
     * 属性id
     * 
     * @type {number}
     * @memberof AppDTO
     */
    PropertyId:number;
    /**
     * 请求用户信息
     * 
     * @type {UserDTO}
     * @memberof AppDTO
     */
    User:UserDTO ;
    /**
     * 参数
     * 
     * @type {Array<KeyValuePair>}
     * @memberof AppDTO
     */
    para:Array<KeyValuePair>;

    /**
     * 初始化请求用户数据
     * 
     * @memberof AppDTO
     */
    InitUser(){
        if(this.User==null){
            this.User=new UserDTO();
        }
    }
    /**
     * 初始化分页数据
     * 
     * @memberof AppDTO
     */
    InitPageParam(){
        if(this.PageParam==null){
            this.PageParam=new PagingParam();
        }
    }
    /**
     * 参加数据
     * 
     * @param {*} key 
     * @param {*} value 
     * @memberof AppDTO
     */
    paraAdd(key:any,value:any,type:string="string"){
        if(this.para==null)this.para=new Array<KeyValuePair>();
        this.para.push(<KeyValuePair>{Key:key,Value:value,Type:type});
    }

}