import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, NavigationEnd, Router } from '@angular/router';
import { RegionService } from '../../service/region.service';
import { SessionService } from '../../service/session.service';
import { NotificationsService } from 'angular2-notifications';
import { AppService } from '../../service/app-service.service';
import { ProvinceService } from '../../service/province.service';
import { NavigationService } from '../../service/navigation-service.service';

@Component({
    selector: 'app-region',
    templateUrl: './region.component.html',
    styleUrls: ['./region.component.css']
})
export class RegionComponent implements OnInit, OnDestroy {
    _regionKey = "tpp-monitoring-region-info";

    filtersLoaded: Promise<boolean>;
    navigationSubscription;

    region: string;
    id: string;
    status: string;
    provinceSend: any;
    regionInfoData: any;
    provinceList: any = [];
    provinceInfoList: any = [];
    siteFavList: any = [];
    siteListDefault: any = [];
    favSiteList: any = [];
    arrSelect: any = [];
    subRegionList: any = [];
    regionId: string;
    mySearchFavSiteText: string = '';

    constructor(private ar: ActivatedRoute,
        private router: Router,
        private regionService: RegionService,
        private sessionService: SessionService,
        private notiService: NotificationsService,
        private as: AppService,
        private ns: NavigationService,
        private provinceService: ProvinceService,
        private activeRoute: ActivatedRoute
    ) {
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                this.initInfo();
            }
        });
    }

    checkAvaliableRegion() {
        let regionInfo = this.sessionService.getByKey(this._regionKey);
        this.id = this.regionInfoData.regionId;
        this.status = regionInfo[this.regionInfoData.regionName.toLocaleLowerCase()].status;
        this.ns.addNewRegionNavigat(this.regionInfoData);
        if (this.status === 'I') {
            this.notiService.error("ไม่สามารถเข้าถึงได้", "กรุณาติดต่อเจ้าหน้าที่ เนื่องจาก Region นี้มีสถานะเป็น Inactive");
            this.router.navigate(['/home']);
        }
    }

    ngOnInit(): void {
        this.ns.addNewProvinceNavigat('');
        this.ns.addNewSiteNavigat('');
        this.ns.addSummaryNavigat('');
    }

    initInfo() {
        this.activeRoute.paramMap.subscribe((params: ParamMap) => {
            this.regionId = params.get('regionId');
        });
        this.getRegionInfo();
    }

    ngOnDestroy() {
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }

    // refresh(val: boolean) {
    //     if (val) {
    //         this.getRegionInfo();
    //     }
    // }

    getRegionInfo() {
        this.regionService.getRegion(this.regionId).subscribe(
            data => {
                this.regionInfoData = data;
                this.provinceList = data.province;
                this.getSubRegion();
                // this.getProvice();
                this.checkAvaliableRegion();
                this.sessionService.archiveProvinceId(this.regionInfoData, this.region);
                this.sortData(this.regionInfoData.province);
                this.ns.addNewProvinceNavigat('');
                this.filtersLoaded = Promise.resolve(true);
            }, (err) => {
                if (err.status != 401) {
                    this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
                }
            });
    }

    getSubRegion() {
        this.provinceInfoList = [];
        this.regionService.getSubRegion(this.regionId).subscribe(
            data => {
                this.provinceInfoList = data.subRegion;
                this.getProvice();
            }, (err) => {
                if (err.status != 401) {
                    this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
                }
            });
    }

    getProvice() {
        this.siteListDefault = [];
        this.arrSelect = [];
        for (let province of this.provinceList) {
            this.arrSelect.push({ isSelect: false })
            if (province.status != 'I') {
                this.provinceService.getProvince(province.provinceId).subscribe(
                    data => {
                        this.provinceInfoList.push(data);
                        for (let site of data.sites) {
                            this.siteListDefault.push(site);
                        }
                        console.log(this.provinceInfoList)
                        this.siteFavList = this.siteListDefault;
                    },
                    (err) => {
                        if (err.status != 401) {
                            this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
                        }
                    });
            }
        }
    }

    sendProvince(index: any, status: any) {
        if (status != 'I') {
            this.provinceSend = this.regionInfoData.province[index];
            this.as.addNewProvinceList(this.provinceSend);
            this.sendProvinceNav(index);
        }
    }

    sendProvinceNav(index: any) {
        this.provinceSend = this.regionInfoData.province[index];
        this.ns.addNewProvinceNavigat(this.provinceSend);
    }

    sortData(data) {
        // let starList = data.filter(p => p.favFlag === 'Y');
        // let starAlert = starList.filter(p => p.status === 'W');
        // let starActive = starList.filter(p => p.status === 'A');
        // let normalList = data.filter(p => p.favFlag === 'N');
        // let normalAlert = normalList.filter(p => p.status === 'W');
        // let normalActive = normalList.filter(p => p.status === 'A');
        // this.regionInfoData.province = starAlert.concat(starActive, normalAlert, normalActive);

        let alert = data.filter(p => p.status === 'W');
        let active = data.filter(p => p.status === 'A');
        let inactive = data.filter(p => p.status === 'I');
        this.regionInfoData.province = alert.concat(active, inactive);
    }

    clickAccordion(index: any) {
        if (this.arrSelect[index].isSelect) {
            this.arrSelect[index].isSelect = false;
        } else {
            this.arrSelect[index].isSelect = true;
        }
    }

    goToSite(province: any, data: any) {
        let navigateProvince: any
        let navigateProvinceId: any

        for (let province of this.provinceInfoList) {
            if (province.sites != null)
                for (let site of province.sites) {
                    if (site.siteId == data.siteId) {
                        navigateProvince = province.provinceName;
                    }
                }
        }
        for (let chkProvince of this.regionInfoData.province) {
            if ((province != null && province.provinceName == chkProvince.provinceName) || navigateProvince == chkProvince.provinceName) {
                navigateProvinceId = chkProvince.provinceId;
            }
        }

        this.router.navigate(['/region/' + this.regionId + "/" + navigateProvinceId + "/" + data.siteId]);
    }

    goToProvince(data: any) {
        this.ns.addNewProvinceNavigat(data.provinceName);

        let isFound = false;
        for (let chkProvince of this.regionInfoData.province) {
            if (data.provinceName == chkProvince.provinceName) {
                this.as.addNewProvinceList(chkProvince);
                isFound = true;
            }
        }
        if (isFound)
            this.router.navigate(['/region/' + this.regionId + "/" + data.provinceId]);
        else
            this.notiService.error('เกิดข้อผิดพลาด', 'Province : ' + data.provinceName + ', Status : Inactive');
    }

    searchSiteFavFilter() {
        let value = this.mySearchFavSiteText;
        this.siteFavList = this.siteListDefault.filter(s => s.siteName.toLocaleLowerCase().includes(value));
    }
}
