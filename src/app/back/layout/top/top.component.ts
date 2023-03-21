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
  @Input() isRoleIn: any;

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
      this.plandata = data.result;
    });
  }

  searchboxopen() {
    this.searchbox = !this.searchbox;
  }

  bookmarkedfield() {
    this.planService.setrouter({ bookmarked: true });
  }

  searchfield(event: any) {
    this.planService.setrouter({ search_text: event.target.value });
  }

  planfield(id: Number) {
    this.planService.setrouter({ plan: id });
  }
}
