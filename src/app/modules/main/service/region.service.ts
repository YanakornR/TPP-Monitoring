import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegionService {
  private _regionUrl: string = environment.baseUrl + '/info/region/';
  private _favProvinceUrl: string = environment.baseUrl + '/fav/province';

  constructor(private http: HttpClient) { }

  getRegion(regionId) {
    return this.http.get<any>(this._regionUrl + regionId);
  }

  getSubRegion(regionId) {
    return this.http.get<any>(this._regionUrl + regionId + '/sub');
  }

  updateFavProvince(provinceId, favFlag) {
    let httpParams = new URLSearchParams();
    httpParams.append('id', provinceId);
    httpParams.append('flag', favFlag);
    return this.http.put<any>(this._favProvinceUrl  + "?" + httpParams, null);
  }
}
