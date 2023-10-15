import { ReportService } from './../../service/report.service';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import * as moment from 'moment';
import { NavigationService } from '../../service/navigation-service.service';

declare const bootstrap: any;

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  filterOption: any = {
    page: 1,
    limit: 10,
    pageTotal: 1,
    recordTotal: 0,
    regionId: '',
    provinceId: '',
    siteId: '',
    piId: '',
    batteryId: '',
    startDate: moment().add(-3, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    filterSearch: '',
  };

  regionList: any;
  piList: any;
  provinceList: any;
  batteryList: any;
  siteList: any;
  filterReportModal: any;
  loadingModal: any;
  reportList: any = [];
  constructor(
    private reportService: ReportService,
    private notiService: NotificationsService,
    private ns: NavigationService
  ) {
  }

  ngOnInit(): void {
    this.ns.resetNavigatToReport();
    this.searchData();
  }

  async ngAfterViewInit() {
    this.filterReportModal = new bootstrap.Modal(document.getElementById('filterReportModal'));
    this.loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
  }

  searchData() {
    this.reportService.getReport(this.filterOption).subscribe(
      (data) => {
            console.log("Data report: ", data)
        this.reportList = data.report;
        this.filterOption.recordTotal = data.totalRecord;
        this.filterOption.pageTotal = Math.ceil(data.totalRecord / this.filterOption.limit);
      },
      (err) => {
        if (err.status != 401) {
          this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
        }
      });
  }

  async goPage(nextIs: any) {
    if (this.filterOption.page + nextIs > 0 && this.filterOption.page + nextIs <= this.filterOption.pageTotal) {
      this.filterOption.page += nextIs;
      await this.searchData();
    }
  }

  exportReportList() {
    this.loadingModal.show();
    const data: any = this.reportService.downloadReport(this.filterOption).then((result: any) => {
      let blob: any = new Blob([result], { type: result.type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      link.setAttribute('href', url);
      link.setAttribute('download', `report-list-${this.filterOption.startDate}-to-${this.filterOption.endDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => {
        this.loadingModal.hide();
      }, 500);
    }).catch((err) => {
      console.log('err :', err);
      setTimeout(() => {
        this.loadingModal.hide();
      }, 500);
    });
  }


  async openFilterReportModal() {
    this.regionList = await this.reportService.getReportRegion();
    this.filterReportModal.show();
  }

  async onSelectRegion() {
    const regionInfo = await this.reportService.getReportProvince(this.filterOption.regionId);
    this.provinceList = regionInfo.province;
  }

  async onSelectProvince() {
    const provinceInfo: any = await this.reportService.getReportSite(this.filterOption.provinceId);
    this.siteList = provinceInfo.sites;
  }

  async onSelectSite() {
    const siteInfo: any = await this.reportService.getReportPi(this.filterOption.siteId);
    this.piList = siteInfo.pi;
  }

  async onSelectPi() {
    const piInfo: any = await this.reportService.getReportBattery(this.filterOption.piId);
    this.batteryList = piInfo.battery;
  }

  async resetFilterReport() {
    this.filterOption = {
      page: 1,
      limit: 10,
      pageTotal: 1,
      recordTotal: 0,
      regionId: '',
      provinceId: '',
      siteId: '',
      piId: '',
      batteryId: '',
      startDate: moment().add(-3, 'days').format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      filterSearch: '',
    };
    await this.searchData();
  }
}
