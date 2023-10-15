import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import DataTableUtils from '../../class/data-table-utils';
import { DataTablePageable } from '../../models/data-table-pageable';
import { HomeService } from '../../../modules/main/service/home.service';
import { finalize } from 'rxjs/operators';
import { SiteService } from 'src/app/modules/main/service/site.service';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/modules/main/service/session.service';

declare const bootstrap: any;

@Component({
    selector: 'tpp-summary-alert',
    templateUrl: './summary-alert.component.html',
    styleUrls: ['./summary-alert.component.css']
})
export class SummaryAlertComponent implements OnInit {

    filterOption: any = {
        region: ['central', 'northern', 'southern', 'eastern', 'northeastern', 'western'],
        status: ['comm.', 'fault', 'protect', 'alarm'],
        page: 1,
        limit: 10,
        pageTotal: 1,
        recordTotal: 0
    };
    dataSet: any = [];

    @Input('selectRegion')
    set region(region: string[]) {
        this.filterOption.region = region;
    }
    _status: string[];

    @Input('selectStatus')
    set status(status: string[]) {
        this.filterOption.status = status;
    }

    regionCheck = {
        'central': true,
        'northern': true,
        'western': true,
        'northeastern': true,
        'eastern': true,
        'southern': true
    }

    statusCheck = {
        'fault': true,
        'protect': true,
        'alarm': true,
        'comm.': true
    }

    defaultRegion: string[] = ['central', 'northern', 'southern', 'eastern', 'northeastern', 'western'];
    defaultStatus: string[] = ['comm.', 'fault', 'protect', 'alarm'];
    alarmCount = 0;

    filterSummaryAlertModal: any;

    constructor(private homeService: HomeService,
        private siteService: SiteService,
        private sessionService: SessionService,
        private router: Router) { }

    async ngOnInit() {
        await this.getSummaryAlert();
    }

    async ngAfterViewInit() {
        this.filterSummaryAlertModal = new bootstrap.Modal(document.getElementById('filterSummaryAlertModal'));
    }

    gotoSite(data) {
        this.siteService.setData(data);
        this.sessionService.archiveOneSiteId(data);
        this.router.navigate(['/region/' + data.regionId + "/" + data.provinceId + "/" + data.siteId]);
    }

    async getSummaryAlert() {
        const response: any = await this.homeService.getSummaryAlert(this.filterOption);
        this.dataSet = response.data;
        this.filterOption.page = response.pageIndex;
        this.filterOption.pageTotal = response.pageTotal;
        this.filterOption.recordTotal = response.recordTotal;
    }

    async openFilterModal() {
        this.filterSummaryAlertModal.show();
    }

    async selectRegionFilter(event: any, region: any) {
        if (event.target.checked) {
            this.filterOption.region.push(region.toLowerCase());
        } else {
            this.filterOption.region = this.filterOption.region.filter((row: any) => {
                return row != region.toLowerCase();
            });
        }
        await this.getSummaryAlert();
    }

    async selectAllRegionFilter(event: any) {
        if (event.target.checked) {
            this.filterOption.region = this.defaultRegion;
        } else {
            this.filterOption.region = []
        }
        await this.getSummaryAlert();
    }

    async selectStatusFilter(event: any, status: any) {
        if (event.target.checked) {
            this.filterOption.status.push(status.toLowerCase());
        } else {
            this.filterOption.status = this.filterOption.status.filter((row: any) => {
                return row != status.toLowerCase();
            });
        }
        await this.getSummaryAlert();
    }

    async selectAllStatusFilter(event: any) {
        if (event.target.checked) {
            this.filterOption.status = this.defaultStatus;
        } else {
            this.filterOption.status = []
        }
        await this.getSummaryAlert();
    }

    async goPage(nextIs: any) {
        if (this.filterOption.page + nextIs > 0 && this.filterOption.page + nextIs <= this.filterOption.pageTotal) {
            this.filterOption.page += nextIs;
            await this.getSummaryAlert();
        }
    }

    async clearFilter() {
        this.filterOption.region = this.defaultRegion;
        this.filterOption.status = this.defaultStatus;
        await this.getSummaryAlert();
    }

    clickLink(data: any) {
        this.router.navigate(['/home']);
    }

}
