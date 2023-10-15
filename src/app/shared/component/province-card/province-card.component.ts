import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegionService } from 'src/app/modules/main/service/region.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'tpp-province-card',
  templateUrl: './province-card.component.html',
  styleUrls: ['./province-card.component.css']
})
export class ProvinceCardComponent implements OnInit {
  _provinceName: string;
  _provinceNamePath: string;
  _provinceId: string;
  _totalSite: string;
  _totalBattery: string;
  _status: string;
  _favFlag: string;
  _region: string;

  @Input('provinceName')
  set provinceName(provinceName: string) {
    this._provinceName = provinceName;
    this._provinceNamePath = provinceName.toLocaleLowerCase().replace(/\s/g, "");
  }
  @Input('provinceId')
  set provinceId(provinceId: string) {
    this._provinceId = provinceId;
  } i
  @Input('totalSite')
  set totalSite(totalSite: string) {
    this._totalSite = totalSite;
  }
  @Input('totalBattery')
  set totalBattery(totalBattery: string) {
    this._totalBattery = totalBattery;
  }
  @Input('status')
  set status(status: string) {
    this._status = status;
  }
  @Input('favFlag')
  set favFlag(favFlag: string) {
    this._favFlag = favFlag;
  }

  @Output() getStatusChange = new EventEmitter<boolean>();


  imageSrc: string;
  imageTrueSrc: string = "assets/img/fav-true.png";
  imageFalseSrc: string = "assets/img/fav-false.png";

  constructor(private ar: ActivatedRoute, private regionService: RegionService,
    private notiService: NotificationsService) { }

  ngOnInit(): void {
    this.changeImg();
    if (this.ar.snapshot.params.region) {
      this._region = this.ar.snapshot.params.region;
    }
  }

  onClick(_id) {
    if (this._favFlag == 'Y') {
      this._favFlag = 'N';
    } else {
      this._favFlag = 'Y';
    }
    this.regionService.updateFavProvince(_id, this._favFlag).subscribe(
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
