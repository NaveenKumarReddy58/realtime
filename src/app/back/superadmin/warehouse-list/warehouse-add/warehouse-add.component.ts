import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/_service/auth.service';
import { WarehouseService } from 'src/app/_service/warehouse.service';

@Component({
  selector: 'app-warehouse-add',
  templateUrl: './warehouse-add.component.html',
  styleUrls: ['./warehouse-add.component.css'],
})
export class WarehouseAddComponent {
  addWare!: FormGroup;
  loading = false;
  isSubmitted = false;

  id: Number;
  isAddMode: boolean;
  editPlan: any;

  warehouse$!: Observable<object[]>;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    public warehouseService: WarehouseService,
    private toastr: ToastrService
  ) {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.addWare = formBuilder.group({
      warehouse_name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      contact_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      alt_phone: [
        '',
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      is_main_localation: [false],
    });

    if (!this.isAddMode) {
      this.warehouseService.warehouseList(this.id);
      this.warehouse$ = this.warehouseService.getWarehouse();

      this.warehouse$.subscribe((data: any) => {
        this.addWare.patchValue(data.results);
      });
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addWare.controls;
  }

  // convenience getter for easy access to form values
  get frmValues() {
    return this.addWare.value;
  }

  ngOnInit(): void {}

  handleSubmit() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.addWare.invalid) {
      return;
    }

    this.loading = true;
    console.log('Api Data Err ffff', this.f, this.frmValues);

    const formData = new FormData();
    for (let i in this.addWare.value) {
      if (this.addWare.value[i] instanceof Blob) {
        formData.append(
          i,
          this.addWare.value[i],
          this.addWare.value[i].name ? this.addWare.value[i].name : ''
        );
        // console.log('blob');
      } else {
        formData.append(i, this.addWare.value[i]);
      }
    }

    if (this.isAddMode) {
      this.warehouseService.warehouseAdd(formData).subscribe(
        (data: any) => {
          if (this.authService.resultCodeError(data)) {
            return;
          }

          this.toastr.success(data?.actionPerformed);
          this.router.navigate([
            '/' + this.authService._isRoleName + '/warehouse',
          ]);
        },
        (error) => {
          this.authService.dataError(error);
          this.loading = false;
        }
      );
    } else {
      this.warehouseService.warehouseEdit(this.id, formData).subscribe(
        (data: any) => {
          if (this.authService.resultCodeError(data)) {
            return;
          }

          this.toastr.success(data?.actionPerformed);
          this.router.navigate([
            '/' + this.authService._isRoleName + '/warehouse',
          ]);
        },
        (error) => {
          this.authService.dataError(error);
          this.loading = false;
        }
      );
    }
  }
}
