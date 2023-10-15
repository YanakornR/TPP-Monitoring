import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  rawData = [];
  provinceList = [];

  siteList = [];

  private list = new BehaviorSubject<string[]>([]);
  readonly list$ = this.list.asObservable();
  private province = new BehaviorSubject<string[]>([]);
  readonly province$ = this.province.asObservable();
  private site = new BehaviorSubject<string[]>([]);
  readonly site$ = this.site.asObservable();

  constructor() { }

  addNewList(list) {
    this.rawData = [];
    this.rawData.push(list);
    this.list.next(this.rawData);
  }

  addNewProvinceList(province) {
    this.provinceList = [];
    this.provinceList.push(province);
    this.province.next(this.provinceList);
  }

  addNewSiteList(site) {
    this.siteList = [];
    this.siteList.push(site);
    this.site.next(this.siteList);
  }

  removeList(list) {
    this.rawData = this.rawData.filter(v => v !== list);
    this.list.next(this.rawData);
  }
}
