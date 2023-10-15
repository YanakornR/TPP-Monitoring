import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import DataTableUtils from 'src/app/shared/class/data-table-utils';
import { DataTablePageable } from 'src/app/shared/models/data-table-pageable';
import { environment } from 'src/environments/environment';
import { AllInfo } from '../models/all-info';
import { AllCompany } from '../models/all-company';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private _allInfoUrl: string = environment.baseUrl + '/info';
  private _getAllCompany: string = environment.baseUrl + '/company/all';
  private _updateCompany: string = environment.baseUrl + '/company/update';
  private _summaryAlertUrl: string = environment.baseUrl + '/alert/summary';
  private _summaryAlertProvinceUrl: string = environment.baseUrl + '/alert/summary';
  private _backupTimeUrl: string = environment.baseUrl + '/battery/summary/backup';
  private _backupTimeProvinceUrl: string = environment.baseUrl + '/battery-backup-province';

  constructor(private http: HttpClient) { }

  getAllInfo() {
    return this.http.get<AllInfo>(this._allInfoUrl);
  }

  getAllCompany() {
    return this.http.get<AllCompany>(this._getAllCompany);
  }

  getSummaryAlert(option: any = { limit: 10, page: 1, region: [], status: [] }) {
    let url: any = this._summaryAlertUrl + '?limit=' + option.limit + '&page=' + option.page;

    for (let region of option.region) {
      url += '&region=' + region;
    }

    for (let status of option.status) {
      url += '&status=' + status;
    }
    return this.http.get<any>(url).toPromise();

  }

  getBatteryBackupTime(option: any = { limit: 10, page: 1, region: [], status: [] }) {
    let url: any = this._backupTimeUrl + '?limit=' + option.limit + '&page=' + option.page;
    for (let region of option.region) {
      url += '&region=' + region;
    }
    return this.http.get<any>(url);
  }

  getSummaryAlertProvince(option: any = { limit: 10, page: 1, province: [], status: [] }) {
    let url: any = this._summaryAlertProvinceUrl + '?limit=' + option.limit + '&page=' + option.page;

    for (let province of option.province) {
      url += '&province=' + province;
    }

    for (let status of option.status) {
      url += '&status=' + status;
    }
    return this.http.get<any>(url).toPromise();
  }

  getBatteryBackupTimeProvince(region: string, option: any = { province: [] }) {
    let url: any = this._backupTimeProvinceUrl + "/" + region;
    for (let province of option.province) {
      url += '?province=' + province;
    }
    return this.http.get<any>(url);
  }

  updateCompany(companyId: any) {
    const formdata = new FormData();
    formdata.append("companyId", companyId);
    return this.http.put(this._updateCompany, formdata, { responseType: 'text' });
  }
}
