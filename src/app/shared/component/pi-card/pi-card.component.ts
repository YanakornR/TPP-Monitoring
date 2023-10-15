import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from 'src/app/modules/main/service/site.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'tpp-pi-card',
  templateUrl: './pi-card.component.html',
  styleUrls: ['./pi-card.component.css']
})
export class PiCardComponent implements OnInit {

  @Output() getStatusChange = new EventEmitter<boolean>();

  _piId: String;
  _piName: String;
  _piNamePath: String;
  _status: String;
  _favFlag: String;

  _region: String;
  _province: String;
  _site: String;
  _battCount: String;

  @Input('piId')
  set piId(piId: String) {
    this._piId = piId;
  }
  @Input('piName')
  set siteName(piName: String) {
    this._piName = piName.toUpperCase();
    this._piNamePath = piName.toLocaleLowerCase();
  }
  @Input('status')
  set status(status: String) {
    this._status = status;
  }
  @Input('favFlag')
  set favFlag(favFlag: String) {
    this._favFlag = favFlag;
  }
  @Input('battCount')
  set battCount(battCount: String) {
    this._battCount = battCount;
  }


  imageSrc: string;
  imageTrueSrc: string = "assets/img/fav-true.png";
  imageFalseSrc: string = "assets/img/fav-false.png";

  constructor(private ar: ActivatedRoute,
    private siteService: SiteService,
    private notiService: NotificationsService) { }

  ngOnInit(): void {
    this.changeImg();
    if (this.ar.snapshot.params.region) {
      this._region = this.ar.snapshot.params.region;
    }
    if (this.ar.snapshot.params.province) {
      this._province = this.ar.snapshot.params.province;
    }
    if (this.ar.snapshot.params.site) {
      this._site = this.ar.snapshot.params.site;
    }
  }

  onClick(_id) {
    if (this._favFlag == 'Y') {
      this._favFlag = 'N';
    } else {
      this._favFlag = 'Y';
    }
    this.siteService.updateFavPi(_id, this._favFlag).subscribe(
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

}
