import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  rawData = [];
  provinceNavigat = [];
  regionNavigat = [];
  siteNavigat = [];
  titleNavigat = [];
  summaryNavigat = [];

  private list = new BehaviorSubject<string[]>([]);
  readonly list$ = this.list.asObservable();
  private province = new BehaviorSubject<string[]>([]);
  readonly province$ = this.province.asObservable();
  private region = new BehaviorSubject<string[]>([]);
  readonly region$ = this.region.asObservable();
  private site = new BehaviorSubject<string[]>([]);
  readonly site$ = this.site.asObservable();
  private summary = new BehaviorSubject<string[]>([]);
  readonly summary$ = this.summary.asObservable();
  private title = new BehaviorSubject<string[]>([]);
  readonly title$ = this.title.asObservable();

  constructor() { }

  addNewList(list) {
    this.rawData = [];
    this.rawData.push(list);
    this.list.next(this.rawData);
  }

  addNewProvinceNavigat(province) {
    this.provinceNavigat = [];
    this.provinceNavigat.push(province);
    this.province.next(this.provinceNavigat);
  }

  addNewRegionNavigat(region) {
    this.regionNavigat = [];
    this.regionNavigat.push(region);
    this.region.next(this.regionNavigat);
  }

  addNewSiteNavigat(site) {
    this.siteNavigat = [];
    this.siteNavigat.push(site);
    this.site.next(this.siteNavigat);
  }

  addNewTitleNavigat(title) {
    this.titleNavigat = [];
    this.titleNavigat.push(title);
    this.title.next(this.titleNavigat);
  }

  addSummaryNavigat(summary) {
    this.summaryNavigat = [];
    this.summaryNavigat.push(summary);
    this.summary.next(this.summaryNavigat);
  }

  resetNavigatToAdmin() {
    this.addNewRegionNavigat('');
    this.addNewProvinceNavigat('');
    this.addNewSiteNavigat('');
    this.addSummaryNavigat('');
    this.addNewTitleNavigat('Admin');
  }
  
  resetNavigatToHome() {
    this.addNewRegionNavigat('');
    this.addNewProvinceNavigat('');
    this.addNewSiteNavigat('');
    this.addSummaryNavigat('');
    this.addNewTitleNavigat('Home');
  }

  resetNavigatToProfile() {
    this.addNewRegionNavigat('');
    this.addNewProvinceNavigat('');
    this.addNewSiteNavigat('');
    this.addSummaryNavigat('');
    this.addNewTitleNavigat('Profile');
  }
  

  resetNavigatToReport() {
    this.addNewRegionNavigat('');
    this.addNewProvinceNavigat('');
    this.addNewSiteNavigat('');
    this.addSummaryNavigat('');
    this.addNewTitleNavigat('Report');
  }

  resetNavigatToSupport() {
    this.addNewRegionNavigat('');
    this.addNewProvinceNavigat('');
    this.addNewSiteNavigat('');
    this.addSummaryNavigat('');
    this.addNewTitleNavigat('Support');
  }

  removeList(list) {
    this.rawData = this.rawData.filter(v => v !== list);
    this.list.next(this.rawData);
  }
}
