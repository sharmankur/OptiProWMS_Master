import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonData } from '../models/CommonData';
@Pipe({
  name: 'pickListStatus'
})
export class PickListStatusPipe implements PipeTransform {
   commonData: any; 
   pickListStatusEnum:any;
  constructor(private translate: TranslateService) {
    this.commonData= new CommonData(this.translate);
    this.pickListStatusEnum= this.commonData.PickListStatusEnum();
  }
  transform(value: any, ...args: any[]): any {
    var enumObject = this.pickListStatusEnum.filter(item => item.Value == value);
    //console.log("status name value from pipe:",enumObject.Value+","+this.translate.instant(enumObject[0].Name));
    return this.translate.instant(enumObject[0].Name);
  }
   
}
