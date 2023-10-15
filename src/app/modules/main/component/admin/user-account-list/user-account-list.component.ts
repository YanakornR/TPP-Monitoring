import { UserAccountListService } from './user-account-list.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NavigationService } from '../../../service/navigation-service.service';

declare const bootstrap: any;

@Component({
    selector: 'app-user-account-list',
    templateUrl: './user-account-list.component.html',
    styleUrls: ['./user-account-list.component.css']
})
export class UserAccountListComponent implements OnInit, AfterViewInit {
    private _authenticateObj: string = 'tpp-monitoring-authenticate-obj';

    filterOption: any = {
        roleId: [],
        regionId: [],
        page: 1,
        limit: 10,
        pageTotal: 1
    };
    userList: any = [];
    userForm: any = {
        username: '',
        name: '',
        lastname: '',
        companyId: '',
        position: '',
        password: '',
        email: '',
        tel: '',
        roleId: '',
    };
    searchFilter: any = '';
    companyList: any = [];
    roleList: any = [];
    regionList: any = [];
    userSelected: any = null;
    isVerify: boolean = false;
    selectAll: boolean = false;
    userFromModal: any;
    messageModal: any;
    role: string = null;
    companyId: any = null;
    chkPassword: false;
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

    isDisable:boolean = false;

    filterModal: any;
    
    constructor(private service: UserAccountListService,
        private ns: NavigationService) { }

    ngOnInit() {
        let obj = sessionStorage.getItem(this._authenticateObj);
        let data = JSON.parse(obj);
        this.companyId = data.user.companyId;
        this.role = data.user.role.defaultRole;
        this.searchFilter = '';
        this.ns.resetNavigatToAdmin();
        this.getUserList()
    }
    async ngAfterViewInit() {
        this.filterModal = new bootstrap.Modal(document.getElementById('filterModal'));
        this.userFromModal = new bootstrap.Modal(document.getElementById('userFromModal'));
        this.messageModal = new bootstrap.Modal(document.getElementById('messageModal'));
    }

    async getUserList(e: any = 'N') {
        if (e === 'Y') {
            this.filterOption.page = 1;
            this.filterOption.pageTotal = 1;
            this.filterOption.totalResult = 0;
        }
        const data: any = await this.service.getUserList(this.filterOption, this.searchFilter);
        this.userList = data.datas.map((row: any) => {
            row.checked = false;
            return row;
        });
        this.isVerify = false;
        this.selectAll = false;
        this.filterOption.page = data.pageIndex;
        this.filterOption.pageTotal = data.pageTotal;
        this.filterOption.totalResult = data.totalResult;
    }

    async openAddUsernModal() {
        let company = '';
        if(this.role == 'M') {
            this.isDisable = false;
        } else {
            this.isDisable = true;
            company = this.companyId;
        }
        this.userForm = {
            username: '',
            name: '',
            lastname: '',
            companyId: company,
            position: '',
            password: '',
            email: '',
            tel: '',
            roleId: '',
        };
        this.companyList = await this.service.getCompanyList();
        this.userFromModal.show();
    }

    async openEditUserModal(user: any) {
        this.roleList = await this.service.getRoleList(user.companyId);
        this.companyList = await this.service.getCompanyList();
        this.userForm = {
            userId: user.userId,
            username: user.userName,
            name: user.name,
            lastname: user.lastName,
            companyId: user.companyId,
            position: '',
            password: '',
            email: user.email,
            tel: user.tel,
            roleId: user.roleId,
        };
        if(this.role == 'M') {
            // this.isDisable = false;
        } else {
            this.isDisable = true;
        }
        this.userFromModal.show();
    }

    async openFilterModal() {
        this.regionList = await this.service.getRegionList();
        this.roleList = await this.service.getRoleList(1);
        this.filterModal.show()
    }

    async selectRegionFilter(event: any, region: any) {
        if (event.target.checked) {
            this.filterOption.regionId.push(region.regionId);
        } else {
            this.filterOption.regionId = this.filterOption.regionId.filter((row: any) => {
                return row != region.regionId
            });
        }
        await this.getUserList();
    }

    async selectAllRegionFilter(event: any) {
        if (event.target.checked) {
            this.filterOption.regionId = this.regionList.map((row: any) => { return row.regionId });
        } else {
            this.filterOption.regionId = [];
        }
        await this.getUserList();
    }

    async selectRoleFilter(event: any, role: any) {
        if (event.target.checked) {
            this.filterOption.roleId.push(role.roleId);
        } else {
            this.filterOption.roleId = this.filterOption.roleId.filter((row: any) => {
                return row != role.roleId
            });
        }
        await this.getUserList();
    }


    async selectAllRoleFilter(event: any) {
        if (event.target.checked) {
            this.filterOption.roleId = this.roleList.map((row: any) => { return row.roleId });
        } else {
            this.filterOption.roleId = [];
        }
        await this.getUserList();
    }

    async clearFilter() {
        this.filterOption.roleId = [];
        this.filterOption.regionId = [];
        await this.getUserList();
    }

    async onSelectCompany() {
        this.roleList = await this.service.getRoleList(this.userForm.companyId);
    }

    exportUserList() {
        const data: any = this.service.exportUser().then((result: any) => {
            let blob: any = new Blob([result], { type: result.type });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('target', '_blank');
            link.setAttribute('href', url);
            link.setAttribute('download', `user-list.xlsx`);
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
            await this.getUserList();
        }
    }

    verify() {
        this.isVerify = true;
        if (!this.userForm.companyId && !this.userForm.username && !this.userForm.roleId) {
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
                            if (!this.userForm.userId) {
                                await this.service.insertUser(this.userForm);
                            } else if (this.userForm.userId) {
                                console.log(this.userForm.password)
                                if (this.userForm.password == '') {
                                    this.chkPassword = true;
                                } else {
                                    this.chkPassword = false;
                                }
                                await this.service.updateUser(this.userForm);
                            }
                            this.userFromModal.hide();
                            await this.getUserList();
                        }
                    }.bind(this)
                },
            ]
        }
        this.messageModal.show();
    }

    openMessageDeleteModal(user: any) {
        this.userSelected = user;
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
                        await this.service.deleteUser(this.userSelected.userId);
                        this.hideMessageModal();
                        await this.getUserList();
                    }.bind(this)
                },
            ]
        }
        this.messageModal.show();
    }

    getSelected() {
        return this.userList.filter((row: any) => row.checked).length;
    }

    onSelectAll() {
        this.userList = this.userList.map((row: any) => {
            row.checked = this.selectAll;
            return row;
        });
    }

    onClearAll() {
        this.selectAll = false;
        this.userList = this.userList.map((row: any) => {
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
                        let userSelected = this.userList.filter((row: any) => row.checked);
                        if (userSelected.length) {
                            for (let user of userSelected) {
                                await this.service.deleteUser(user.userId);
                            }
                        }
                        this.hideMessageModal();
                        await this.getUserList();
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
