import { BuildingViewModel } from "./BuildingViewModel";
import { FloorViewModel } from "./FloorViewModel";
import { PropertyViewModel } from "./PropertyViewModel";
import { SiteViewModel } from "./SiteViewModel";
import { UnitViewModel } from "./UnitViewModel";
export class ModelVar {
    constructor() {
        
    }

    Modelbuilding:BuildingViewModel;
    Modelfloor:FloorViewModel;
    ModelProperty:PropertyViewModel;
    ModelSite:SiteViewModel;
    ModelUnit:UnitViewModel;



    /**
     * 楼栋
     * 
     * @type {Array<BuildingViewModel>}
     * @memberof ModelVar
     */
    ArrayBuilding:Array<BuildingViewModel>;
    /**
     * 楼层
     * 
     * @type {Array<FloorViewModel>}
     * @memberof ModelVar
     */
    ArrayFloor:Array<FloorViewModel>;
    /**
     * 物业
     * 
     * @type {Array<PropertyViewModel>}
     * @memberof ModelVar
     */
    ArrayProperty:Array<PropertyViewModel>;
    /**
     * 项目
     * 
     * @type {Array<SiteViewModel>}
     * @memberof ModelVar
     */
    ArraySite:Array<SiteViewModel>;
    
    InitBuilding(){
        this.Modelbuilding=new BuildingViewModel();
    }
    InitFloor(){
        this.Modelfloor=new FloorViewModel()
    }
    InitProperty(){
        this.ModelProperty=new PropertyViewModel()
    }
    InitSite(){
        this.ModelSite=new SiteViewModel()
    }
    InitUnit(){
        this.ModelUnit=new UnitViewModel()
    }

    InitArrBuilding(){
        this.ArrayBuilding=new Array<BuildingViewModel>()
    }
    InitArrFloor(){
        this.ArrayFloor=new Array<FloorViewModel>()
    }
    InitArrProperty(){
        this.ArrayProperty=new Array<PropertyViewModel>()
    }
    InitArrSite(){
        this.ArraySite=new Array<SiteViewModel>()
    }

}