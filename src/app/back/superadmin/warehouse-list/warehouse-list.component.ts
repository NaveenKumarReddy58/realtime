import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AddressService } from 'src/app/_service/address.service';
import { AuthService } from 'src/app/_service/auth.service';
import { WarehouseService } from 'src/app/_service/warehouse.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogAnimationsComponent } from '../../common/dialog-animations/dialog-animations.component';

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
  selectedDriversCount: any = 0;
  isShowDeleteDriverDialog: boolean = false;
  isDefaultAddress: boolean = false;
  wareHouseId: any;
  page: any= 1;
  public showPaginator: boolean= false;
  public totalWarehouses: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    public warehouseService: WarehouseService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.warehouseList(this.page);
  }

  ngOnInit(): void {}

  warehouseList(page?: number) {
    this.warehouseService.warehouseList(page);
    this.warehouse$ = this.warehouseService.getWarehouse();

    this.warehouse$.subscribe((data: any) => {
      this.showPaginator= false;
      this.showPaginator= true;
      this.totalWarehouses= data?.result?.count;
      this.warehouseData = data?.result?.results;
      console.log("compoennt",data)
      // this.warehouseData &&
      //   this.warehouseData.forEach((obj: any) => (obj['is_main_localation'] = false));
    });
  }

  handlePageEvent(e: any) {
    this.page= e.pageIndex+1;
    this.warehouseList(this.page)

  }
  controlOnChange(id: Number, e: any) {
    if (e.target.checked) {
      this.warehouseSet(id, true);
    } else {
      this.warehouseSet(id, false);
    }
  }

  warehouseSet(id: any, val:any) {
    this.loading = true;
    var formdata = new FormData();
    formdata.append('is_main_localation',val);
    this.warehouseService.warehouseSet(id).subscribe(
      (data: any) => {
        if (this.authService.resultCodeError(data)) {
          this.loading = false;
          return;
        }

        this.warehouseList(this.page);
        this.toastr.success('Warehouse Status Updated');
      },
      (error) => {
        this.toastr.error('Failed to update');
        this.warehouseList(this.page);
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

        this.warehouseList(this.page);
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

  selectAll() {
    for (var i = 0; i < this.warehouseData.length; i++) {
      this.warehouseData[i].checked = true;
    }
    this.getSelectedDrivers(this.warehouseData);
  }
  deSelectAll() {
    for (var i = 0; i < this.warehouseData.length; i++) {
      this.warehouseData[i].checked = false;
    }
    this.getSelectedDrivers(this.warehouseData);
  }
  getSelectedDrivers(dList: any) {
    this.selectedDriversCount = this.warehouseData.reduce(
      (counter: any, obj: any) =>
        obj.checked === true ? (counter += 1) : counter,
      0
    ); // 6
  }
  changeStatus(id: any, status: any) {
    for (var i = 0; i < this.warehouseData.length; i++) {
      if (this.warehouseData[i].id == id) {
        this.warehouseData[i].checked = !status;
      }
    }
    this.getSelectedDrivers(this.warehouseData);
  }

  onClickDeleteDriverDialog(e: any) {
    e.preventDefault();
    this.isShowDeleteDriverDialog = !this.isShowDeleteDriverDialog;
  }

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    id:any
  ): void {
    const dialogRef = this.dialog.open(DialogAnimationsComponent, {
      width: '450px',

      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        title: 'Alert?',
        message:
          'Do you want to make this Warehouse address as your default address?',
      },
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult){
        this.isDefaultAddress= !this.isDefaultAddress;
      }
    });
  }
}
