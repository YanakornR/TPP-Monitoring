import { AdminModule } from './component/admin/admin.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactUsComponent } from './component/contact-us/contact-us.component';
import { SummaryComponent } from './component/summary/summary.component';
import { HomeComponent } from './component/home/home.component';
import { ProvinceComponent } from './component/province/province.component';
import { RegionComponent } from './component/region/region.component';
import { ReportComponent } from './component/report/report.component';
import { SiteComponent } from './component/site/site.component';
import { StatusComponent } from './component/status/status.component';
import { SupportComponent } from './component/support/support.component';
import { EditProfileComponent } from './component/edit-profile/edit-profile.component';
import { AddDeviceComponent } from './component/add-device/add-device.component';
import { EnergySavingComponent } from './component/energy-saving/energy-saving.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: {
      title: 'TPP Power Monitoring'
    }
  },
  {
    path: 'region/:regionId',
    component: RegionComponent,
    data: {
      title: 'TPP Power Monitoring'
    }
  },
  {
      path: 'region/:regionId/:provinceId',
    component: ProvinceComponent,
    data: {
      title: 'TPP Power Monitoring'
    }
  },
  {
      path: 'region/:regionId/:provinceId/:siteId',
    component: SiteComponent,
    data: {
      title: 'TPP Power Monitoring'
    }
  },
  {
    path: 'region/:region/:province/:site/:pi/status',
    component: StatusComponent,
    data: {
      title: 'TPP Power Monitoring'
    }
  },
  {
      path: 'region/:regionId/:provinceId/:siteId/:piId/summary/:type',
    component: SummaryComponent,
    data: {
      title: 'TPP Power Monitoring'
    }
  },
  {
    path: 'report',
    component: ReportComponent,
    data: {
      title: 'TPP Power Monitoring'
    }
  },
  {
    path: 'contact-us',
    component: ContactUsComponent,
    data: {
      title: 'ติดต่อเรา'
    }
  },
  {
    path: 'admin',
    loadChildren: () => import('./component/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent,
    data: {
      title: 'TPP Power Monitoring'
    }
  }, {
    path: 'support',
    component: SupportComponent,
    data: {
      title: 'TPP Power Monitoring'
    }
  },
  {
    path: 'add-device',
    component: AddDeviceComponent,
    data: {
        title: 'TPP Power Monitoring'
    }
  },
  {
    path: 'energy-saving',
    component: EnergySavingComponent,
    data: {
        title: 'TPP Power Monitoring'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
