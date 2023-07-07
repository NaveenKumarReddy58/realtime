import { Component } from '@angular/core';
import { LocateDriverService } from './locate-driver.service';

@Component({
  selector: 'app-locate-driver',
  templateUrl: './locate-driver.component.html',
  styleUrls: ['./locate-driver.component.css'],
  providers: [LocateDriverService]
})
export class LocateDriverComponent {
  constructor(private locateDriverService: LocateDriverService) {}
  public driverLocationsData:any = [];
  ngOnInit(): void {
     
  }
  
}
