import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css'],
})
export class TicketDetailComponent {
  public id;
  public isCreateTicketMode: boolean= true;
  constructor(private route: ActivatedRoute) {
    this.id = this.route.snapshot.params['id'];
    if(this.id){
      this.isCreateTicketMode= false;
    } else{
      this.isCreateTicketMode= true;
    }
  }
  ngOnInit(): void {
    
  }
}
