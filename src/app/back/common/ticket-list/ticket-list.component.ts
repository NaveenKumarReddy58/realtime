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
  page:number= 0;
  ticketsData:any;
  ticketsCount:any;
  showPaginator: boolean= false;
  headerCountsData: any= [];
  statusCountsData: any=[];
  selectedStatus: string='';
  constructor(private authService: AuthService, private ticketService: TicketsService, private router: Router) {}
  ngOnInit(): void {
    this.ticketsList()
  }
  ticketsList(){
    this.ticketService.getTickets(this.page, this.tabName, this.selectedStatus).subscribe((data)=>{
      if (this.authService.resultCodeError(data)) {
        return;
      }
      this.showPaginator= false;
      this.showPaginator= true;
      this.ticketsData= data?.result?.results;
      this.ticketsCount= data?.result?.count;
      this.getTicketsCount();

    },(error)=>{
      this.authService.dataError(error);
    })
  }
  handlePageEvent(e: any) {
    this.page= e.pageIndex;
    this.ticketsList()
  }
  myTickets(){
    this.tabName= "MT";
    this.ticketsList();
  }
  onStatusChange(val:string){
    this.selectedStatus= val;
    this.ticketsList();
  }
  getTicketsCount(){
    this.ticketService.getTicketsCount().subscribe((data)=>{
      if (this.authService.resultCodeError(data)) {
        return;
      }
      this.headerCountsData= data?.result;
      this.getStatusCount()
    },(error)=>{
      this.authService.dataError(error);
    })
  }

  getStatusCount(){
    this.ticketService.getStatusCount(this.tabName).subscribe((data)=>{
      if (this.authService.resultCodeError(data)) {
        return;
      }
      this.statusCountsData= data?.result;
    },(error)=>{
      this.authService.dataError(error);
    })
  }
  customerTickets(){
    this.tabName= "CT";
    this.ticketsList();

  }
  driverTickets(){
    this.tabName= "DT";
    this.ticketsList();
  }
  createTicket(){
    
    this.router.navigate(['/admin/create-ticket'])
  }
}
