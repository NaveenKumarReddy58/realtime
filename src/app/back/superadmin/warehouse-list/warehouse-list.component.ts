import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AddressService } from 'src/app/_service/address.service';
import { AuthService } from 'src/app/_service/auth.service';
import { WarehouseService } from 'src/app/_service/warehouse.service';
import { DialogAnimationsComponent } from '../../supersuperadmin/plan-list/dialog-animations/dialog-animations.component';
import { MatDialog } from '@angular/material/dialog';

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
  selectedDriversCount: any= 0;
  isShowDeleteDriverDialog: boolean= false;
  isDefaultAddress: boolean= false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    public warehouseService: WarehouseService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.warehouseList();
  }

  ngOnInit(): void {}

  warehouseList() {
    this.warehouseService.warehouseList();
    this.warehouse$ = this.warehouseService.getWarehouse();

    this.warehouse$.subscribe((data: any) => {
      this.warehouseData = data?.result;
      this.warehouseData && this.warehouseData.forEach((obj:any) => obj["checked"] = false)
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


  selectAll(){
    for(var i=0; i < this.warehouseData.length; i++){
        this.warehouseData[i].checked = true;
    }
    this.getSelectedDrivers(this.warehouseData)
  }
  deSelectAll(){
    for(var i=0; i < this.warehouseData.length; i++){
      this.warehouseData[i].checked = false;
  }
  this.getSelectedDrivers(this.warehouseData)
  }
  getSelectedDrivers(dList:any){
    this.selectedDriversCount = this.warehouseData.reduce((counter:any, obj:any) => obj.checked === true ? counter += 1 : counter, 0); // 6
  }
  changeStatus(id:any , status:any){
    for(var i=0; i < this.warehouseData.length; i++){
      if(this.warehouseData[i].id == id){
        this.warehouseData[i].checked = !status;
      }
    }
    this.getSelectedDrivers(this.warehouseData)
  }
  onClickDeleteDriverDialog(e:any){
    e.preventDefault()
    this.isShowDeleteDriverDialog = !this.isShowDeleteDriverDialog;
  }
  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    const dialogRef = this.dialog.open(DialogAnimationsComponent, {
      width: '450px',
    
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        title: "Alert?",
        message: "Do you want to make this Warehouse address as your default address?"}
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult){
        this.isDefaultAddress= !this.isDefaultAddress;
      }
    });
      
  }
 
}
