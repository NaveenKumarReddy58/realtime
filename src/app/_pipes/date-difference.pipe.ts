/**
 * @author Ronak Patel
 * @description This pipe create for find difference between two date.
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateDifference',
  pure: true,
  standalone: true,
})
export class DateDifference implements PipeTransform {
  transform(startingDate: Date, args?: any): any {
    var startDate = new Date();
    let currentDate = new Date(startingDate);

    let ret = Math.floor(
      (Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      ) -
        Date.UTC(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate()
        )) /
        (1000 * 60 * 60 * 24)
    );
    if (ret < 0) {
      ret = 0;
    }
    return ret + ' Days ';
  }
}
