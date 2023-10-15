import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/modules/main/service/navigation-service.service';

@Component({
  selector: 'admin-side-bar',
  templateUrl: './admin-side-bar.component.html',
  styleUrls: ['./admin-side-bar.component.css']
})
export class AdminSideBarComponent implements OnInit {

  role: any = '';
  nowMenu: string = '';
  private _authenticateObj: string = 'tpp-monitoring-authenticate-obj';
  filtersLoaded: Promise<boolean>;
  constructor(private router: Router, private ns: NavigationService) { }

  async ngOnInit() {
    let url: any = await this.router.url.split('/');
    await this.onClickAdminMenu(url[url.length - 1]);
    this.ns.resetNavigatToAdmin();
    
    let obj = sessionStorage.getItem(this._authenticateObj);
    let data = JSON.parse(obj);
    this.role = data.user.role.defaultRole;
    this.filtersLoaded = Promise.resolve(true);
  }

  onClickAdminMenu(menu: string) {
    this.nowMenu = menu;
  }



}
