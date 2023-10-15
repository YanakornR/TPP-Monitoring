import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from "ngx-bootstrap-th";
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NZ_I18N, th_TH } from 'ng-zorro-antd/i18n';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { MatIconModule } from '@angular/material/icon';
import { ChartsModule } from 'ng2-charts';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";


import { SideNavComponent } from './component/side-nav/side-nav.component';
import { SummaryAlertComponent } from './component/summary-alert/summary-alert.component';
import { BatteryBackupComponent } from './component/battery-backup/battery-backup.component';
import { ProvinceCardComponent } from './component/province-card/province-card.component';
import { SiteCardComponent } from './component/site-card/site-card.component';
import { MapComponent } from './component/map/map.component';
import { PiCardComponent } from './component/pi-card/pi-card.component';
import { BatteryCardComponent } from './component/battery-card/battery-card.component';
import { BattStatusCardComponent } from './component/batt-status-card/batt-status-card.component';
import { BatteryBackupProvinceComponent } from './component/battery-backup-province/battery-backup-province.component';
import { SummaryAlertProvinceComponent } from './component/summary-alert-province/summary-alert-province.component'
import { AgmCoreModule } from '@agm/core';
import { AdminSideBarComponent } from './component/admin-side-bar/admin-side-bar.component';


@NgModule({
  declarations: [SideNavComponent, SummaryAlertComponent, BatteryBackupComponent, ProvinceCardComponent, SiteCardComponent, MapComponent, PiCardComponent, BatteryCardComponent, BattStatusCardComponent, BatteryBackupProvinceComponent, SummaryAlertProvinceComponent, AdminSideBarComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzSwitchModule,
    NzSelectModule,
    NzSliderModule,
    NzInputNumberModule,
    NzPaginationModule,
    MatIconModule,
    ChartsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    NgbModule,
    BsDatepickerModule.forRoot(),
    AgmCoreModule
  ],
  exports: [
    CommonModule,
    SideNavComponent,
    SummaryAlertComponent,
    ProvinceCardComponent,
    SiteCardComponent,
    MapComponent,
    BatteryCardComponent,
    BattStatusCardComponent,
    PiCardComponent,
    BsDropdownModule,
    NgSelectModule,
    NzSelectModule,
    NzTableModule,
    NzSwitchModule,
    NzSliderModule,
    NzInputNumberModule,
    NzPaginationModule,
    FormsModule,
    MatIconModule,
    BatteryBackupComponent,
    ChartsModule,
    ModalModule,
    NgbModule,
    BsDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule,
    SummaryAlertProvinceComponent,
    BatteryBackupProvinceComponent,
    AdminSideBarComponent
  ],
  providers: [
    {
      provide: NZ_I18N,
      useValue: th_TH
    }
  ]
})
export class SharedModule { }
