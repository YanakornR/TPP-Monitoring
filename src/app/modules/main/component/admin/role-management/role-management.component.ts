import { RoleManagementService } from './role-management.service';
import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../../service/navigation-service.service';

declare const bootstrap: any;

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css']
})
export class RoleManagementComponent implements OnInit {

  filterOption: any = {
    page: 1,
    limit: 10,
    pageTotal: 1
  };
  roleList: any = [];
  roleForm: any = {
    roleName: '',
    defaultRole: 'U',
    companyId: '',
    report: false,
    admin: false,
    allRegion: false,
    northern: false,
    central: false,
    western: false,
    northeastern: false,
    eastern: false,
    southern: false
  };
  roleSelected: any = null;
  isVerify: boolean = false;
  selectAll: boolean = false;
  defaultRoles: any = [];
  companies: any = [];
  roleModal: any;
  searchFilter: any = '';
  messageModal: any;
  messageAlert: any = {
    type: 'error',
    title: '',
    detail: '',
    buttonOption: [
      {
        label: 'Cancel',
        class: '',
        action: this.hideMessageModal.bind(this)
      },
      {
        label: 'Retry',
        class: 'btn-outline-blue',
        action: function () {
          this.time = 60;
          this.checkConected();
          this.hideMessageModal();
        }.bind(this)
      },
    ]
  }
  defaultStatus: any = [{status:"A", statusName:"Active"}, {status:"I", statusName:"Inactive"}];

  constructor(private service: RoleManagementService,
    private ns: NavigationService) { }

  async ngOnInit() {
    this.ns.resetNavigatToAdmin();
    this.getRoleList();
  }

  async ngAfterViewInit() {
    this.roleModal = new bootstrap.Modal(document.getElementById('roleModal'));
    this.messageModal = new bootstrap.Modal(document.getElementById('messageModal'));
  }

  async getRoleList(e: any = 'N') {
    if (e === 'Y') {
      this.filterOption.page = 1;
      this.filterOption.pageTotal = 1;
      this.filterOption.totalResult = 0;
    }
    const data: any = await this.service.getRoleList(this.filterOption, this.searchFilter);
    this.roleList = data.datas.map((row: any) => {
      row.checked = false;
      return row;
    });
    this.isVerify = false;
    this.selectAll = false;
    this.filterOption.page = data.pageIndex;
    this.filterOption.pageTotal = data.pageTotal;
    this.filterOption.totalResult = data.totalResult;


  }

  async getCompany() {
    this.companies = await this.service.getCompany();
  }

  async getDefaultRole() {
    this.defaultRoles = await this.service.getDefaultRole();
  }

  openAddRoleModal() {
    this.getCompany();
    this.getDefaultRole();
    this.isVerify = false;
    this.roleForm = {
      roleName: '',
      companyId: '',
      defaultRole: 'U',
      report: false,
      admin: false,
      allRegion: false,
      northern: false,
      central: false,
      western: false,
      northeastern: false,
      eastern: false,
      southern: false
    };
    this.roleModal.show();
  }

  openEditRoleModal(role: any) {
    this.getCompany();
    this.getDefaultRole();
    this.isVerify = false;
    this.roleForm = { ...role, ...role.authorization };
    this.roleModal.show();
  }

  async goPage(nextIs: any) {
    if (this.filterOption.page + nextIs > 0 && this.filterOption.page + nextIs <= this.filterOption.pageTotal) {
      this.filterOption.page += nextIs;
      await this.getRoleList();
    }
  }

  onClickAllRegion(event: any) {
    for (var key in this.roleForm) {
      if (typeof this.roleForm[key] == 'boolean') {
        if (!['report', 'admin'].includes(key)) {
          this.roleForm[key] = event;
        }
      }
    }
  }

  verify() {
    this.isVerify = true;
    if (!this.roleForm.defaultRole || !this.roleForm.roleName || !this.roleForm.companyId) {
      return false;
    }
    return true;
  }

  openMessageSaveModal() {
    this.messageAlert = {
      type: 'error',
      title: 'Do you want to save?',
      detail: 'Do you sure want to save changes?',
      buttonOption: [
        {
          label: 'Cancel',
          class: '',
          action: this.hideMessageModal.bind(this)
        },
        {
          label: 'Save',
          class: 'btn-outline-blue',
          action: async function () {
            this.hideMessageModal();
            if (this.verify()) {
              for (var key in this.roleForm) {
                if (typeof this.roleForm[key] == 'boolean') {
                  this.roleForm[key] = (this.roleForm[key]) ? 'Y' : 'N';
                }
              }
              if (!this.roleForm.roleId) {
                await this.service.insertRole(this.roleForm);
              } else if (this.roleForm.roleId) {
                await this.service.updateRole(this.roleForm);
              }
              this.roleModal.hide();
              await this.getRoleList();
            }
          }.bind(this)
        },
      ]
    }
    this.messageModal.show();
  }

  openMessageDeleteModal(role: any) {
    this.roleSelected = role;
    this.messageAlert = {
      type: 'error',
      title: 'Are you sure?',
      detail: 'Are you sure want to delete?',
      buttonOption: [
        {
          label: 'Cancel',
          class: '',
          action: this.hideMessageModal.bind(this)
        },
        {
          label: 'Delete',
          class: 'btn-outline-rad',
          action: async function () {
            await this.service.deleteRole(this.roleSelected.roleId);
            this.hideMessageModal();
            await this.getRoleList();
          }.bind(this)
        },
      ]
    }
    this.messageModal.show();
  }

  getSelected() {
    return this.roleList.filter((row: any) => row.checked).length;
  }

  onSelectAll() {
    this.roleList = this.roleList.map((row: any) => {
      row.checked = this.selectAll;
      return row;
    });
  }

  onClearAll() {
    this.selectAll = false;
    this.roleList = this.roleList.map((row: any) => {
      row.checked = false;
      return row;
    });
  }

  openDeleteAllModal() {
    this.messageAlert = {
      type: 'error',
      title: 'Are you sure?',
      detail: 'Are you sure want to delete select?',
      buttonOption: [
        {
          label: 'Cancel',
          class: '',
          action: this.hideMessageModal.bind(this)
        },
        {
          label: 'Delete',
          class: 'btn-outline-rad',
          action: async function () {
            let roleSelected = this.roleList.filter((row: any) => row.checked);
            if (roleSelected.length) {
              for (let role of roleSelected) {
                await this.service.deleteRole(role.roleId);
              }
            }
            this.hideMessageModal();
            await this.getRoleList();
          }.bind(this)
        },
      ]
    }
    this.messageModal.show();
  }

  hideMessageModal() {
    this.messageModal.hide();
  }
}
