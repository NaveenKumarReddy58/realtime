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
  ticketDetails: any;
  messagesHistory: any;
  customMessage: string='';
  ticketStatus: string= '';
  constructor(private authService: AuthService, private router: Router , private toastr:ToastrService ,private ticketService: TicketsService, private route: ActivatedRoute, private formBuilder: FormBuilder) {
    this.createTicketForm = formBuilder.group({
      subject: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
    this.id = this.route.snapshot.params['id'];
    this.imgs=[];
    this.attachments=[];
    if(this.id){
      this.isCreateTicketMode= false;
      this.getTicketDetails();
    } else{
      this.isCreateTicketMode= true;
    }
  }
  ngOnInit(): void {
    
  }

  getTicketDetails(){
    this.ticketService.getTicketDetails(this.id).subscribe((data:any)=>{
      this.loading= false;
      if (this.authService.resultCodeError(data)) {
        this.loading = false;
        return;
      }
      this.ticketDetails= data?.results;
      this.generateMessageHistory(this.ticketDetails?.messages);
    } , ()=>{
      this.loading= false;
      this.toastr.error("Unable to create ticket");

    })
  }

  sendChat(){
    var formdata = new FormData();
      formdata.append('ticket_id', JSON.stringify(Number(this.id)));
      if(this.ticketStatus.length > 0){
        formdata.append('ticket_status', this.ticketStatus);
      }
      if(this.customMessage.trim().length > 0){
        formdata.append('message', this.customMessage);
      }
      if(this.imgs && this.imgs.length > 0){
          formdata.append('chat_image',this.imgs[0])
      }
      //formdata.append('chat_image', '');

    this.ticketService.sendChat(formdata).subscribe((data:any)=>{
      this.loading= false;
      if (this.authService.resultCodeError(data)) {
        this.loading = false;
        return;
      }
      this.imgs=[];
      this.attachments=[];
      this.ticketStatus='';
      this.customMessage='';
      this.getTicketDetails();
    } , ()=>{
      this.loading= false;
      this.toastr.error("Unable to Send");

    })
  }

  updateTicketStatus(val:string){
    this.ticketStatus= val;
  }

  generateMessageHistory(data:any){
    this.messagesHistory= [];
    let usr1='';
    let usr2='';
    for (let index = 0; index < data.length; index++) {
      if(usr1.length == 0){
        usr1 = data[index].sender_email;
      } else if(usr2.length == 0 && usr1 != data[index].sender_email){
        usr2 = data[index].sender_email
      }      
    }
    data.forEach((element:any) => {
      if(element?.sender_email == usr1){
        element['user_type']= "USER1";
        this.messagesHistory.push(element)
      } else if(element?.sender_email == usr2){
        element['user_type']= "USER2";
        this.messagesHistory.push(element)
      }
    });

    console.log(this.messagesHistory);
  }
  imgs:any = [];
  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log('image', file);

      const reader = new FileReader();
      reader.onload = (e) => {
        this.attachments.push(reader.result);
      };
      this.imgs.push(file)
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
    
    if(this.imgs && this.imgs.length > 0){
      for(var i=0; this.imgs.length > i; i++){
        formData.append('images',this.imgs[i])
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
