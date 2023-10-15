import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProvinceService } from 'src/app/modules/main/service/province.service';
import { SiteService } from 'src/app/modules/main/service/site.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'tpp-site-card',
  templateUrl: './site-card.component.html',
  styleUrls: ['./site-card.component.css']
})
export class SiteCardComponent implements OnInit {

  _siteId: String;
  _siteName: String;
  _siteNamePath: String;
  _status: String;
  _favFlag: String;

  _region: String;
  _province: String;

  @Input('siteId')
  set siteId(siteId: String) {
    this._siteId = siteId;
  }
  @Input('siteName')
  set siteName(siteName: String) {
    this._siteName = siteName.toUpperCase();
    this._siteNamePath = siteName.toLocaleLowerCase();
  }
  @Input('status')
  set status(status: String) {
    this._status = status;
  }
  @Input('favFlag')
  set favFlag(favFlag: String) {
    this._favFlag = favFlag;
  }

  imageSrc: string;
  imageTrueSrc: string = "assets/img/fav-true.png";
  imageFalseSrc: string = "assets/img/fav-false.png";

  @Output() getStatusChange = new EventEmitter<boolean>();

  constructor(private ar: ActivatedRoute, 
    private provinceService: ProvinceService, 
    private siteService: SiteService,
    private router: Router,
    private notiService: NotificationsService) { }

  ngOnInit(): void {
    this.changeImg();
    if (this.ar.snapshot.params.region) {
      this._region = this.ar.snapshot.params.region;
    }
    if (this.ar.snapshot.params.province) {
      this._province = this.ar.snapshot.params.province;
    }
  }

  onClick(_id) {
    if (this._favFlag == 'Y') {
      this._favFlag = 'N';
    } else {
      this._favFlag = 'Y';
    }
    this.provinceService.updateFavSite(_id, this._favFlag).subscribe(
      data => {
        this.getStatusChange.emit(true);
      },
      (err) => {
        if (err.status != 401) {
          this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
        }
      });
  }


  changeImg() {
    if (this._favFlag == 'Y') {
      this.imageSrc = this.imageTrueSrc;
    } else {
      this.imageSrc = this.imageFalseSrc;
    }
  }  

  gotoSite(){
    let route = '/region/' + this._region + "/" + this._province + "/" + this._siteNamePath.toLocaleLowerCase();
    this.siteService.setId(this._siteId);
    this.router.navigate([route]);
  }
}
