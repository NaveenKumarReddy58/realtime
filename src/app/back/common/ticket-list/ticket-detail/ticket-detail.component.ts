import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_service/auth.service';
import { TicketsService } from 'src/app/_service/tickets.service';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css'],
  providers:[TicketsService]
})
export class TicketDetailComponent {
  public id;
  public isCreateTicketMode: boolean= true;
  attachments: any= [];
  createTicketForm!: FormGroup;
  isSubmitted: boolean= false;
  loading: boolean= false;
  constructor(private authService: AuthService, private router: Router , private toastr:ToastrService ,private ticketService: TicketsService, private route: ActivatedRoute, private formBuilder: FormBuilder) {
    this.createTicketForm = formBuilder.group({
      subject: ['', [Validators.required]],
      description: ['', [Validators.required]],
      images:['']

    });
    this.id = this.route.snapshot.params['id'];
    if(this.id){
      this.isCreateTicketMode= false;
    } else{
      this.isCreateTicketMode= true;
    }
  }
  ngOnInit(): void {
    
  }
  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log('image', file);

      const reader = new FileReader();
      reader.onload = (e) => {
        this.attachments.push(reader.result);
      };
      this.createTicketForm.patchValue({
        images: file
      })
      //this.createTicketForm.controls['images'].value.push(file);
      reader.readAsDataURL(file);
    }
  }
  createTicket(){
    this.isSubmitted= true;
    if (this.createTicketForm.invalid) {
      return;
    }

    const formData = new FormData();
    for (let i in this.createTicketForm.value) {
      if (this.createTicketForm.value[i] instanceof Blob) {
        formData.append(
          i,
          this.createTicketForm.value[i],
          this.createTicketForm.value[i].name ? this.createTicketForm.value[i].name : ''
        );
      } else {
        if(this.createTicketForm.value[i].length > 0){
          formData.append(i, this.createTicketForm.value[i]);
        } 
      }

    }
    this.loading = true;
    this.ticketService.createTicket(formData).subscribe((data:any)=>{
      if (this.authService.resultCodeError(data)) {
        this.loading = false;
        return;
      }
      this.loading= false;
      this.toastr.success(data?.resultDescription);
      this.router.navigate(['/admin/tickets']); 
    } , ()=>{
      this.loading= false;
      this.toastr.error("Unable to create ticket");

    })
  }
}
