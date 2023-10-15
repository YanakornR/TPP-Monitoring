import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {
  private _provinceUrl: string = environment.baseUrl + '/info/province/';
  private _favSiteUrl: string = environment.baseUrl + '/fav/site';

  constructor(private http: HttpClient) { }

  getProvince(provinceId) {
    return this.http.get<any>(this._provinceUrl + provinceId);
  }

  updateFavSite(siteId, favFlag) {
    return this.http.put<any>(this._favSiteUrl + "?" + "id=" + siteId + "&" + "flag=" + favFlag , null);
  }
}
