 import * as moment from 'moment';
 import * as momentTZ from 'moment-timezone';
import { DatePipe } from '@angular/common';
import { CommonConstants } from '../const/common-constants';
export class DateTimeHelper{
    constructor(private datepipe:DatePipe){}
  
    public static  ParseDate(date:any){   
       var  dateFormat ="YYYY-MM-DD hh:mm:ss";      
        // return new Date(moment.utc(date).local().format(Configuration.dateFormat));
         return new Date(moment.utc(date).format(dateFormat));
         //return "";
        
    }

    public static ParseToUTC(date:any){  
       // console.log(moment.utc(date).local().format(Configuration.dateFormat));   
      return new Date(moment.utc(date).format(CommonConstants.dateFormat));
       
    }
}
 