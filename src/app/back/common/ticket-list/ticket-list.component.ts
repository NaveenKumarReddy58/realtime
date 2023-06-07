import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css'],
})
export class TicketListComponent {
  tabName: string= "DT";
  constructor(private router: Router) {}
  ngOnInit(): void {}

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
