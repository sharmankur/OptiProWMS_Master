import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonData } from '../models/CommonData';

@Pipe({
  name: 'pickOperation'
})
export class PickOperationPipe implements PipeTransform {

  commonData: any; 
  pickOperationEnum:any;
 constructor(private translate: TranslateService) {
   this.commonData= new CommonData(this.translate);
   this.pickOperationEnum= this.commonData.PickOperationEnum();
 }

  transform(value: any, ...args: any[]): any {
   var enumObject = this.pickOperationEnum.filter(item => item.Value == value);
    //console.log("status name value from pipe:",enumObject.Value+","+this.translate.instant(enumObject[0].Name));
    return this.translate.instant(enumObject[0].Name);
  }

}
