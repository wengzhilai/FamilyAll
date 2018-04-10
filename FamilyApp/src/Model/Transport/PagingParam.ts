import { KeyValuePair } from "./KeyValuePair";
/**
 * 分页参数
 * 
 * @export
 * @class JqGridParam
 */
export class PagingParam {
    constructor() { }
    /**
     * 当前页
     * 
     * @type {number}
     * @memberof JqGridParam
     */
    PageIndex:number;
    /**
     * 总记录数
     * 
     * @type {number}
     * @memberof JqGridParam
     */
    TotalCount:number;
    /**
     * 每页行数
     * 
     * @type {number}
     * @memberof JqGridParam
     */
    PageSize:number=10;

    /**
     * 排序类型
     * 
     * @type {string}
     * @memberof JqGridParam
     */
    Orderby:Array<KeyValuePair>;

    /**
     * 总页数
     * 
     * @type {number}
     * @memberof JqGridParam
     */
    TotalPages:number;

    /**
     * 排序类型
     * 
     * @type {string}
     * @memberof JqGridParam
     */
    SearchObject:Array<KeyValuePair>;
}