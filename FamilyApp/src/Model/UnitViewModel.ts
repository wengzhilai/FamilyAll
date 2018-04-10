import { UnitLastContractViewModel } from "./UnitLastContractViewModel";
export class UnitViewModel {
    constructor() {
        this.LastContractModel=new UnitLastContractViewModel()
     }
    JsonAttrib={
        UnitId: "单元编号",
        SiteName: "项目名称(中)",
        PropertyName: "物业",
        BuildingName: "楼栋",
        UnitFloor: "楼层",
        UnitCode: "代号",
        VirtualUnitTypeName:"类型",
        Code: "单元代号",
        RentArea: "面积",
        BasePrice: "单元低价 每日每平方",
        TenantCode: "当前租户代号",
        TenantName: "租户名称",
        ContractCode: "合同代号",
        BeginDate: "合同开始日期",
        EndDate: "合同结束日期",
        Status: "状态",
        MonthAmount: "租金",
        TradeName: "业态",
        DayPerSquareAmount: "每天每平方租金",
        ContractLeaseTypeName: "租约类型",
        ContractManageUser: "负责人",
        ContractTitle: "合约标题",
        BrandName: "品牌",
        CloseMethodText: "收银方式",
        CheckInDate: "进场日期",
        IntentDate: "出租日期",
        TenantContactName: "联系人",
        TenantContact: "联系方式",
        LastContractModel: "显示最后一次租约",
        UnitCategoryName:"单元类别",
        IsVirtual:"是否是虚拟单元",
        UnitName:"单元名称",
        MaxParallelContractNum:"最大租约数",
        CurrentContractNum: "当前租约数",
        Length:" 长",
        Width: "宽",
        Height:"高",
        Location:"位置",
        MeasurementUnits:"单位",
        MeasurementUnitStr:"单位",
    };

    ContractMasterId:number;
    Version:number;
    /**
     * 单元编号
     * 
     * @type {number}
     * @memberof UnitViewModel
     */
    UnitId: number

    /**
     * 项目名称(中)
     * 
     * @type {string}
     * @memberof UnitViewModel
     */
    SiteName: string;

    /**
     * 物业名称(中)
     * 
     * @type {string}
     * @memberof UnitViewModel
     */
    PropertyName: string;

    /**
     * 楼栋名称(中)
     * 
     * @type {string}
     * @memberof UnitViewModel
     */
    BuildingName: string;

    /**
     * 楼层名称(中)
     * 
     * @type {string}
     * @memberof UnitViewModel
     */
    UnitFloor: string;

    /**
     * 单元代号
     * 
     * @type {string}
     * @memberof UnitViewModel
     */
    Code: string;

    /**
     * 单元面积
     * 
     * @type {number}
     * @memberof UnitViewModel
     */
    RentArea: number;

    /**
     * 单元低价 每日每平方
     * 
     * @type {number}
     * @memberof UnitViewModel
     */
    BasePrice: number;

    /**
     * 当前租户代号
     * 
     * @type {string}
     * @memberof UnitViewModel
     */
    TenantCode: string;

    /**
     * 租户名称
     * 
     * @type {string}
     * @memberof UnitViewModel
     */
    TenantName: string;

    /**
     * 合同代号
     * 
     * @type {string}
     * @memberof UnitViewModel
     */
    ContractCode: string;

    /**
     * 合同开始日期
     * 
     * @type {Date}
     * @memberof UnitViewModel
     */
    BeginDate: Date;

    /**
     * 合同结束日期
     * 
     * @type {Date}
     * @memberof UnitViewModel
     */
    EndDate: Date;

    /**
     * 单元状态
     * 
     * @type {string}
     * @memberof UnitViewModel
     */
    Status: string;

    /**
     * 合约月租金
     * 
     * @type {number}
     * @memberof UnitViewModel
     */
    MonthAmount: number;


    /**
     * 业态
     * 
     * @type {string}
     * @memberof UnitViewModel
     */
    TradeName: string;

    /// 

    /**
     * 合约每天每平方租金
     * 
     * @type {number}
     * @memberof UnitViewModel
     */
    DayPerSquareAmount: number;

    /// 

    /**
     * 租约类型
     * 
     * @type {string}
     * @memberof UnitViewModel
     */
    ContractLeaseTypeName: string;

    /**
     * 合约负责人
     * 
     * @type {string}
     * @memberof UnitViewModel
     */
    ContractManageUser: string;

    /**
     * 合约标题
     * 
     * @type {string}
     * @memberof UnitViewModel
     */
    ContractTitle: string;

    /**
     * 
     * 
     * @type {string}
     * @memberof UnitViewModel
     */
    BrandName: string;

    /**
     * 收银方式
     * 
     * @type {string}
     * @memberof UnitViewModel
     */
    CloseMethodText: string;

    /**
     * 进场日期
     * 
     * @type {Date}
     * @memberof UnitViewModel
     */
    CheckInDate: Date;

    /**
     * 出租日期
     * 
     * @type {Date}
     * @memberof UnitViewModel
     */
    IntentDate: Date;

    /**
     * 租户主联系人
     * 
     * @type {string}
     * @memberof UnitViewModel
     */
    TenantContactName: string;

    /**
     * 租户主联系人联系方式
     * 
     * @type {string}
     * @memberof UnitViewModel
     */
    TenantContact: string;

    /**
     * 如果当期Status=Empty 显示最后一次租约
     * 
     * @type {UnitLastContractViewModel}
     * @memberof UnitViewModel
     */
    LastContractModel: UnitLastContractViewModel;

        UnitCategoryName:string ;///  单元类别
        IsVirtual:boolean ;///  是否是虚拟单元（虚拟单元用虚线框，否则用实线边框）
        VirtualUnitTypeName:string ;///  虚拟单元类别
        UnitCode:string ;///  单元Code
        UnitName:string ;   ///  单元名称
        MaxParallelContractNum:number ; //最大租约数(广告单元)
        CurrentContractNum:number ;/// 当前租约数(广告单元)
        Length:number ;/// 长(广告单元)
        Width:number ;// 宽(广告单元)
        Height:number ;/// 高(广告单元)
        Location:string ;/// 位置(广告单元)
        MeasurementUnits:string ;/// 单位(广告单元)
        MeasurementUnitStr:string ;/// 单位(广告单元)
}