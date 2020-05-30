import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonData } from '../models/CommonData';

@Pipe({
  name: 'pickenum'
})
export class PickenumPipe implements PipeTransform {

  commonData: any; 
  pickEnum:any;
 constructor(private translate: TranslateService) {
   this.commonData= new CommonData(this.translate);
   this.pickEnum= this.commonData.pickEnum();
 }

  transform(value: any, ...args: any[]): any {
   var enumObject = this.pickEnum.filter(item => item.Value == value);
    //console.log("status name value from pipe:",enumObject.Value+","+this.translate.instant(enumObject[0].Name));
    return this.translate.instant(enumObject[0].Name);
  }
}
