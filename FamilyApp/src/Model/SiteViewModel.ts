import { PropertyViewModel } from "./PropertyViewModel";
export class SiteViewModel {
    constructor() { }

    /**
     * 项目编号
     * 
     * @type {number}
     * @memberof SiteViewModel
     */
    SiteId: number;

    /**
     * 项目名称(中)
     * 
     * @type {string}
     * @memberof SiteViewModel
     */
    CnName: string;

    /**
     * 项目名称(英)
     * 
     * @type {string}
     * @memberof SiteViewModel
     */
    EnName: string;

    /**
     * 物业列表
     * 
     * @type {Array<PropertyViewModel>}
     * @memberof SiteViewModel
     */
    PropertyList: Array<PropertyViewModel>;

}