import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NmModuleListComponent } from './nm-module-list/nm-module-list.component';
import { UserAccountListComponent } from './user-account-list/user-account-list.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { SubRegionComponent } from './sub-region/sub-region.component';
import { AccountLevelComponent } from './account-level/account-level.component';
import { SiteListComponent } from './site-list/site-list.component';



const routes: Routes = [
  {
    path: 'user-account',
    component: UserAccountListComponent,
    data: {
      title: 'User Account List'
    }
  },
  {
    path: 'nm-module',
    component: NmModuleListComponent,
    data: {
      title: 'NM Module Management List'
    }
  },
  {
    path: 'role',
    component: RoleManagementComponent,
    data: {
      title: 'Role Management'
    }
  },
  {
    path: 'sub-region',
    component: SubRegionComponent,
    data: {
      title: 'Sub Region'
    }
  },
  {
    path: 'account-level',
    component: AccountLevelComponent,
    data: {
      title: 'Account Level Authorization'
    }
  },
  {
    path: 'site',
    component: SiteListComponent,
    data: {
      title: 'Add Site List'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
