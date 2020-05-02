import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datestringToobject'
})
export class DatestringToobjectPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    //"yyyy-MM-dd'T'HH:mm:ss"
    //2020-03-05T18:30:00
    var date = new Date(value);
    return date;
  }

}
