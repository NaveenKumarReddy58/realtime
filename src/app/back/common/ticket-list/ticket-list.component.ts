import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_service/auth.service';
import { TicketsService } from 'src/app/_service/tickets.service';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css'],
  providers:[TicketsService]
})
export class TicketListComponent {
  tabName: string= "DT";
  page:number= 1;
  ticketsData:any;
  ticketsCount:any;
  showPaginator: boolean= false;
  constructor(private authService: AuthService, private ticketService: TicketsService, private router: Router) {}
  ngOnInit(): void {
    this.ticketsList()
  }
  ticketsList(){
    this.ticketService.getTickets(this.page).subscribe((data)=>{
      if (this.authService.resultCodeError(data)) {
        return;
      }
      this.showPaginator= false;
      this.showPaginator= true;
      this.ticketsData= data?.result?.results;
      this.ticketsCount= data?.result?.count;

    },(error)=>{
      this.authService.dataError(error);
    })
  }
  handlePageEvent(e: any) {
    this.page= e.pageIndex+1;
    this.ticketsList()
  }
  myTickets(){
    this.tabName= "MT";
  }

  customerTickets(){
    this.tabName= "CT";
  }
  driverTickets(){
    this.tabName= "DT";
  }
  createTicket(){
    this.router.navigate(['/admin/create-ticket'])
  }
}
