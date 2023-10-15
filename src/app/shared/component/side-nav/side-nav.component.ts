import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { HomeService } from 'src/app/modules/main/service/home.service';
import { NotificationsService } from 'angular2-notifications';
import { SessionService } from 'src/app/modules/main/service/session.service';
import { NavigationService } from '../../../modules/main/service/navigation-service.service';

@Component({
  selector: 'tpp-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  _regionKey = "tpp-monitoring-region-info";
  private _authenticateObj: string = 'tpp-monitoring-authenticate-obj';

  useHomeSrc;
  useEarthSrc = "assets/img/earth-logo.svg";
  useReportSrc;
  useContactSrc;
  homeSrc = "assets/img/home-logo.svg";
  homeMobileSrc = "assets/img/home-mobile-logo.svg";
  reportSrc = "assets/img/report-logo.svg";
  reportMobileSrc = "assets/img/report-mobile-logo.svg";
  contactSrc = "assets/img/contact-logo.svg";
  contactMobileSrc = "assets/img/contact-mobile-logo.svg";

  profileName: string;
  profileRole: string;
  profileRoleName: string;
  labelProfileRole: string;
  profileAvatar:any;
  profileImg: string;
  mobile: boolean;
  arrow: boolean = false;
  profileFullname:string;
  provinceNavigat: any;
  regionNavigat: any;
  siteNavigat: any;
  titleNavigat: any;
  summaryNavigat: any;
  accessPage: any = {
    "report": false,
    "admin": false,
    "northern": false,
    "central": false,
    "western": false,
    "northeastern": false,
    "eastern": false,
    "southern": false
  };

  active = {
    northern: { status: ''},
    central: { status: ''},
    western: { status: ''},
    northeastern: { status: ''},
    southern: { status: ''},
    eastern: { status: ''}
  };

  constructor(private authService: AuthService,
    private sessionService: SessionService,
    private homeService: HomeService,
    private notiService: NotificationsService,
    private ns: NavigationService) { }

  ngOnInit(): void {
    this.getNavigation();
    this.setUser();
    this.getAllInfo();
    if (window.innerWidth <= 992) { // 1280px portrait
      this.mobile = true;
      this.useHomeSrc = this.homeMobileSrc;
      this.useReportSrc = this.reportMobileSrc;
      this.useContactSrc = this.contactMobileSrc;
    } else {
      this.mobile = false;
      this.useHomeSrc = this.homeSrc;
      this.useReportSrc = this.reportSrc;
      this.useContactSrc = this.contactSrc;
    }
  }

  getAllInfo() {
    this.homeService.getAllInfo().pipe().subscribe(
      data => {
        this.sessionService.archiveRegionId(data);
        this.active = this.sessionService.getByKey(this._regionKey);
      },
      (err) => {
        if (err.status != 401) {
          this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
        }
      });
  }

  getNavigation(){
    this.ns.province$.subscribe(province => (this.provinceNavigat = province[0]));
    this.ns.region$.subscribe(region => (this.regionNavigat = region[0]));
    this.ns.site$.subscribe(site => (this.siteNavigat = site[0]));
    this.ns.title$.subscribe(title => (this.titleNavigat = title[0]));
    this.ns.summary$.subscribe(summary => (this.summaryNavigat = summary[0]));
  }

  setUser() {
    let obj = sessionStorage.getItem(this._authenticateObj);
    let data = JSON.parse(obj);
    let name = data.user.fullname.split(/(\s+)/);
    this.accessPage = data.user.role.accessPage;
    this.profileFullname = data.user.fullname;
    this.labelProfileRole = data.user.role.defaultRole;
    this.profileRole = data.user.role.defaultRoleName; 
    this.profileRoleName = data.user.role.name; // เลือกระหว่างชื่อ name หรือ defaultRoleName
    this.profileName = this.transformFullname(name);
    this.profileImg = data.user.avatar;
  }

  setProfileImg() {
    let obj = sessionStorage.getItem(this._authenticateObj);
    let data = JSON.parse(obj);
    this.profileImg = data.user.avatar;
  }

  transformFullname(name): string {
    let fullname: string = '';
    name.forEach((value, index) => {
      if (index === 0) {
        fullname += value.substr(0, 1).toUpperCase() + value.substr(1);
      }
      if (index === 2) {
        fullname += ' ' + value.substr(0, 1).toUpperCase();
      }
    });
    return fullname;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth <= 992) {
      this.mobile = true;
      this.useHomeSrc = this.homeMobileSrc;
      this.useReportSrc = this.reportMobileSrc;
      this.useContactSrc = this.contactMobileSrc;
    } else {
      this.mobile = false;
      this.useHomeSrc = this.homeSrc;
      this.useReportSrc = this.reportSrc;
      this.useContactSrc = this.contactSrc;
    }
  }

  arrowToggle() {
    this.arrow = !this.arrow;
  }

  logout() {
    this.authService.logout();
  }

  setTitel(title: string){
    this.ns.addNewTitleNavigat(title);
  }

  sendRegionNav(region: any) {
    this.ns.addNewRegionNavigat(region);
  }

}
