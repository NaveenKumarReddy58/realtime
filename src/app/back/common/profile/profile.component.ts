import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/_service/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  profileData: any;
  loading = false;

  imageSrc: any = 'assets/images/profilephoto.png';

  profile$!: Observable<object[]>;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private toastr: ToastrService
  ) {
    this.getProfile();
  }
  ngOnInit(): void {}

  getProfile() {
    this.profile$ = this.authService.getProfile();

    this.profile$.subscribe((data: any) => {
      this.profileData = data?.result;
    });
  }
}
