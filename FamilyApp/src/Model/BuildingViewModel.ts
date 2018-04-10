export class BuildingViewModel {
    constructor() {

    }

    /**
     * 物业编号
     * 
     * @type {number}
     * @memberof BuildingViewModel
     */
    PropertyId: number

    /**
     * 楼栋编号
     * 
     * @type {number}
     * @memberof BuildingViewModel
     */
    BuildingId: number;
    /**
     * 楼栋名称(中)
     * 
     * @type {string}
     * @memberof BuildingViewModel
     */
    CnName: string;
    /**
     * 楼栋名称(英)
     * 
     * @type {string}
     * @memberof BuildingViewModel
     */
    EnName: string;
}