import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NmModuleListService {

  constructor(private http: HttpClient) { }

  getModuleList(filterOption: any = { region: [], page: 1, limit: 10 }, nmSearch: string) {
    let url = environment.baseUrl + '/management/module?page=' + filterOption.page + '&limit=' + filterOption.limit;
    for(let region of filterOption.region){
      url += '&region=' + region;
    }
    if(nmSearch != '')
      url += '&search=' + nmSearch;
    return this.http.get<any>(url).toPromise();
  }

  getModule(logNo: number) {
    return this.http.get<any>(environment.baseUrl + '/management/3rdparty/info?logNo=' + logNo).toPromise();
  }

  getModuleRec(logNo: number) {
    return this.http.get<any>(environment.baseUrl + '/management/rectifier/info?id=' + logNo).toPromise();
  }
  
  getModuleNM(logNo: number) {
    return this.http.get<any>(environment.baseUrl + '/management/nmmodule/info?id=' + logNo).toPromise();
  }

  getRoleList(companyId: any) {
    return this.http.get<any>(environment.baseUrl + '/management/role/menu?companyId=' + companyId).toPromise();
  }

  getCompanyList() {
    return this.http.get<any>(environment.baseUrl + '/management/company').toPromise();
  }

  getSiteList() {
    let url = environment.baseUrl + '/management/site?page=1&limit=100';
    return this.http.get<any>(url).toPromise();
  }

  getRegionList() {
    return this.http.get<any>(environment.baseUrl + '/management/region').toPromise();
  }

  insertModule(data: any) {
    return this.http.post<any>(environment.baseUrl + '/management/3rdparty/insert', data).toPromise();
  }

  updateModule(data: any) {
    return this.http.post<any>(environment.baseUrl + '/management/3rdparty/info/update', data).toPromise();
  }
  
  insertRecModule(data: any) {
    return this.http.post<any>(environment.baseUrl + '/management/rectifier/insert', data).toPromise();
  }

  updateRecModule(data: any) {
    return this.http.post<any>(environment.baseUrl + '/management/rectifier/info/update', data).toPromise();
  }

  updateNMModule(data: any) {
    return this.http.post<any>(environment.baseUrl + '/management/nmmodule/info/update', data).toPromise();
  }

  deleteModule(moduleId: number) {
    const formData: any = new FormData();
    formData.append('moduleId', moduleId);
    return this.http.request('delete', environment.baseUrl + '/management/module/delete', { body: formData }).toPromise();
  }

  deleteModuleNew(req: []) {
    const formData: any = new FormData();
    formData.append('module', req);
    return this.http.request('delete', environment.baseUrl + '/management/module/delete', { body: formData }).toPromise();
  }

  exportModule(): any {
    return this.http.get(environment.baseUrl + '/management/module/export', { responseType: 'blob' }).toPromise();
  }
}
