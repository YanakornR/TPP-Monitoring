import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { DataTablePageable } from 'src/app/shared/models/data-table-pageable';
import DataTableUtils from 'src/app/shared/class/data-table-utils';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private _reportUrl: string = environment.baseUrl + '/report';
  private _reportRegionUrl: string = environment.baseUrl + '/management/region';
  private _reportProvinceUrl: string = environment.baseUrl + '/info/region';
  private _reportSiteUrl: string = environment.baseUrl + '/info/province';
  private _reportPiUrl: string = environment.baseUrl + '/info/site';
  private _reportBatteryUrl: string = environment.baseUrl + '/info/pi';
  private _downloadReportUrl: string = environment.baseUrl + '/report/download';
  constructor(private http: HttpClient) { }

  getReport(option: any = { limit: 10, page: 1 }): Observable<any> {
    let url = this._reportUrl + '?limit=' + option.limit + '&page=' + option.page,
      startDate: any = (option.startDate) ? moment(option.startDate).format('YYYY-MM-DD') : moment().add(-3, 'days').format('YYYY-MM-DD'),
      endDate: any = (option.endDate) ? moment(option.endDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
    url += '&startDate=' + startDate;
    url += '&endDate=' + endDate;

    if (option.regionId) {
      url += '&regionId=' + option.regionId;
    }
    if (option.provinceId) {
      url += '&provinceId=' + option.provinceId;
    }
    if (option.siteId) {
      url += '&siteId=' + option.siteId;
    }
    if (option.piId) {
      url += '&piId=' + option.piId;
    }
    if (option.batteryId) {
      url += '&batteryId=' + option.batteryId;
    }
    if (option.filterSearch) {
      url += '&filterSearch=' + option.filterSearch;
    }
    return this.http.get<any>(url);
  }

  getReportRegion() {
    return this.http.get<any>(this._reportRegionUrl).toPromise();
  }

  getReportProvince(regionId: any) {
    return this.http.get<any>(this._reportProvinceUrl + "/" + regionId).toPromise();
  }

  getReportSite(provinceId: any) {
    return this.http.get<any>(this._reportSiteUrl + "/" + provinceId).toPromise();
  }

  getReportPi(siteId: any) {
    return this.http.get<any>(this._reportPiUrl + "/" + siteId).toPromise();
  }

  getReportBattery(piId: any) {
    return this.http.get<any>(this._reportBatteryUrl + "/" + piId + "/status").toPromise();
  }

  downloadReport(option: any) {
    let url = this._downloadReportUrl,
      startDate: any = (option.startDate) ? moment(option.startDate).format('YYYY-MM-DDTHH:mm') : moment().add(-3, 'days').format('YYYY-MM-DDTHH:mm'),
      endDate: any = (option.endDate) ? moment(option.endDate).format('YYYY-MM-DDTHH:mm') : moment().format('YYYY-MM-DDTHH:mm');
    url += '?startDate=' + startDate;
    url += '&endDate=' + endDate;

    if (option.regionId) {
      url += '&regionId=' + option.regionId;
    }
    if (option.provinceId) {
      url += '&provinceId=' + option.provinceId;
    }
    if (option.siteId) {
      url += '&siteId=' + option.siteId;
    }
    if (option.piId) {
      url += '&piId=' + option.piId;
    }
    if (option.batteryId) {
      url += '&batteryId=' + option.batteryId;
    }
    return this.http.get(url, { responseType: 'blob' }).toPromise();
  }
}
