import { AppGlobal } from "../../Classes/AppGlobal";

export class PostBaseModel {
    constructor() {
        let base=AppGlobal.GetPostBaseModel()
        if(base!=null){
            this.CompanyId=base.CompanyId;
            this.SiteId=base.SiteId;
            this.PropertyId=base.PropertyId;
        }
    }
    /**
     * 主键
     */
    Key:string=""

    Token:string=""
    
    /**
     * 公司ID
     */ 
    CompanyId: number=0;
    /**
     * 项目编号
     */
    SiteId: number=0;
    /**
     * 物业编号
     */
    PropertyId: number=0;
    /**
     * 产品
     */
    Product:string=AppGlobal.GetProduct()
}