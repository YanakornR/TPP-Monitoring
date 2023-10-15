import { AccountLevelService } from './account-level.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare const bootstrap: any;

@Component({
  selector: 'app-account-level',
  templateUrl: './account-level.component.html',
  styleUrls: ['./account-level.component.css']
})
export class AccountLevelComponent implements OnInit {
  private _authenticateObj: string = 'tpp-monitoring-authenticate-obj';

  companyList: any = [];
  companyForm: any = {
    companyName: ''
  }
  companyFormSave: any = {
    companyName: ''
  }
  isVerify: any = false;
  isVerifyPassword: any = false;
  companySelected: any = null;
  companyFromModal: any;
  messageModal: any;
  deleteModal: any;
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
  defaultStatus: any = [{status:"A", statusName:"Active"}, {status:"I", statusName:"Inactive"}];
  
  constructor(private service: AccountLevelService,
    private router: Router ) { }

  ngOnInit() {
    let obj = sessionStorage.getItem(this._authenticateObj);
    let data = JSON.parse(obj);
    let role = data.user.role.defaultRole;
    if(role != 'M')
        this.router.navigate(['/home']);
    this.getCompanyList();
  }

  async ngAfterViewInit() {
    this.companyFromModal = new bootstrap.Modal(document.getElementById('companyFromModal'));
    this.messageModal = new bootstrap.Modal(document.getElementById('messageModal'));
    this.deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
  }

  async getCompanyList() {
    const data: any = await this.service.getCompanyList();
    this.companyList = data;
    this.isVerify = false;
    this.companyForm = {
      companyName: ''
    }
  }

  verify(comForm: any) {
    this.isVerify = true;
    if (!comForm.companyName) {
      return false;
    }
    return true;
  }

  verifyPassword() {
    this.isVerifyPassword = true;
    if (!this.messageAlert.passwordConfirm) {
      return false;
    }
    return true;
  }

  async openEditModuleModal(company: any) {
    this.companyForm = company;
    this.companyFromModal.show();
  }

  openMessageSaveModal(comForm: any) {
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
            if (this.verify(comForm)) {
              if (!comForm.companyId) {
                await this.service.insertCompany(comForm);
              } else if (comForm.companyId) {
                await this.service.updateCompany(comForm);
                this.companyFromModal.hide();
              }
              await this.getCompanyList();
            }
          }.bind(this)
        },
      ]
    }
    this.messageModal.show();
  }

  openMessageDeleteModal(company: any) {
    this.companySelected = company;
    this.messageAlert = {
      type: 'error',
      title: 'Delete Company',
      detail: 'โปรดตรวจสอบว่าบริษัทที่จะลบไม่มีการผูกกับผู้ใช้งานใดๆแล้ว กรุณายืนยันรหัสผ่านอีกครั้ง',
      passwordConfirm: '',
      buttonOption: [
        {
          label: 'Cancel',
          class: '',
          action: this.hideDeleteModal.bind(this)
        },
        {
          label: 'Delete',
          class: 'btn-outline-rad',
          action: async function () {
            if (this.verifyPassword()) {
              await this.service.deleteCompany(this.companySelected.companyId, this.messageAlert.passwordConfirm);
              this.hideDeleteModal();
              await this.getCompanyList();
            }
          }.bind(this)
        },
      ]
    }
    this.deleteModal.show();
  }

  hideMessageModal() {
    this.messageModal.hide();
  }

  hideDeleteModal() {
    this.deleteModal.hide();
  }
}
