export class YearPicker {
  public static yeasGroup: any = [
    { "name": "阳历", value: 0 },
    { "name": "康熙", value: 1661 },
    { "name": "雍正", value: 1722 },
    { "name": "乾隆", value: 1736 },
    { "name": "嘉庆", value: 1796 },
    { "name": "道光", value: 1820 },
    { "name": "咸丰", value: 1851 },
    { "name": "同治", value: 1861 },
    { "name": "光绪", value: 1874 },
    { "name": "宣统", value: 1908 },
    { "name": "民国", value: 1911 }
  ]
  public static yeasGroup1: any = [ 
    { "name": "康熙", value: 1661 },
    { "name": "雍正", value: 1722 },
    { "name": "乾隆", value: 1736 },
    { "name": "嘉庆", value: 1796 },
    { "name": "道光", value: 1820 },
    { "name": "咸丰", value: 1851 },
    { "name": "同治", value: 1861 },
    { "name": "光绪", value: 1874 },
    { "name": "宣统", value: 1908 },
    { "name": "民国", value: 1911 }
  ]
  public static tianArr: any = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  public static diArr: any = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  private static allTianDi: Array<string>=[];
  private static start: number = 1804;
  constructor() {
  }
  public static GetAllTianDi() {
    if (this.allTianDi.length <= 0) {
      var temArr: Array<string> = [];
      for (var i = 0; i < 60; i++) {
        temArr.push(this.tianArr[i % 10] + this.diArr[i % 12])
      }
      this.allTianDi = temArr;
    }
    return this.allTianDi;
  }
  public static GetYearByTianDi(startYeas: number, tianDi: string) {
    console.log(startYeas)
    console.log(tianDi)
    let startNum: number = (startYeas - this.start) % 60;
    if (startNum < 0) startNum = startNum + 60;

    let endNum: number = 0;
    this.GetAllTianDi();
    for(var i=0;i<this.allTianDi.length;i++){
      if(this.allTianDi[i]==tianDi)
      {
        endNum=i;
      }
    }

    console.log(startYeas)
    console.log(endNum)
    console.log(startNum)

    if (endNum >= startNum) {

      return startYeas - 0 + (endNum - startNum)
    }
    else {
      return startYeas - 0 + (endNum - startNum - 0 + 60 - 0)
    }
  }
  public static GetTianDiByYear(startYeas: number) {
    let indexNum = (startYeas - this.start) % 60
    if (indexNum < 0) indexNum = indexNum - 0 + 60;
    let a: number = 0;
    let b: number = 0;
    a = indexNum % 10
    b = indexNum % 12
    return this.tianArr[a] + this.diArr[b];
  }
}