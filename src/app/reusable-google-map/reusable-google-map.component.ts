import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
declare var google: {
  maps: {
    Geocoder: new () => any;
    places: { Autocomplete: new (arg0: any) => any };
  };
};
export interface DialogData {
  height: string;
}
@Component({
  selector: 'app-reusable-google-map',
  templateUrl: './reusable-google-map.component.html',
  styleUrls: ['./reusable-google-map.component.css']
})
export class ReusableGoogleMapComponent {
  geoCoder: any;
  initialCoordinates!: google.maps.LatLngLiteral;
  dialogData!: DialogData;
  @Input() height: any;
  @Input() isComponent: boolean= false;
  markerPositions: google.maps.LatLngLiteral[] = [];
  @Input() driverLocations: any;



  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData){

  }
  ngOnInit(){
    this.getCurrentLocation();
    
  }

  ngAfterViewInit(){
    if(this.driverLocations && this.driverLocations.length > 0){
      this.driverLocations.forEach((element:any) => {
        this.addMarker(element.location.latitude , element.location.longitude);
      });
    }
    
  }

  getCurrentLocation(){
    this.geoCoder = new google.maps.Geocoder();
    if(!(this.driverLocations && this.driverLocations.length > 0)){
      navigator.geolocation.getCurrentPosition((position) => {
        this.initialCoordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    }
    
  }
  addMarker(latitude:any, long:any) {
    let cord = {lat: latitude, lng: long}

      if (cord != null) this.markerPositions.push(cord);

    console.log(this.markerPositions[0])
  }
}
