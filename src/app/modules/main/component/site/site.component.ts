import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import DataTableUtils from 'src/app/shared/class/data-table-utils';
import { DataTablePageable } from 'src/app/shared/models/data-table-pageable';
import { SessionService } from '../../service/session.service';
import { SiteService } from '../../service/site.service';
import { NotificationsService } from 'angular2-notifications';
import { AuthService } from 'src/app/auth/auth.service';
import { AppService } from '../../service/app-service.service';
import { ProvinceService } from '../../service/province.service';
import { RegionService } from '../../service/region.service';
import { NavigationService } from '../../service/navigation-service.service';

declare const bootstrap: any;

@Component({
    selector: 'app-site',
    templateUrl: './site.component.html',
    styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit {
    _provinceKey = "tpp-monitoring-province";
    _viewKey = "tpp-monitoring-view";
    _deviceKey = "tpp-monitoring-device";
    _authenticateObj: string = 'tpp-monitoring-authenticate-obj';

    filtersLoaded: Promise<boolean>;

    lat = '13.8591';
    lng = '100.5217';

    region: string;
    province: string;
    site: string;
    siteId;
    mobile: boolean;
    provinceData: any;
    provinceInfo: any;
    siteInfo: any = {};
    piInfo: any[] = [];
    displaySelect = 'icon';
    dataSet: any[] = [];
    siteList: any[] = [];
    pageable: DataTablePageable = DataTableUtils.getPageable();
    totalRecord;
    provinceId: any;
    regionId: any;
    gotoMapModal: any;
    showDetailModal: any;
    piSnModal: any;
    piSnModalDetail: any = [{
        productType: '',
        model: '',
        battery: 0
    }];
    pageModal = 1;
    regionInfoData: any;

    mySearchPiText: any;
    mySearchSiteText: any;

    start: any;
    end: any;

    constructor(private ar: ActivatedRoute, private siteService: SiteService,
        private router: Router,
        private sessionService: SessionService,
        private as: AppService,
        private notiService: NotificationsService,
        private authService: AuthService,
        private provinceService: ProvinceService,
        private activeRoute: ActivatedRoute,
        private regionService: RegionService,
        private ns: NavigationService) { }

    ngOnInit(): void {
        this.activeRoute.paramMap.subscribe((params: ParamMap) => {
            this.siteId = params.get('siteId');
            this.provinceId = params.get('provinceId');
            this.regionId = params.get('regionId');
        });

        this.gotoMapModal = new bootstrap.Modal(document.getElementById('gotoMapModal'));
        this.showDetailModal = new bootstrap.Modal(document.getElementById('showDetailModal'));

        this.as.province$.subscribe(province => (this.provinceData = province[0]));
        this.initialiseInvites();
        this.getView();
        this.ns.addSummaryNavigat('');
        this.searchData();

        if (this.siteId == null) {
            if (this.siteService.getData() == null) {
                let sessionItem = this.sessionService.getByKey(this._provinceKey);
                let data = sessionItem[this.region.toLocaleLowerCase()][this.province.toLocaleLowerCase()].site.filter(e => e.name === this.site.toLocaleLowerCase());
                if (data.length == 1) {
                    this.siteId = data[0].id;
                } else {
                    this.router.navigate['/home'];
                }
            }
        }

        if (window.innerWidth <= 1280) { // 1280px portrait
            this.mobile = true;
        } else {
            this.mobile = false;
        }

    }

    getView() {
        let item = this.sessionService.getViewByKey(this._viewKey);
        let obj = sessionStorage.getItem(this._authenticateObj);
        let data = JSON.parse(obj);
        let mode = item[data.user.id];
        if (mode != null || !Number.isNaN(mode)) {
            this.displaySelect = mode.site;
        } else {
            this.authService.setView();
        }
    }

    setView() {
        let item = this.sessionService.getViewByKey(this._viewKey);
        let obj = sessionStorage.getItem(this._authenticateObj);
        let data = JSON.parse(obj);
        let mode = item[data.user.id];
        mode.site = this.displaySelect;
        item[data.user.id] = mode;
        this.sessionService.archiveView(item);
    }

    searchPiFilter() {
        let value = this.mySearchPiText;
        this.piInfo = this.siteInfo.pi.filter(p => p.piSn.toLocaleLowerCase().includes(value));
        // this.sortData(pi);
        this.initData();
    }
    
    searchSiteFilter() {
        let value = this.mySearchSiteText;
        this.siteList = this.provinceInfo.sites.filter(s => s.siteName.toLocaleLowerCase().includes(value));
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if (window.innerWidth <= 1280) { // 1280px portrait
            this.mobile = true;
        } else {
            this.mobile = false;
        }
    }


    initialiseInvites() {
        if (this.ar.snapshot.params.region) {
            this.region = this.ar.snapshot.params.region;
        }
        if (this.ar.snapshot.params.province) {
            this.province = this.ar.snapshot.params.province;
        }
        if (this.ar.snapshot.params.site) {
            this.site = this.ar.snapshot.params.site;
        }
    }

    searchData() {
        this.regionService.getRegion(this.regionId).subscribe(
            data => {
                this.regionInfoData = data;
                this.ns.addNewRegionNavigat(this.regionInfoData);
            });
        this.provinceService.getProvince(this.provinceId).subscribe(
            data => {
                this.provinceInfo = data;
                this.ns.addNewProvinceNavigat({provinceId : this.provinceId, provinceName : this.provinceInfo.provinceName});
                this.siteList = this.provinceInfo.sites;
                this.siteService.getSite(this.siteId).subscribe(
                    data => {
                        this.siteInfo = data;
                        this.ns.addNewSiteNavigat({siteId : this.siteId, siteName : data.siteName});
                        this.piInfo = [];
                        this.siteInfo.device.forEach(e => {
                            this.piInfo.push({
                                deviceId: e.deviceId,
                                deviceName: e.deviceName,
                                deviceRoute: e.deviceType.toLowerCase(),
                                deviceType: e.deviceType,
                                favFlag: e.favFlag,
                                status: e.status,
                                totalItem: e.totalItem,
                                equipment: e.equipment
                            })
                        });
                        console.log(this.piInfo)
                        this.setMap();
                        // this.sortData(this.siteInfo.pi);
                        this.initData();
                        this.filtersLoaded = Promise.resolve(true);
                    },
                    (err) => {
                        if (err.status != 401) {
                            this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
                        }
                    });
            },
            (err) => {
                if (err.status != 401) {
                    this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
                }
            });
    }

    setMap() {
        let map = this.siteInfo.map;
        map = map.replaceAll('°', '');
        map = map.replace(/\s/g, '')
        map = map.replace('N', '');
        map = map.replace('E', '');
        map = map.split(",");
        this.lat = map[0];
        this.lng = map[1];
    }

    initData() {
        this.totalRecord = this.piInfo.length;
        this.pageable.total = Math.ceil(this.totalRecord / 10);
        this.pagingData(true);
        if (this.pageable.total == 0)
            this.pageable.total = 1
        this.storeDeviceType();
    }

    storeDeviceType() {
        let item = this.sessionService.getViewByKey(this._deviceKey);
        if(item == null) {
            item = {};
        }
        this.piInfo.forEach(e => {
            if(item[e.deviceRoute] == null)
                item[e.deviceRoute] = {};
            item[e.deviceRoute][e.deviceId] = {
                name: e.deviceName
            };
        });
        console.log('item => ' + JSON.stringify(item));
        this.sessionService.archiveDevice(item);
    }

    // sortData(data) {
    //     let starList = data.filter(p => p.favFlag === 'Y');
    //     let sortStarList = this.sortType(starList);
    //     let normalList = data.filter(p => p.favFlag === 'N');
    //     let sortNormalList = this.sortType(normalList);
    //     this.piInfo = sortStarList.concat(sortNormalList);
    // }

    sortType(data): any {
        let alert = data.filter(p => p.status === 'A');
        let discharge = data.filter(p => p.status === 'D');
        let backup = data.filter(p => p.status === 'B');
        let inactive = data.filter(p => p.status === 'I');
        let normal = data.filter(p => p.status === 'N');
        let list = alert.concat(discharge, backup, normal, inactive);
        return list;
    }

    display(type) {
        this.displaySelect = type;
        this.setView();
    }

    onClick(id, flag) {
        let fav;
        if (flag === 'Y')
            fav = 'N';
        else
            fav = 'Y';
        this.siteService.updateFavPi(id, fav).subscribe(
            data => {
                this.refresh(true);
            },
            (err) => {

            });
    }


    refresh(val: boolean) {
        if (val) {
            this.searchData();
        }
    }

    selectPage(page: number) {
        let selectPage = this.pageable.pageIndex;
        if ((this.pageable.pageIndex + page > 0) && (this.pageable.pageIndex + page <= this.pageable.total)) {
            selectPage = selectPage + page;
            this.pageable.pageIndex = selectPage;
            this.pagingData();
        }
    }

    pagingData(status: boolean = false) {
        let start;
        let end;
        if (status == true) {
            this.pageable.pageIndex = 1;
            start = 0;
            end = 10;
        } else {
            start = 10 * this.pageable.pageIndex - 10;
            end = 10 * this.pageable.pageIndex;
            if (end > this.totalRecord) {
                end = this.totalRecord;
            }
        }
        this.start = end == 0 ? 0 : start + 1;
        this.end = end > this.totalRecord ? this.totalRecord : end;
        this.dataSet = this.piInfo.slice(start, end);
    }

    gotoSite(site: any) {
        let id = site.siteId;
        let route = '/region/' + this.regionId + "/" + this.provinceId + "/" + id;
        this.siteService.setId(id);
        this.router.navigate([route]);
    }

    gotoGoogleMaps() {
        this.gotoMapModal.show();
    }

    openDetailModal(data: any) {
        console.log(data)
        this.piSnModal = data.deviceName;
        this.piSnModalDetail = [];
        data.equipment.forEach(e => {
            let detail = {
                productType: data.deviceType,
                model: e.name,
                battery: e.quantity
            }
            this.piSnModalDetail.push(detail);
        });
        this.pageModal = 1;
        this.showDetailModal.show();
    }

    nextPageModal() {
        if (this.pageModal != 3)
            this.pageModal += 1;
    }

    backPageModal() {
        if (this.pageModal != 1)
            this.pageModal -= 1;
    }
}
