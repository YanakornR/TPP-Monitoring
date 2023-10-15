import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { NmModuleListComponent } from './nm-module-list/nm-module-list.component';
import { UserAccountListComponent } from './user-account-list/user-account-list.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { SubRegionComponent } from './sub-region/sub-region.component';
import { AccountLevelComponent } from './account-level/account-level.component';
import { SiteListComponent } from './site-list/site-list.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    NmModuleListComponent,
    UserAccountListComponent,
    RoleManagementComponent,
    SubRegionComponent,
    AccountLevelComponent,
    SiteListComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class AdminModule { }
