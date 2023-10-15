import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BatteryBackupComponent } from 'src/app/shared/component/battery-backup/battery-backup.component';
import { SummaryAlertComponent } from 'src/app/shared/component/summary-alert/summary-alert.component';
import { HomeService } from '../../service/home.service';
import { SessionService } from '../../service/session.service';
import { NotificationsService } from 'angular2-notifications';
import { ViewportScroller } from '@angular/common';
import { AppService } from '../../service/app-service.service'
import { NavigationService } from '../../service/navigation-service.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    private _authenticateObj: string = 'tpp-monitoring-authenticate-obj';
    allInfo: any;
    northern: any;
    central: any;
    northeastern: any;
    southern: any;
    eastern: any;
    western: any;
    role: any = '';
    list = [];
    allCompany: any
    customerCompany: any;
    _regionKey = "tpp-monitoring-region-info";
    filtersLoaded: Promise<boolean>;
    accessPage: any = {
        "report": false,
        "admin": false,
        "northern": false,
        "central": false,
        "western": false,
        "northeastern": false,
        "eastern": false,
        "southern": false
    };

    @ViewChild('target') target: ElementRef;
    @ViewChild('summaryAlert') summaryAlert: SummaryAlertComponent;
    @ViewChild('batteryBackup') batteryBackup: BatteryBackupComponent;

    defaultRegion: string[] = ['central', 'northern', 'southern', 'eastern', 'northeastern', 'western'];
    defaultStatus: string[] = ['fault', 'protect', 'alarm', 'comm.'];

    region: string[] = ['central', 'northern', 'southern', 'eastern', 'northeastern', 'western'];
    regionBackup: string[] = ['central', 'northern', 'southern', 'eastern', 'northeastern', 'western'];
    status: string[] = ['fault', 'protect', 'alarm', 'comm.'];

    constructor(private homeService: HomeService, private detectChg: ChangeDetectorRef,
        private sessionService: SessionService,
        private notiService: NotificationsService,
        private _vps: ViewportScroller,
        private as: AppService,
        private ns: NavigationService) { }

    ngOnInit(): void {
        this.getAllInfo(false);
        let obj = sessionStorage.getItem(this._authenticateObj);
        let data = JSON.parse(obj);
        this.role = data.user.role.defaultRole;
        this.accessPage = data.user.role.accessPage;
        if (data.user.role.defaultRole == 'M') {
            this.getAllCompany();
            this.setCompanyId();
        }
        this.as.list$.subscribe(list => (this.list = list));
    }

    getAllInfo(reset) {
        this.homeService.getAllInfo().pipe().subscribe(
            data => {
                this.allInfo = data;
                this.central = this.findRegion('central');
                this.northern = this.findRegion('northern');
                this.northeastern = this.findRegion('northeastern');
                this.southern = this.findRegion('southern');
                this.eastern = this.findRegion('eastern');
                this.western = this.findRegion('western');
                this.sessionService.archiveRegionId(this.allInfo);
                this.ns.resetNavigatToHome();
                if (!reset) 
                    this.filtersLoaded = Promise.resolve(true);
            },
            (err) => {
                if (err.status != 401) {
                    this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
                }
            });
    }

    getAllCompany() {
        this.homeService.getAllCompany().pipe().subscribe(
            (data: any) => {
                this.allCompany = data.company;
            },
            (err) => {
                if (err.status != 401) {
                    this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
                }
            });
    }

    findRegion(region: string) {
        return this.allInfo.region.find(s => s.regionName.toLocaleLowerCase() === region);
    }

    filterRegionString(region: string) {
        return this.defaultRegion.filter(s => s.toLocaleLowerCase() === region.toLocaleLowerCase());
    }

    filterStatusString(status: string) {
        return this.defaultStatus.filter(s => s.toLocaleLowerCase() === status.toLocaleLowerCase());
    }

    select(regionS, statusS, status) {
        if (status != 'I') {
            this.region = this.filterRegionString(regionS);
            this.status = this.filterStatusString(statusS);
            this.regionBackup = this.filterRegionString(regionS);
            this.detectChg.detectChanges();
            this.batteryBackup.searchData();
            this._vps.scrollToAnchor('target');
        }
    }

    sendRegionNav(region: any) {
        // this.provinceSend = this.regionInfoData.province[index];
        // this.ns.addNewRegionNavigat(region);
    }

    onChangeCompany(companyId: any) {
        if (this.role === 'M')
            this.homeService.updateCompany(companyId).pipe().subscribe(
                (data: any) => {
                    this.notiService.success("Success", "Change Customer Company");
                    this.sessionService.setCustomer(companyId);
                    this.getAllInfo(true);
                },
                (err) => {
                    if (err.status != 401) {
                        this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
                    }
                });
    }
    
    setCompanyId() {
        this.customerCompany = this.sessionService.getCustomer();
    }
}
