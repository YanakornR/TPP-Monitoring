import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  private _siteUrl: string = environment.baseUrl + '/info/site/';
  private _favPiUrl: string = environment.baseUrl + '/fav/pi';

  constructor(private http: HttpClient) { }

  _id: string;

  getId(): any {
    return this._id;
  }

  setId(value: any) {
    this._id = value;
  }

  _data;

  setData(data) {
    this._data = data
  }

  getData() {
    return this._data;
  }

  getSite(id) {
    return this.http.get<any>(this._siteUrl + id);
  }

  updateFavPi(id, favFlag) {
    let httpParams = new URLSearchParams();
    httpParams.append('id', id);
    httpParams.append('flag', favFlag);
    return this.http.put<any>(this._favPiUrl + "?" + httpParams, null);
  }
}
