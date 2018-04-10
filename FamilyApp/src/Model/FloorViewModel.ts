export class FloorViewModel {
    constructor() { }

    /**
     * 物业编号
     * 
     * @type {number}
     * @memberof FloorViewModel
     */
    PropertyId: number;

    /**
     * 楼栋编号
     * 
     * @type {number}
     * @memberof FloorViewModel
     */
    BuildingId: number;


    /**
     * 楼层编号
     * 
     * @type {number}
     * @memberof FloorViewModel
     */
    FloorId: number;
    /**
     * 楼层Code
     * 
     * @type {string}
     * @memberof FloorViewModel
     */
    Code: string;
    /**
   * 楼层名称(中)
   * 
   * @type {string}
   * @memberof FloorViewModel
   */
    CnName: string;
    /**
     * 楼层名称(英)
     * 
     * @type {string}
     * @memberof FloorViewModel
     */
    EnName: string;
}
