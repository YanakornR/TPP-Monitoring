import { RegionService } from './../../../modules/main/service/region.service';
import { Component, Input, OnInit } from '@angular/core';
import { HomeService } from 'src/app/modules/main/service/home.service';
import DataTableUtils from '../../class/data-table-utils';
import { DataTablePageable } from '../../models/data-table-pageable';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/modules/main/service/session.service';
import { SiteService } from 'src/app/modules/main/service/site.service';

declare const bootstrap: any;

@Component({
  selector: 'tpp-summary-alert-province',
  templateUrl: './summary-alert-province.component.html',
  styleUrls: ['./summary-alert-province.component.css']
})
export class SummaryAlertProvinceComponent implements OnInit {
  filterOption: any = {
    region: '',
    province: [],
    status: ['comm.', 'fault', 'protect', 'alarm'],
    page: 1,
    limit: 10,
    pageTotal: 1,
    recordTotal: 0
  };
  _region: string;

  @Input('selectRegion')
  set region(region: string) {
    this._region = region;
  }

  defaultProvince: any[] = [];
  defaultStatus: string[] = ['fault', 'protect', 'alarm', 'comm.'];

  _totalProvince: number;
  _proviceInfo: any[] = [];

  @Input('provinceInfo')
  set provinceInfo(totalProvince: any[]) {
    this.defaultProvince = totalProvince;
    this._totalProvince = totalProvince.length;
    this._proviceInfo = [];
  }

  _status: string[] = [];

  dataSet: any[] = [];
  pageable: DataTablePageable = DataTableUtils.getPageable();

  provinceCheck = {
  }

  statusCheck = {
    'fault': true,
    'protect': true,
    'alarm': true,
    'comm': true
  }

  alarmCount = 0;

  filterRegion = true;
  filterStatus = true;
  filterSummaryAlertProvinceModal: any;

  constructor(private homeService: HomeService,
    private siteService: SiteService,
    private sessionService: SessionService,
    private regionService: RegionService,
    private router: Router) { }

  gotoSite(data) {
    this.siteService.setData(data);
    this.sessionService.archiveOneSiteId(data);
    this.router.navigate(['/region/' + data.region.toLocaleLowerCase() + "/" + data.province.toLocaleLowerCase() + "/" + data.site.toLocaleLowerCase()]);
  }

  async ngOnInit() {
    this._status = JSON.parse(JSON.stringify(this.defaultStatus));
    await this.getRegionInfo();
  }

  async ngAfterViewInit() {
    this.filterSummaryAlertProvinceModal = new bootstrap.Modal(document.getElementById('filterSummaryAlertProvinceModal'));
  }

  async getRegionInfo() {
    this.regionService.getRegion(this._region).subscribe(
      async (data: any) => {
        this.filterOption.region = data.regionName.toLowerCase();
        await this.getSummaryAlertProvince();
      },
      (err: any) => {
        console.log(err);
      });
  }

  async getSummaryAlertProvince() {
    const response: any = await this.homeService.getSummaryAlertProvince(this.filterOption);
    this.dataSet = response.data;
    this.filterOption.page = response.pageIndex;
    this.filterOption.pageTotal = response.pageTotal;
    this.filterOption.recordTotal = response.recordTotal;
  }

  async openFilterModal() {
    this.filterSummaryAlertProvinceModal.show();
  }

  async selectProvinceFilter(event: any, province: any) {
    if (event.target.checked) {
      this.filterOption.province.push(province);
    } else {
      this.filterOption.province = this.filterOption.province.filter((row: any) => {
        return row != province;
      });
    }
    await this.getSummaryAlertProvince();
  }

  async selectAllProvinceFilter(event: any) {
    if (event.target.checked) {
      this.defaultProvince.forEach(pro => {
        this.filterOption.province.push(pro.provinceId);
      });
    } else {
      this.filterOption.province = [];
    }
    await this.getSummaryAlertProvince();
  }

  async selectStatusFilter(event: any, status: any) {
    if (event.target.checked) {
      this.filterOption.status.push(status.toLowerCase());
    } else {
      this.filterOption.status = this.filterOption.status.filter((row: any) => {
        return row != status.toLowerCase();
      });
    }
    await this.getSummaryAlertProvince();
  }

  async selectAllStatusFilter(event: any) {
    if (event.target.checked) {
      this.filterOption.status = this.defaultStatus;
    } else {
      this.filterOption.status = [];
    }
    await this.getSummaryAlertProvince();
  }

  async goPage(nextIs: any) {
    if (this.filterOption.page + nextIs > 0 && this.filterOption.page + nextIs <= this.filterOption.pageTotal) {
      this.filterOption.page += nextIs;
      await this.getSummaryAlertProvince();
    }
  }

  async clearFilter() {
    this.filterOption.region = [];
    this.filterOption.status = [];
    await this.getSummaryAlertProvince();
  }

}
