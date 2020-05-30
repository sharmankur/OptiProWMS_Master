import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonData } from '../models/CommonData';

@Pipe({
  name: 'transferMeans'
})
export class TransferMeansPipe implements PipeTransform {
  commonData: any; 
  transferMeansEnum:any;
 constructor(private translate: TranslateService) {
   this.commonData= new CommonData(this.translate);
   this.transferMeansEnum= this.commonData.TransferMeansTypeEnum();
 }
  transform(value: any, ...args: any[]): any {
    var enumObject = this.transferMeansEnum.filter(item => item.Value == value);
    //console.log("status name value from pipe:",enumObject.Value+","+this.translate.instant(enumObject[0].Name));
    return this.translate.instant(enumObject[0].Name);
  }

}
