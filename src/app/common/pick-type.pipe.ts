import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonData } from '../models/CommonData';

@Pipe({
  name: 'pickType'
})
export class PickTypePipe implements PipeTransform {

  
  commonData: any; 
  pickTypeEnum:any;
 constructor(private translate: TranslateService) {
   this.commonData= new CommonData(this.translate);
   this.pickTypeEnum= this.commonData.PickTypeEnum();
 }
  transform(value: any, ...args: any[]): any {
    var enumObject = this.pickTypeEnum.filter(item => item.Value == value);
  //  console.log("status name value from pipe:",enumObject.Value+","+this.translate.instant(enumObject[0].Name));
    return this.translate.instant(enumObject[0].Name);
  }

}
