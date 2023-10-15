import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import DataTableUtils from 'src/app/shared/class/data-table-utils';
import { DataTablePageable } from 'src/app/shared/models/data-table-pageable';
import { ProvinceService } from '../../service/province.service';
import { SessionService } from '../../service/session.service';
import { SiteService } from '../../service/site.service';
import { NotificationsService } from 'angular2-notifications';
import { AuthService } from 'src/app/auth/auth.service';
import { AppService } from '../../service/app-service.service';
import { NavigationService } from '../../service/navigation-service.service';
import { RegionService } from '../../service/region.service';
import { th_TH } from 'ng-zorro-antd';

@Component({
    selector: 'app-province',
    templateUrl: './province.component.html',
    styleUrls: ['./province.component.css']
})
export class ProvinceComponent implements OnInit {

    _regionKey = "tpp-monitoring-region-info";
    _provinceKey = "tpp-monitoring-province";
    _viewKey = "tpp-monitoring-view";
    _authenticateObj: string = 'tpp-monitoring-authenticate-obj';

    filtersLoaded: Promise<boolean>;

    regionId;
    regionStatus;
    provinceId;
    provinceStatus;

    region: string;
    province: string;
    displaySelect: string = 'icon';
    provinceData: any;
    provinceInfo;
    siteInfoDefault;
    totalSite: any;
    siteInfo;
    regionInfoData: any;
    start: any;
    end: any;
    dataSet: any[] = [];
    pageable: DataTablePageable = DataTableUtils.getPageable();

    totalRecord;
    mySearchText: string = '';
    mySearchSiteFavText: string = '';
    siteFavList: any[] = [];

    mobile: boolean;

    constructor(private ar: ActivatedRoute,
        private router: Router,
        private provinceService: ProvinceService,
        private sessionService: SessionService,
        private siteService: SiteService,
        private notiService: NotificationsService,
        private authService: AuthService,
        private as: AppService,
        private ns: NavigationService,
        private activeRoute: ActivatedRoute,
        private regionService: RegionService) { }

    async ngOnInit() {
        this.activeRoute.paramMap.subscribe((params: ParamMap) => {
            this.provinceId = params.get('provinceId');
            this.regionId = params.get('regionId');
        });
        console.log(this.provinceId)
        console.log(this.as.province$)
        this.ns.addNewSiteNavigat('');
        this.as.province$.subscribe(province => (this.provinceData = province[0]));
        if (this.provinceData) {
            await localStorage.setItem('province', JSON.stringify(this.provinceData));
        } else {
            const province: any = await localStorage.getItem('province');
            this.provinceData = JSON.parse(province);
        }
        console.log(this.provinceData)
        this.initialiseInvites();
        this.getView();
        this.checkAvaliableProvince();
        this.searchData();

        if (window.innerWidth > 576) { // 768px portrait
            this.mobile = true;
        } else {
            this.mobile = false;
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if (window.innerWidth > 576) { // 768px portrait
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
        this.provinceService.updateFavSite(id, fav).subscribe(
            data => {
                this.refresh(true);
            },
            (err) => {
                if (err.status != 401) {
                    this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
                }
            });
    }

    refresh(val: boolean) {
        if (val) {
            this.searchData();
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
                this.siteInfoDefault = this.provinceInfo.sites;
                this.siteFavList = this.provinceInfo.sites;
                this.totalSite = this.siteInfoDefault.length;
                this.sessionService.archiveSiteId(this.provinceInfo, this.region);
                this.ns.addNewProvinceNavigat({provinceId : this.provinceId, provinceName : this.provinceInfo.provinceName});
                this.sortData(this.siteInfoDefault);
                this.initData();
                this.filtersLoaded = Promise.resolve(true);
            },
            (err) => {
                if (err.status != 401) {
                    this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
                }
            });
    }

    initData() {
        this.totalRecord = this.siteInfo.length;
        this.pageable.total = Math.ceil(this.totalRecord / 10);
        this.pagingData(true);
        if (this.pageable.total == 0)
            this.pageable.total = 1
    }

    getView() {
        let item = this.sessionService.getViewByKey(this._viewKey);
        let obj = sessionStorage.getItem(this._authenticateObj);
        let data = JSON.parse(obj);
        let mode = item[data.user.id];
        if (mode != null || !Number.isNaN(mode)) {
            this.displaySelect = mode.province;
        } else {
            this.authService.setView();
        }
    }

    setView() {
        let item = this.sessionService.getViewByKey(this._viewKey);
        let obj = sessionStorage.getItem(this._authenticateObj);
        let data = JSON.parse(obj);
        let mode = item[data.user.id];
        mode.province = this.displaySelect;
        item[data.user.id] = mode;
        this.sessionService.archiveView(item);
    }

    sortData(data) {
        let starList = data.filter(p => p.favFalg === 'Y');
        let starAlert = starList.filter(p => p.status === 'W');
        let starActive = starList.filter(p => p.status === 'A');
        let normalList = data.filter(p => p.favFalg === 'N');
        let normalAlert = normalList.filter(p => p.status === 'W');
        let normalActive = normalList.filter(p => p.status === 'A');
        this.siteInfo = starAlert.concat(starActive, normalAlert, normalActive);
    }

    searchFilter() {
        let value = this.mySearchText.toLocaleLowerCase();
        this.siteInfo = this.siteInfoDefault.filter(p => p.siteName.toLocaleLowerCase().includes(value));
        this.sortData(this.siteInfo);
        this.initData();
    }

    searchSiteFavFilter() {
        let value = this.mySearchSiteFavText.toLocaleLowerCase();
        this.siteFavList = this.provinceInfo.sites.filter(s => s.siteName.toLocaleLowerCase().includes(value));
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
        this.dataSet = this.siteInfo.slice(start, end);
    }

    checkAvaliableRegion() {
        let regionInfo = this.sessionService.getByKey(this._regionKey);
        if (!regionInfo.hasOwnProperty(this.region)) {
            this.router.navigate(['/home']);
        } else {
            this.regionId = regionInfo[this.region].id;
            this.regionStatus = regionInfo[this.region].status;
            if (this.regionStatus === 'I') {
                this.router.navigate(['/home']);
            }
        }
    }

    checkAvaliableProvince() {
        this.provinceId = this.provinceData.provinceId;
        this.provinceStatus = this.provinceData.status;
        if (this.provinceStatus === 'I') {
            this.notiService.error('เกิดข้อผิดพลาด', 'Province : ' + this.provinceData.provinceName + ', Status : Inactive');
            let route = '/region/' + this.regionId;
            this.router.navigate([route]);
        }
    } 

    gotoSite(site: any) {
        let id = site.siteId;
        let route = '/region/' + this.regionId + "/" + this.provinceId + "/" + id;
        this.siteService.setId(id);
        this.router.navigate([route]);
    }

    sendSiteNav(siteInfo: any) {
        // this.provinceSend = this.regionInfoData.province[index];
        this.ns.addNewSiteNavigat(siteInfo);
        this.initSite(siteInfo);
    }

    initSite(siteInfo: any) {
        this.as.addNewSiteList(siteInfo);
    }
}
