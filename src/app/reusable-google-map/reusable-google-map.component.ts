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


  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData){

  }
  ngOnInit(){
    this.getCurrentLocation();
  }

  getCurrentLocation(){
    this.geoCoder = new google.maps.Geocoder();
    navigator.geolocation.getCurrentPosition((position) => {
      this.initialCoordinates = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }
}
