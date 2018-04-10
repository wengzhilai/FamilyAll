import { KeyValuePair } from "./KeyValuePair";
export class RequestSaveModel {
    constructor() {
    }

    /// <summary>
    /// 参数
    /// </summary>
    para: Array<KeyValuePair>

    /// <summary>
    /// 需保存的字段
    /// </summary>
    SaveKeys:Array<string>
    /// <summary>
    /// 提交的实体
    /// </summary>
    Data: any


}