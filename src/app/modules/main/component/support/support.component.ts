import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../service/navigation-service.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {

  constructor(private ns: NavigationService) { }

  ngOnInit(): void {
    this.ns.resetNavigatToSupport();
  }

}
