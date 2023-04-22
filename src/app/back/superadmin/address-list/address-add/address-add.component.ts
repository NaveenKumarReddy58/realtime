import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddressService } from 'src/app/_service/address.service';
import { AuthService } from 'src/app/_service/auth.service';

declare var google: {
  maps: {
    Geocoder: new () => any;
    places: { Autocomplete: new (arg0: any) => any };
  };
};

@Component({
  selector: 'app-address-add',
  templateUrl: './address-add.component.html',
  styleUrls: ['./address-add.component.css'],
})
export class AddressAddComponent {
  addressF!: FormGroup;
  loading = false;
  isSubmitted = false;

  addressId: number = 0;
  @ViewChild('pickupkeyword')
  public searchElementRefFrom!: ElementRef;
  private geoCoder: any;
  public addressSearchHistory: any = [];

  initialCoordinates!: google.maps.LatLngLiteral;
  lat: any;
  lng: any;
  markers: any=[];
  place: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    public addressService: AddressService,
    private toastr: ToastrService,
    public zone: NgZone
  ) {
    this.addressF = formBuilder.group({
      address: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
    });
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  initializeMap() {
    this.geoCoder = new google.maps.Geocoder();
    let autocompletefrom = new google.maps.places.Autocomplete(
      this.searchElementRefFrom.nativeElement
    );

    navigator.geolocation.getCurrentPosition((position) => {
      this.initialCoordinates = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.getFromAddress(
          "place.place_id",
          position.coords.latitude,
          position.coords.longitude
        );
      this.addMarker(position.coords.latitude,position.coords.longitude)
    });
    autocompletefrom.addListener('place_changed', () => {
      this.zone.run(() => {
        let place = autocompletefrom.getPlace();
        this.place = autocompletefrom.getPlace();
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }
        this.getFromAddress(
          place.place_id,
          place.geometry.location.lat(),
          place.geometry.location.lng()
        );
      });
    });
    
  }
markerOptions: any = []
markerPositions: google.maps.LatLngLiteral[] = [];
addMarker(latitude:any, long:any) {
  this.markerPositions=[];
  let cord = {lat: latitude, lng: long}
    if (cord != null) this.markerPositions.push(cord);
}


  getFromAddress(place_id: string, latitude: number, longitude: number) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results: any, status: any) => {
        if (status === 'OK') {
          let place = results[0];
          if (place) {
            let streetAddress1: string = '';
            let streetAddress2: string = '';
            let streetAddress3: string = '';
            let city: string = '';
            let country: string = '';
            let pinCode: string = '';
            for (let i = 0; i < place.address_components.length; i++) {
              for (
                let j = 0;
                j < place.address_components[i].types.length;
                j++
              ) {
                if (place.address_components[i].types[j] == 'postal_code') {
                  pinCode = place.address_components[i].long_name;
                }
                if (
                  place.address_components[i].types[j] ==
                  'administrative_area_level_1'
                ) {
                  streetAddress1 = place.address_components[i].long_name;
                }
                if (
                  place.address_components[i].types[j] ==
                  'administrative_area_level_2'
                ) {
                  streetAddress2 = place.address_components[i].long_name;
                }
                if (
                  place.address_components[i].types[j] ==
                  'administrative_area_level_3'
                ) {
                  streetAddress3 = place.address_components[i].long_name;
                }
                if (place.address_components[i].types[j] == 'locality') {
                  city = place.address_components[i].long_name;
                }
                if (place.address_components[i].types[j] == 'country') {
                  country = place.address_components[i].long_name;
                }
              }
            }
            if (
              this.addressSearchHistory.length > 0 &&
              this.addressSearchHistory.find(
                (x: { googleMapAddressId: any }) =>
                  x.googleMapAddressId == place.place_id
              )
            ) {
              const ob = this.addressSearchHistory.find(
                (x: { googleMapAddressId: any }) =>
                  x.googleMapAddressId == place.place_id
              );
              if (ob) {
                this.addressId = ob.addressId;
              }
            } else {
              const obj = {
                googleMapAddressId: place.place_id,
                googleMapAddress: this.searchElementRefFrom.nativeElement.value,
                lat: String(place.geometry.location.lat()).toString(),
                long: String(place.geometry.location.lng()).toString(),
                streetAddress1: streetAddress1,
                streetAddress2: streetAddress2,
                streetAddress3: streetAddress3,
                country: country,
                city: city,
                pinCode: pinCode,
              };

              this.lat = String(place.geometry.location.lat()).toString();

              this.lng = String(place.geometry.location.lng()).toString();

              this.addressF.patchValue({
                address: this.searchElementRefFrom.nativeElement.value,
                latitude: this.lat,
                longitude: this.lng,
              });

              this.initialCoordinates = {
                lat: parseFloat(
                  String(place.geometry.location.lat()).toString()
                ),
                lng: parseFloat(
                  String(place.geometry.location.lng()).toString()
                ),
              };

              console.log('addr', obj);
            }

            this.addMarker(latitude, longitude);
          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to:' + status);
        }
      }
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addressF.controls;
  }

  // convenience getter for easy access to form values
  get frmValues() {
    return this.addressF.value;
  }

  ngOnInit(): void {}

  handleSubmit() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.addressF.invalid) {
      return;
    }

    this.loading = true;
    console.log('Api Data Err ffff', this.f, this.frmValues);

    const formData = new FormData();
    for (let i in this.addressF.value) {
      if (this.addressF.value[i] instanceof Blob) {
        formData.append(
          i,
          this.addressF.value[i],
          this.addressF.value[i].name ? this.addressF.value[i].name : ''
        );
        // console.log('blob');
      } else {
        formData.append(i, this.addressF.value[i]);
      }
    }

    this.addressService.addressAdd(formData).subscribe(
      (data: any) => {
        if (this.authService.resultCodeError(data)) {
          this.loading = false;
          return;
        }

        this.toastr.success(data?.resultDescription);
        this.router.navigate(['/' + this.authService._isRoleName + '/address']);
      },
      (error) => {
        this.authService.dataError(error);
        this.loading = false;
      }
    );
  }
}
