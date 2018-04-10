/**
 * 请求返回数据
 * 
 * @export
 * @class AppReturnDTO
 */
export class AppReturnDTO {
    constructor() { }
    /**
     * 数据
     * 
     * @type {*}
     * @memberof AppReturnDTO
     */
    Data: any;
    /**
     * 信息
     * 
     * @type {string}
     * @memberof AppReturnDTO
     */
    Msg: string;
    /**
     * 是否成功
     * 
     * @type {boolean}
     * @memberof AppReturnDTO
     */
    IsSuccess: boolean;
    /**
     * 代码
     * 
     * @type {string}
     * @memberof AppReturnDTO
     */
    Code: string;
}