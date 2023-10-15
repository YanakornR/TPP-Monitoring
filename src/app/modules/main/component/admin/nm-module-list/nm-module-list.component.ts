import { NmModuleListService } from './nm-module-list.service';
import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../../service/navigation-service.service';
import { JsonPipe } from '@angular/common';

declare const bootstrap: any;

@Component({
  selector: 'app-nm-module-list',
  templateUrl: './nm-module-list.component.html',
  styleUrls: ['./nm-module-list.component.css']
})
export class NmModuleListComponent implements OnInit {
  private _authenticateObj: string = 'tpp-monitoring-authenticate-obj';

  moduleList: any = [];
  filterOption: any = {
    region: [],
    role: [],
    page: 1,
    limit: 10,
    pageTotal: 1
  };
  moduleFromModal: any;
  moduleRecFromModal: any;
  moduleNMFromModal: any;
  moduleForm: any = {
    modelSN: '',
    modelName: '',
    siteId: '',
    siteName: '',
    thirdPartyBrand: '',
    thirdPartyModel: '',
    note1: '',
    note2: '',
    '3rdParty': [{ status: 'insert', id: null, name: '', type: '', quantity: '' }]
  };
  moduleRecForm: any = {
    name: '',
    siteId: '',
    ipAddress: '',
    address: '',
    note1: '',
    note2: ''
  }
  moduleNMForm: any = {
    serial: '',
    name: '',
    siteId: '',
    siteName: '',
    type: 'NMModule',
    status: 'A',
    note1: '',
    note2: '',
    address: ''
  }
  delete3rdParty: any = [];
  moduleSelected: any = null;
  companyList: any = [];
  regionList: any = [];
  roleList: any = [];
  siteList: any = [];
  isVerify: boolean = false;
  isVerifyRec: boolean = false;
  isVerifyNM: boolean = false;
  selectAll: boolean = false;
  role: any;
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
        }.bind(this)
      },
    ]
  }
  defaultStatus: any = [{ status: "A", statusName: "Active" }, { status: "I", statusName: "Inactive" }];
  filterModal: any;
  nmSearch: any = '';

  constructor(private service: NmModuleListService,
    private ns: NavigationService) { }

  async ngOnInit() {
    this.nmSearch = '';
    let obj = sessionStorage.getItem(this._authenticateObj);
    let data = JSON.parse(obj);
    this.role = data.user.role.defaultRole;
    this.ns.resetNavigatToAdmin();
    await this.getModuleList();
  }
  async ngAfterViewInit() {
    this.filterModal = new bootstrap.Modal(document.getElementById('filterModal'));
    this.moduleFromModal = new bootstrap.Modal(document.getElementById('moduleFromModal'));
    this.moduleRecFromModal = new bootstrap.Modal(document.getElementById('moduleRecFromModal'));
    this.moduleNMFromModal = new bootstrap.Modal(document.getElementById('moduleNMFromModal'));
    this.messageModal = new bootstrap.Modal(document.getElementById('messageModal'));
  }

  async getModuleList(e: any = 'N') {
    if (e === 'Y') {
      this.filterOption.page = 1;
      this.filterOption.pageTotal = 1;
      this.filterOption.totalResult = 0;
    }
    const data: any = await this.service.getModuleList(this.filterOption, this.nmSearch);
    this.moduleList = data.datas.map((row: any) => {
      row.checked = false;
      return row;
    });
    this.isVerify = false;
    this.isVerifyRec = false;
    this.isVerifyNM = false;
    this.selectAll = false;
    this.filterOption.page = data.pageIndex;
    this.filterOption.pageTotal = data.pageTotal;
    this.filterOption.totalResult = data.totalResult;
  }

  async openAddModuleModal() {
    this.delete3rdParty = [];
    this.moduleForm = {
      modelSN: '',
      modelName: '',
      siteId: '',
      siteName: '',
      '3rdBrand': '',
      '3rdModel': '',
      note1: '',
      note2: '',
      '3rdParty': [{ status: 'insert', id: null, name: '', type: '', quantity: '' }]
    };
    this.getSiteList();
    this.moduleFromModal.show();
  }
  
  async openAddRecModuleModal() {
    this.moduleRecForm = {
      name: '',
      siteId: '',
      ipAddress: '',
      address: '',
      note1: '',
      note2: ''
    }
    this.getSiteList();
    this.moduleRecFromModal.show();
  }

  async getSiteList() {
    const data: any = await this.service.getSiteList();
    this.siteList = data.datas;
  }

  onSelectSite(event: any) {
    this.moduleForm.siteName = this.siteList.filter((row: any) => row.siteId == event.target.value)[0].siteName;
  }

  addEquipment() {
    this.moduleForm['3rdParty'].push({ status: 'insert', id: null, name: '', type: '', quantity: '' });
  }

  async openEditModuleModal(module: any) {
    if(module.modelType === '3rdParty') {
      this.delete3rdParty = [];
      this.service.getModule(module.id)
        .then((response: any) => {
          this.moduleForm = [response].map((row: any) => {
            row['3rdParty'] = row.thirdPartyEquipments;
            row['3rdParty'].forEach(e => {
              e.status = 'update';
            });
            // row.3rdBrand = row['3rdBrand'];
            // row.3rdModel = row['3rdModel'];
            delete row.thirdPartyEquipments;
            // delete row['3rdBrand'];
            // delete row['3rdModel'];
            return row;
          })[0];
          this.getSiteList();
          this.moduleFromModal.show();
          return true;
        })
        .catch((error: any) => {
          this.messageAlert = {
            type: 'error',
            title: 'Error',
            detail: 'Error Record not found',
            buttonOption: [
              {
                label: 'Cancel',
                class: '',
                action: this.hideMessageModal.bind(this)
              },
            ]
          };
          this.messageModal.show();
          return false;
        });
    } else if(module.modelType === 'Rectifier'){
      this.service.getModuleRec(module.id)
        .then((response: any) => {
          this.moduleRecForm = response;
          this.getSiteList();
          this.moduleRecFromModal.show();
          return true;
        })
        .catch((error: any) => {
          this.messageAlert = {
            type: 'error',
            title: 'Error',
            detail: 'Error Record not found',
            buttonOption: [
              {
                label: 'Cancel',
                class: '',
                action: this.hideMessageModal.bind(this)
              },
            ]
          };
          this.messageModal.show();
          return false;
        });
    } else if(module.modelType === 'NMModule') {
      this.service.getModuleNM(module.id)
        .then((response: any) => {
          this.moduleNMForm = response;
          this.getSiteList();
          this.moduleNMFromModal.show();
          return true;
        })
        .catch((error: any) => {
          this.messageAlert = {
            type: 'error',
            title: 'Error',
            detail: 'Error Record not found',
            buttonOption: [
              {
                label: 'Cancel',
                class: '',
                action: this.hideMessageModal.bind(this)
              },
            ]
          };
          this.messageModal.show();
          return false;
        });
    }
  }

  async openFilterModal() {
    this.regionList = await this.service.getRegionList();
    this.roleList = await this.service.getRoleList(1);
    this.filterModal.show()
  }

  async selectRegionFilter(event: any, region: any) {
    if (event.target.checked) {
      this.filterOption.region.push(region.regionName.toLowerCase());
    } else {
      this.filterOption.region = this.filterOption.region.filter((row: any) => {
        return row != region.regionName.toLowerCase();
      });
    }
    await this.getModuleList();
  }

  async selectAllRegionFilter(event: any) {
    if (event.target.checked) {
      this.filterOption.region = this.regionList.map((row: any) => { return row.regionName.toLowerCase() });
    } else {

      this.filterOption.region = [];
    }
    await this.getModuleList();
  }

  async selectRoleFilter(event: any, role: any) {
    if (event.target.checked) {
      this.filterOption.role.push(role.roleName.toLowerCase());
    } else {
      this.filterOption.role = this.filterOption.role.filter((row: any) => {
        return row != role.roleName.toLowerCase();
      });
    }
    await this.getModuleList();
  }

  async selectAllRoleFilter(event: any) {
    if (event.target.checked) {
      this.filterOption.role = this.roleList.map((row: any) => { return row.roleName.toLowerCase() });
    } else {

      this.filterOption.role = [];
    }
    await this.getModuleList();
  }

  async clearFilter() {
    this.filterOption.role = [];
    this.filterOption.region = [];
    await this.getModuleList();
  }

  async onSelectCompany() {
    this.roleList = await this.service.getRoleList(this.moduleForm.companyId);
  }

  exportModuleList() {
    const data: any = this.service.exportModule().then((result: any) => {
      let blob: any = new Blob([result], { type: result.type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      link.setAttribute('href', url);
      link.setAttribute('download', `module-list.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }).catch((err) => {
      console.log('err :', err);
    });
  }

  async goPage(nextIs: any) {
    if (this.filterOption.page + nextIs > 0 && this.filterOption.page + nextIs <= this.filterOption.pageTotal) {
      this.filterOption.page += nextIs;
      await this.getModuleList();
    }
  }

  verify() {
    this.isVerify = true;
    if (!this.moduleForm.modelSN && !this.moduleForm.modelName) {
      return false;
    }
    return true;
  }

  verifyRec() {
    this.isVerifyRec = true;
    if (!this.moduleRecForm.name && !this.moduleRecForm.siteId) {
      return false;
    }
    return true;
  }
  
  verifyNM() {
    this.isVerifyNM = true;
    if (!this.moduleNMForm.name && !this.moduleNMForm.siteId && !this.moduleNMForm.serial) {
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
              if (!this.moduleForm.logNo) {
                await this.service.insertModule(this.moduleForm);
              } else if (this.moduleForm.logNo) {
                this.moduleForm['3rdParty'] = this.moduleForm['3rdParty'].concat(this.delete3rdParty);
                await this.service.updateModule(this.moduleForm);
              }
              this.moduleFromModal.hide();
              await this.getModuleList();
            }
          }.bind(this)
        },
      ]
    }
    this.messageModal.show();
  }

  
  openMessageRecSaveModal() {
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
            console.log(this.moduleRecForm)
            if (this.verifyRec()) {
              if (!this.moduleRecForm.id) {
                await this.service.insertRecModule(this.moduleRecForm);
              } else if (this.moduleRecForm.id) {
                await this.service.updateRecModule(this.moduleRecForm);
              }
              this.moduleRecFromModal.hide();
              await this.getModuleList();
            }
          }.bind(this)
        },
      ]
    }
    this.messageModal.show();
  }

  
  openMessageNMSaveModal() {
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
            console.log(this.moduleNMForm)
            if (this.verifyNM()) {
              if (!this.moduleNMForm.id) {
                // await this.service.insertRecModule(this.moduleRecForm);
              } else if (this.moduleNMForm.id) {
                await this.service.updateNMModule(this.moduleNMForm);
              }
              this.moduleNMFromModal.hide();
              await this.getModuleList();
            }
          }.bind(this)
        },
      ]
    }
    this.messageModal.show();
  }

  openMessageDeleteModal(module: any) {
    this.moduleSelected = module;
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
            await this.service.deleteModule(this.moduleSelected.logNo);
            this.hideMessageModal();
            this.moduleFromModal.hide();
            await this.getModuleList();
          }.bind(this)
        },
      ]
    }
    this.messageModal.show();
  }

  getSelected() {
    return this.moduleList.filter((row: any) => row.checked).length;
  }

  onSelectAll() {
    this.moduleList = this.moduleList.map((row: any) => {
      row.checked = this.selectAll;
      return row;
    });
  }

  onClearAll() {
    this.selectAll = false;
    this.moduleList = this.moduleList.map((row: any) => {
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
            let moduleSelected = this.moduleList.filter((row: any) => row.checked);
            if (moduleSelected.length) {
              let req = [];
              for (let module of moduleSelected) {
                let r = {
                  id: module.id,
                  moduleType: module.moduleType
                }
                req.push(r);
              }
              await this.service.deleteModuleNew(req);
            }
            this.hideMessageModal();
            await this.getModuleList();
          }.bind(this)
        },
      ]
    }
    this.messageModal.show();
  }

  hideMessageModal() {
    this.messageModal.hide();
  }

  remove3rdParty(m: any) {
    const index = this.moduleForm['3rdParty'].indexOf(m, 0);
    if (index > -1) {
      let data = this.moduleForm['3rdParty'][index];
      if (data.id != null) {
        data.status = 'delete';
        this.delete3rdParty.push(data);
      }
      this.moduleForm['3rdParty'].splice(index, 1);
    }
  }
}
