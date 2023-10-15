import { MaterialModule } from './../../material.module';
import { AdminModule } from './component/admin/admin.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { HomeComponent } from './component/home/home.component';
import { ContactUsComponent } from './component/contact-us/contact-us.component';
import { RegionComponent } from './component/region/region.component';
import { ReportComponent } from './component/report/report.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProvinceComponent } from './component/province/province.component';
import { SiteComponent } from './component/site/site.component';
import { StatusComponent } from './component/status/status.component';
import { SummaryComponent } from './component/summary/summary.component';
import { SupportComponent } from './component/support/support.component';
import { EditProfileComponent } from './component/edit-profile/edit-profile.component';
import { AddDeviceComponent } from './component/add-device/add-device.component';
import { EnergySavingComponent } from './component/energy-saving/energy-saving.component';

@NgModule({
  declarations: [
    HomeComponent,
    ContactUsComponent,
    RegionComponent,
    ReportComponent,
    ProvinceComponent,
    SiteComponent,
    StatusComponent,
    SummaryComponent,
    SupportComponent,
    EditProfileComponent,
    AddDeviceComponent,
    EnergySavingComponent
  ],
  imports: [
    MainRoutingModule,
    SharedModule,
    AdminModule,
    MaterialModule
  ]
})
export class MainModule { }
