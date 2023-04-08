import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/_service/auth.service';
import { PlanService } from 'src/app/_service/plan.service';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css'],
})
export class TopComponent {
  plandata: any;
  searchbox = false;
  isLoggedIn: any = false;
  @Input() isRoleIn: any;

  planCount$!: Observable<object[]>;

  ngOnInit(): void {}

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public planService: PlanService,
    public authService: AuthService,
    private toastr: ToastrService
  ) {
    this.authService.getDashboard().subscribe((data: any) => {
      this.isLoggedIn = data;
    });

    this.authService.getRole().subscribe((data: any) => {
      if (data != false) {
        this.isRoleIn = data[0];
      } else {
        this.isRoleIn = data;
      }
    });

    if (this.isRoleIn == '1') {
      this.planCount();
    }
  }

  planCount() {
    this.planService.planCount();
    this.planCount$ = this.planService.getPlanCount();

    this.planCount$.subscribe((data: any) => {
      this.plandata = data.result;
    });
  }

  searchboxopen() {
    this.searchbox = !this.searchbox;
  }

  bookmarkedfield() {
    this.authService.setRouter({
      bookmarked: true,
      plan: null,
      search_text: null,
      deactivated: null,
      start_date: null,
      end_date: null,
    });
  }

  searchfield(event: any) {
    let textVal = event.target.value;
    if (textVal == '') {
      textVal = null;
    }
    this.authService.setRouter({
      search_text: textVal,
      plan: null,
      bookmarked: null,
      deactivated: null,
      start_date: null,
      end_date: null,
    });
  }

  planfield(id: Number) {
    this.authService.setRouter({
      plan: id,
      search_text: null,
      bookmarked: null,
      deactivated: null,
      start_date: null,
      end_date: null,
    });
  }
}
