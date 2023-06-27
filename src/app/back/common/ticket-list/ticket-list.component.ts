import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from 'src/app/_service/auth.service';
import { TicketsService } from 'src/app/_service/tickets.service';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css'],
  providers:[TicketsService]
})
export class TicketListComponent {
  tabName: string | undefined= "DT";
  page:number= 0;
  ticketsData:any;
  ticketsCount:any;
  showPaginator: boolean= false;
  headerCountsData: any= [];
  statusCountsData: any=[];
  selectedStatus: string='';
  searchText: any='';
  constructor(public authService: AuthService, private ticketService: TicketsService, private router: Router) {}
  ngOnInit(): void {
    if(this.authService._isRoleName == 'superadmin'){
      this.tabName= undefined;
    } else{
      let tabVal= sessionStorage.getItem('ticket_selected_tab');
      if(tabVal == 'CT'){
        this.tabName= 'CT'
      } else if(tabVal == 'MT') {
        this.tabName= 'MT';
      } else{
        this.tabName= 'DT';
      }
    }
    this.ticketsList()
    
    
  }
  ticketsList(){
    this.ticketService.getTickets(this.page, this.tabName, this.selectedStatus, this.searchText).subscribe((data)=>{
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
  convertLastUpdateTime(s:any){
      return moment(s).format("ddd MM yyyy,h:mm A");
  }
  handlePageEvent(e: any) {
    this.page= e.pageIndex;
    this.ticketsList()
  }
  search(e:any){
    this.searchText= e.target.value;
    this.ticketsList();
  }
  myTickets(){
    sessionStorage.setItem('ticket_selected_tab', 'MT')
    this.tabName= "MT";
    this.ticketsList();
  }
  onStatusChange(val:string){
    this.selectedStatus= val;
    this.ticketsList();
  }
  oneIsTrue(data:any) {
    if(data && data.length > 0){
      return data.some(function (el:any) {
        return !el.is_read;
      });
    } else{
      return false;
    }
    
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
    sessionStorage.setItem('ticket_selected_tab', 'CT')
    this.tabName= "CT";
    this.ticketsList();

  }
  driverTickets(){
    sessionStorage.setItem('ticket_selected_tab', 'DT')
    this.tabName= "DT";
    this.ticketsList();
  }
  createTicket(){
    
    this.router.navigate(['/admin/create-ticket'])
  }
  ngOnDestroy(){

  }
}
