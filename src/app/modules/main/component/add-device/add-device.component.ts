import { Component, OnInit } from '@angular/core';

declare const bootstrap: any;

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent implements OnInit {

  isPage: any = 'page-1';
  connectModuleType: string = 'tpp-m-module';
  connectType: string = 'wifi';
  wifi: any = null;

  hide: boolean = true;
  messageModal: any;
  messageAlert: any = {
    type: 'error',
    title: 'Cannot connect',
    detail: 'Cannot connect to M-module do you want to re connect?',
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
  time: any = 60;
  editAddress: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.goPage('page-1');
  }

  async ngAfterViewInit() {
    this.messageModal = new bootstrap.Modal(document.getElementById('messageModal'));

  }

  goPage(page: any) {
    this.isPage = page;
    if (this.isPage == 'page-5') {
      this.time = 60;
      this.checkConected();
    }
  }

  selectConnectModuleType(moduleType: string){
    if (moduleType != this.connectType) {
      this.connectType = moduleType;
    } else {
      this.connectType = '';
    }
  }

  selectConnectType(type: string) {
    if (type != this.connectType) {
      this.connectType = type;
    } else {
      this.connectType = '';
    }
  }

  selectWifiName(wifi: any) {
    this.wifi = wifi;
  }

  checkConected() {
    this.time -= 1;
    let conected: any = Math.floor(Math.random() * 10);
    if (conected == 0) {
      this.messageAlert = {
        type: 'success',
        title: "You're all set",
        detail: 'Would you like to give us an information?',
        buttonOption: [
          {
            label: 'Cancel',
            class: '',
            action: this.hideMessageModal.bind(this)
          },
          {
            label: 'Next',
            class: 'btn-outline-blue',
            action: function () {
              this.isPage = 'page-6';
              this.hideMessageModal();
            }.bind(this)
          },
        ]
      };
      this.messageModal.show();
    }
    else if (conected == 9) {
      this.messageAlert = {
        type: 'error',
        title: 'Cannot connect',
        detail: 'Cannot connect to M-module do you want to re connect?',
        buttonOption: [
          {
            label: 'Cancel',
            class: '',
            action: this.hideMessageModal.bind(this)
          },
          {
            label: 'Retry',
            class: 'btn-outline-tpp',
            action: function () {
              this.time = 60;
              this.checkConected();
              this.hideMessageModal();
            }.bind(this)
          },
        ]
      };
      this.messageModal.show();
    } else {
      setTimeout(() => {
        this.checkConected();
      }, 1000);
    }
  }

  hideMessageModal() {
    this.messageModal.hide();
  }

  saveAddress() {
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
          class: 'btn-outline-tpp',
          action: function () {
            this.goPage('page-7');
            this.hideMessageModal();
          }.bind(this)
        },
      ]
    };
    this.messageModal.show();
  }

  deleteAddress() {
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
          class: 'btn-outline-red',
          action: this.hideMessageModal.bind(this)
        },
      ]
    };
    this.messageModal.show();
  }

}
