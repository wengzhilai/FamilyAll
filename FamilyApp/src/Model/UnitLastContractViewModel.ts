export class UnitLastContractViewModel {
    constructor() { }
    JsonAttrib = {
        UnitId: "单元编号",
        TenantCode: "租户代号",
        TenantName: "租户名称",
        ContractCode: "合同代号",
        BeginDate: "合同开始日期",
        EndDate: "合同结束日期",
        Status: "单元状态",
        MonthAmount: "合约月租金",
        BrandName: "品牌",
        TradeName: "业态",
        TenantContactName: "租户主联系人",
        TenantContact: "租户主联系人联系方式",
        CheckOutDate: "退场日期"
    }
    
    ContractMasterId:number;
    Version:number;
    /// <summary>
    /// 单元编号
    /// </summary>
    UnitId: number;

    /// <summary>
    /// 租户Code
    /// </summary>
    TenantCode: string;

    /// <summary>
    /// 租户名称
    /// </summary>
    TenantName: string;
    /// <summary>
    /// 合同Code
    /// </summary>
    ContractCode: string;
    /// <summary>
    /// 合同开始日期
    /// </summary>
    BeginDate: Date;
    /// <summary>
    /// 合同结束日期
    /// </summary>
    EndDate: Date;
    /// <summary>
    /// 单元状态
    /// </summary>
    Status: string;
    /// <summary>
    /// 合约月租金
    /// </summary>
    MonthAmount: number;
    /// <summary>
    /// 品牌
    /// </summary>
    BrandName: string;
    /// <summary>
    /// 业态
    /// </summary>
    TradeName: string;
    /// <summary>
    /// 租户主联系人
    /// </summary>
    TenantContactName: string;
    /// <summary>
    /// 租户主联系人联系方式
    /// </summary>
    TenantContact: string;
    /// <summary>
    /// 退场日期
    /// </summary>
    CheckOutDate: Date;
}