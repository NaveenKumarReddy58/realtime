import { Component, Inject, Input, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DriverService } from '../_service/driver.service';
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
  lat = 51.678418;
  lng = 7.809007;
  options: any;
  @ViewChild(GoogleMap) map!: GoogleMap;
  markers: any= [];
  driver$: any;
  listOfDrivers: any= [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData ,
   private router : Router, private driverService: DriverService){

  }
  ngOnInit(){
    this.getCurrentLocation();
    
  }

  ngAfterViewInit(){
    if(this.isComponent){
    this.driverList();
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

  driverList(id?: number) {
    this.driverService.driverList(id);
    this.driver$ = this.driverService.getDrivers();

    this.driver$.subscribe((data: any) => {
      if(data && data.result && data.result.results){
        this.listOfDrivers= data.result.results;
        console.log(this.listOfDrivers)
      }

      if(this.driverLocations && this.driverLocations.length > 0){

        for (let index = 0; index < this.driverLocations.length; index++) {
          const name = this.getDriverName(this.driverLocations[index].driver_id);
          this.driverLocations[index]['name']= name;
        }
        setTimeout(()=>{
          this.driverLocations.forEach((element:any) => {
            this.addMarker(element.location.latitude , element.location.longitude , element.driver_id,element.name);
          });
        }, 1000)
        
      }
    });
  }
  addMarker(latitude:any, long:any, id:any,name:string) {
    let cord = {lat: latitude, lng: long}

    if(cord){
      this.markers.push(
        {
          id: id,
          position : cord,
          label: {
            color: '#0eb002',
            text: name?name.toString() : '',
            className: 'marker-label1',
            fontWeight: 'bold',
            labelClass: "marker-label1", // your desired CSS class
          },
          options: {
            icon: 'assets/images/map-icon.png'
          }
        }
      )
    }
    const bounds = this.getBounds(this.markers);
    this.map?.googleMap?.fitBounds(bounds);

    // const markers = [{

    //   position:{
    //   lat: 27  + ((Math.random() - 0.5) * 2) / 10,
    //   lng: 80 + ((Math.random() - 0.5) * 2) / 10,
    // },
    //   visible: false,
    //   opacity: 0.1,
    //   label: {
    //     color: 'black',
    //     text: 'Marker label ',
    //   },
    //   title: 'Marker title ',
    //   options: {
    //     animation: google.maps.Animation.DROP,
    //     icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
    //   }
    // }]

  }

  getDriverName(id:any){
    console.log(this.listOfDrivers)
    let label= '';
    this.listOfDrivers.filter((elt:any)=>{
      if(elt.id == id){
       label= elt.first_name+ " "+elt.last_name;
      }
    })
    console.log(label)
    return label.toString();

    //return "Asdf";
  }
  getBounds(markers:any){
    let north;
    let south;
    let east;
    let west;
  
    for (const marker of markers){
      // set the coordinates to marker's lat and lng on the first run.
      // if the coordinates exist, get max or min depends on the coordinates.
      north = north !== undefined ? Math.max(north, marker.position.lat) : marker.position.lat;
    south = south !== undefined ? Math.min(south, marker.position.lat) : marker.position.lat;
    east = east !== undefined ? Math.max(east, marker.position.lng) : marker.position.lng;
    west = west !== undefined ? Math.min(west, marker.position.lng) : marker.position.lng;
    };
  
    const bounds = { north, south, east, west };
  
    return bounds;
  }
  openInfoWindow(marker:any){

    this.router.navigate(['/admin/driver/details' , marker.id]);
  }
}
