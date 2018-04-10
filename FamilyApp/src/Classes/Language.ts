export class Language {
    constructor() { }
    ENName:string;
    CHName:string;

    AllLanguages:Array<Language>;
    LoadAllLanguages(){
        this.AllLanguages=new Array<Language>();
        this.AllLanguages.push(<Language>{'ENName':'Cancel','CHName':'取消'});
        this.AllLanguages.push(<Language>{'ENName':'Done','CHName':'完成'});
        this.AllLanguages.push(<Language>{'ENName':'Okay','CHName':'确定'});
        this.AllLanguages.push(<Language>{'ENName':'Dismiss','CHName':'取消'});
    }
}