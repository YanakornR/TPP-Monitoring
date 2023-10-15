import { SubRegionService } from './sub-region.service';
import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NavigationService } from '../../../service/navigation-service.service';

declare const bootstrap: any;

@Component({
  selector: 'app-sub-region',
  templateUrl: './sub-region.component.html',
  styleUrls: ['./sub-region.component.css']
})
export class SubRegionComponent implements OnInit {

  filterOption: any = {
    page: 1,
    limit: 10,
    pageTotal: 1
  };
  subRegionList: any = [];
  subRegionForm: any = {
    regionId: '',
    subRegionName: '',
    province: []
  };
  regionList: any = [];
  provinceList: any = [];
  provinceMultipleOption: IDropdownSettings = {
    singleSelection: false,
    idField: 'provinceId',
    textField: 'provinceName',
    itemsShowLimit: 3,
    allowSearchFilter: false
  };

  subRegionSelected: any = null;
  isVerify: boolean = false;
  selectAll: boolean = false;
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
  subRegionModal: any;
  constructor(private service: SubRegionService,
    private ns: NavigationService) { }

  ngOnInit() {
    this.ns.resetNavigatToAdmin();
    this.getSubRegionList();
  }

  async ngAfterViewInit() {
    this.subRegionModal = new bootstrap.Modal(document.getElementById('subRegionModal'));
    this.messageModal = new bootstrap.Modal(document.getElementById('messageModal'));
  }

  dispalyProvince(listProvince: any) {
    return listProvince.map((row: any) => { return row.provinceName }).join(', ');
  }

  async openAddSubRegionModal() {
    this.subRegionForm = {
      regionId: '',
      subRegionName: '',
      province: []
    };
    this.provinceList = [];
    this.regionList = await this.service.getRegionList();
    this.subRegionModal.show();
  }

  async onSelectRegion(regionId: any) {
    this.provinceList = [];
    this.subRegionForm.province = [];
    this.provinceList = await this.service.getProvince(regionId);
  }

  async getSubRegionList() {
    const data: any = await this.service.getSubRegionList(this.filterOption);
    this.subRegionList = data.datas.map((row: any) => {
      row.checked = false;
      return row;
    });
    this.isVerify = false;
    this.selectAll = false;
    this.filterOption.page = data.pageIndex;
    this.filterOption.pageTotal = data.pageTotal;
    this.filterOption.totalResult = data.totalResult;
  }

  async openEditSubRegionModal(subRegion) {
    this.subRegionForm = subRegion;
    this.regionList = await this.service.getRegionList();
    this.onSelectRegion(this.subRegionForm.regionId);
    this.subRegionForm.province = subRegion.provinceDatas;
    this.subRegionModal.show();
  }

  async goPage(nextIs: any) {
    if (this.filterOption.page + nextIs > 0 && this.filterOption.page + nextIs <= this.filterOption.pageTotal) {
      this.filterOption.page += nextIs;
      await this.getSubRegionList();
    }
  }

  onSelectProvince(event: any) {
    this.subRegionForm.provinceId = parseInt(event.target.value.split(' : ')[0]);
  }

  verify() {
    this.isVerify = true;
    if (!this.subRegionForm.subRegionName && !this.subRegionForm.latLong && !this.subRegionForm.province) {
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
              if (!this.subRegionForm.subRegionId) {
                await this.service.insertSubRegion(this.subRegionForm);
              } else if (this.subRegionForm.subRegionId) {
                await this.service.updateSubRegion(this.subRegionForm);
              }
              this.subRegionModal.hide();
              await this.getSubRegionList();
            }
          }.bind(this)
        },
      ]
    }
    this.messageModal.show();
  }

  openMessageDeleteModal(subRegion: any) {
    this.subRegionSelected = subRegion;
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
            await this.service.deleteSubRegion(this.subRegionSelected.subRegionId);
            this.hideMessageModal();
            await this.getSubRegionList();
          }.bind(this)
        },
      ]
    }
    this.messageModal.show();
  }

  getSelected() {
    return this.subRegionList.filter((row: any) => row.checked).length;
  }

  onSelectAll() {
    this.subRegionList = this.subRegionList.map((row: any) => {
      row.checked = this.selectAll;
      return row;
    });
  }

  onClearAll() {
    this.selectAll = false;
    this.subRegionList = this.subRegionList.map((row: any) => {
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
            let subRegionSelected = this.subRegionList.filter((row: any) => row.checked);
            if (subRegionSelected.length) {
              for (let subRegion of subRegionSelected) {
                await this.service.deleteSubRegion(subRegion.subRegionId);
              }
            }
            this.hideMessageModal();
            await this.getSubRegionList();
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
