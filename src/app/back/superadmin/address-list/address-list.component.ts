import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AddressService } from 'src/app/_service/address.service';
import { AuthService } from 'src/app/_service/auth.service';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css'],
})
export class AddressListComponent {
  addressData: any;
  loading = false;
  delloading = false;
  toggle: any = [];
  public page: number= 1;

  address$!: Observable<object[]>;
  showPaginator: boolean= false;
  totalAddressess: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    public addressService: AddressService,
    private toastr: ToastrService
  ) {
    this.addressList(1);
  }

  ngOnInit(): void {}
  search(e:any){
    this.addressList(this.page, e.target.value);
  }
  addressList(page?:number,search_text?:string) {
    this.addressService.addressSearch(page,search_text);
    this.address$ = this.addressService.getAddress();

    this.address$.subscribe((data: any) => {
      this.showPaginator= false;
      this.showPaginator= true;
      this.totalAddressess= data?.result?.count;

      this.addressData = data?.result?.results;
    });
  }
  handlePageEvent(e: any) {
    this.page= e.pageIndex+1;
    this.addressList(this.page)
  }
  addressDelete(id: any) {
    this.toggle[id] = true;
    this.delloading = true;
    this.addressService.addressDelete(id).subscribe(
      (data: any) => {
        if (this.authService.resultCodeError(data)) {
          this.delloading = false;
          return;
        }

        this.addressList(this.page);
        this.toastr.success('Address Deleted');
        this.delloading = false;
      },
      (error) => {
        this.authService.dataError(error);
        this.delloading = false;
      }
    );
  }
}
