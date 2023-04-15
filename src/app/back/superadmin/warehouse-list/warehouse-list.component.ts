import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AddressService } from 'src/app/_service/address.service';
import { AuthService } from 'src/app/_service/auth.service';
import { WarehouseService } from 'src/app/_service/warehouse.service';

@Component({
  selector: 'app-warehouse-list',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.css'],
})
export class WarehouseListComponent {
  warehouseData: any;
  loading = false;
  delloading = false;
  toggle: any = [];

  warehouse$!: Observable<object[]>;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    public warehouseService: WarehouseService,
    private toastr: ToastrService
  ) {
    this.warehouseList();
  }

  ngOnInit(): void {}

  warehouseList() {
    this.warehouseService.warehouseList();
    this.warehouse$ = this.warehouseService.getWarehouse();

    this.warehouse$.subscribe((data: any) => {
      this.warehouseData = data.result;
    });
  }

  controlOnChange(id: Number, e: any) {
    if (e.target.checked) {
      this.warehouseSet(id);
    } else {
      this.warehouseSet(id);
    }
    this.warehouseList();
  }

  warehouseSet(id: Number) {
    this.loading = true;
    this.warehouseService.warehouseSet(id).subscribe(
      (data: any) => {
        if (this.authService.resultCodeError(data)) {
          this.loading = false;
          return;
        }

        this.warehouseList();
        this.router.navigate(['/admin/warehouse']);
        this.toastr.success('Warehouse Status Updated');
      },
      (error) => {
        this.authService.dataError(error);
        this.loading = false;
      }
    );
  }

  warehouseDelete(id: any) {
    this.toggle[id] = true;
    this.delloading = true;
    this.warehouseService.warehouseDelete(id).subscribe(
      (data: any) => {
        if (this.authService.resultCodeError(data)) {
          this.delloading = false;
          return;
        }

        this.warehouseList();
        this.router.navigate(['/admin/warehouse']);
        this.toastr.success('Warehouse Deleted');
        this.delloading = false;
      },
      (error) => {
        this.authService.dataError(error);
        this.delloading = false;
      }
    );
  }
}
