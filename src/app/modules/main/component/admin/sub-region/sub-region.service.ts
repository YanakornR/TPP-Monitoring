import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SubRegionService {

  constructor(private http: HttpClient) { }

  getSubRegionList(filterOption: any = { page: 1, limit: 10 }) {
    let url = environment.baseUrl + '/management/subregion?page=' + filterOption.page + '&limit=' + filterOption.limit;
    return this.http.get<any>(url).toPromise();
  }

  getRegionList() {
    return this.http.get<any>(environment.baseUrl + '/management/region').toPromise();
  }

  getProvince(regionId: any) {
    if (!regionId) {
      regionId = 'all';
    }
    return this.http.get<any>(environment.baseUrl + '/management/province?regionId=' + regionId).toPromise();
  }

  insertSubRegion(data: any) {
    const formData: any = new FormData();
    for (var key in data) {
      if(key != 'province'){
        formData.append(key, data[key]);
      }
    }
    for(let province of data.province){
      formData.append('provinceId', province.provinceId);
    }
    return this.http.post<any>(environment.baseUrl + '/management/subregion/insert', formData).toPromise();
  }

  updateSubRegion(data: any) {
    const formData: any = new FormData();
    for (var key in data) {
      if(key != 'province'){
        formData.append(key, data[key]);
      }
    }
    for(let province of data.province){
      formData.append('provinceId', province.provinceId);
    }
    return this.http.post<any>(environment.baseUrl + '/management/subregion/update', formData).toPromise();
  }

  deleteSubRegion(subRegionId: number) {
    const formData: any = new FormData();
    formData.append('subRegionId', subRegionId);
    return this.http.request('delete', environment.baseUrl + '/management/subregion/delete', { body: formData }).toPromise();
  }
}
