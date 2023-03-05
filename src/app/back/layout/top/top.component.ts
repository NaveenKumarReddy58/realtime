import { Component } from '@angular/core';
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

  plancount$!: Observable<object[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public planService: PlanService,
    public authService: AuthService,
    private toastr: ToastrService
  ) {
    this.plancount();
  }

  plancount() {
    this.planService.plancount();
    this.plancount$ = this.planService.get_plancount();

    this.plancount$.subscribe((data: any) => {
      console.log('this.plancount$', data);
      this.plandata = data.result;
    });
  }

  searchboxopen() {
    this.searchbox = !this.searchbox;
  }

  bookmarkedfield() {
    // changes the route without moving from the current view or
    // triggering a navigation event,
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        bookmarked: true,
      },
      // queryParamsHandling: 'preserve',
      queryParamsHandling: 'merge',
      // preserve the existing query params in the route
      // skipLocationChange: true,
      // do not trigger navigation
    });
  }

  searchfield(event: any) {
    // changes the route without moving from the current view or
    // triggering a navigation event,
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search_text: event.target.value,
      },
      // queryParamsHandling: 'preserve',
      queryParamsHandling: 'merge',
      // preserve the existing query params in the route
      // skipLocationChange: true,
      // do not trigger navigation
    });
  }
}
