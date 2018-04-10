export class PropertyViewModel {
    constructor() {
    }
    BacklogCount: number;
    SiteEnName: string;
    SiteCnName: string;
    /**
     * 项目编号
     * 
     * @type {int}
     * @memberof PropertyViewModel
     */
    SiteId: number;
    /**
     * 物业编号
     * 
     * @type {int}
     * @memberof PropertyViewModel
     */
    PropertyId: number;

    /**
     * 物业名称(中)
     * 
     * @type {string}
     * @memberof PropertyViewModel
     */
    CnName: string;

    /**
     * 物业名称(英)
     * 
     * @type {string}
     * @memberof PropertyViewModel
     */
    EnName: string;
}