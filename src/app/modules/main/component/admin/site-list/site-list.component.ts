import { SiteListService } from './site-list.service';
import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../../service/navigation-service.service';

declare const bootstrap: any;

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.css']
})
export class SiteListComponent implements OnInit {
  filterOption: any = {
    page: 1,
    limit: 10,
    pageTotal: 1
  };
  siteList: any = [];
  siteForm: any = {
    siteName: "",
    address: "",
    latLong: "",
    province: "",
    provinceId: "",
    locationType: "",
    checked: false
  }
  selectAll: boolean = false;
  isVerify: boolean = false;
  provinceList: any = [];
  siteSelected: any = null;
  addSiteModal: any;
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
  constructor(private service: SiteListService,
    private ns: NavigationService) { }

  async ngOnInit() {
    this.ns.resetNavigatToAdmin();
    await this.getSiteList();
  }

  async ngAfterViewInit() {
    this.addSiteModal = new bootstrap.Modal(document.getElementById('addSiteModal'));
    this.messageModal = new bootstrap.Modal(document.getElementById('messageModal'));
  }

  async getSiteList() {
    const data: any = await this.service.getSiteList(this.filterOption);
    this.siteList = data.datas.map((row: any) => {
      row.checked = false;
      return row;
    });
    this.isVerify = false;
    this.selectAll = false;
    this.filterOption.page = data.pageIndex;
    this.filterOption.pageTotal = data.pageTotal;
    this.filterOption.totalResult = data.totalResult;
  }

  async getProvince() {
    this.provinceList = await this.service.getProvince();
  }

  openaddSiteModal() {
    this.siteForm = {
      siteName: "",
      address: "",
      latLong: "",
      province: "",
      provinceId: "",
      locationType: "",
    };
    this.getProvince();
    this.addSiteModal.show();
  }

  openEditSiteModal(site) {
    this.siteForm = site;
    this.getProvince();
    this.addSiteModal.show();
  }

  async goPage(nextIs: any) {
    if (this.filterOption.page + nextIs > 0 && this.filterOption.page + nextIs <= this.filterOption.pageTotal) {
      this.filterOption.page += nextIs;
      await this.getSiteList();
    }
  }

  verify() {
    this.isVerify = true;
    if (!this.siteForm.siteName && !this.siteForm.latLong && !this.siteForm.province) {
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
              if (!this.siteForm.siteId) {
                await this.service.insertSite(this.siteForm);
              } else if (this.siteForm.siteId) {
                await this.service.updateSite(this.siteForm);
              }
              this.addSiteModal.hide();
              await this.getSiteList();
            }
          }.bind(this)
        },
      ]
    }
    this.messageModal.show();
  }

  openMessageDeleteModal(site: any) {
    this.siteSelected = site;
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
            await this.service.deleteSite(this.siteSelected.siteId);
            this.hideMessageModal();
            await this.getSiteList();
          }.bind(this)
        },
      ]
    }
    this.messageModal.show();
  }

  getSelected() {
    return this.siteList.filter((row: any) => row.checked).length;
  }

  onSelectAll() {
    this.siteList = this.siteList.map((row: any) => {
      row.checked = this.selectAll;
      return row;
    });
  }

  onClearAll() {
    this.selectAll = false;
    this.siteList = this.siteList.map((row: any) => {
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
            let siteSelected = this.siteList.filter((row: any) => row.checked);
            if (siteSelected.length) {
              for (let site of siteSelected) {
                await this.service.deleteSite(site.siteId);
              }
            }
            this.hideMessageModal();
            await this.getSiteList();
          }.bind(this)
        },
      ]
    }
    this.messageModal.show();
  }

  hideMessageModal() {
    this.messageModal.hide();
  }

  onChangeProvince() {
    let data = this.provinceList.filter(item => item.provinceId == this.siteForm.provinceId);
    console.log(data);
    this.siteForm.province = data[0].provinceName;
  }
}
