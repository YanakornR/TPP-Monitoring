import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SiteListService {

  constructor(private http: HttpClient, private notiService: NotificationsService) { }

  getSiteList(filterOption: any = { page: 1, limit: 10 }) {
    let url = environment.baseUrl + '/management/site?page=' + filterOption.page + '&limit=' + filterOption.limit;
    return this.http.get<any>(url).toPromise();
  }

  getProvince() {
    return this.http.get<any>(environment.baseUrl + '/management/province?regionId=all').toPromise();
  }

  insertSite(data: any) {
    const formData: any = new FormData();
    for (var key in data) {
      formData.append(key, data[key]);
    }
    return this.http.post<any>(environment.baseUrl + '/management/site/insert', formData).toPromise();
  }

  updateSite(data: any) {
    const formData: any = new FormData();
    for (var key in data) {
      formData.append(key, data[key]);
    }
    return this.http.post<any>(environment.baseUrl + '/management/site/update', formData).toPromise();
  }

  deleteSite(siteId: number) {
    const formData: any = new FormData();
    formData.append('siteId', siteId);
    return this.http.request('delete', environment.baseUrl + '/management/site/delete', { body: formData }).toPromise().then(d => {
      if(d['site id has been used'] != null || d['site id has been used'] != undefined) {
        this.notiService.error("This Site has been used On SiteId : " + d['site id has been used']);
      }
    });
  }
}
