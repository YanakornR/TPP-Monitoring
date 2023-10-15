import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  route: string;

  constructor(private router: Router,private location: Location) { 
    router.events.subscribe((val) => {
      if(location.path() != ''){
        this.route = location.path();
      } else {
        this.route = '/home'
      }
    });
  }

  ngOnInit(): void {
    if(this.route === '/home'){
      this.router.navigate(['/home']);
    }
  }

}
