import { Component, OnInit, ViewChild } from '@angular/core';
import { EditProfileService } from './edit-profile.service';
import { NotificationsService } from 'angular2-notifications';
import { NavigationService } from '../../service/navigation-service.service';

declare const bootstrap: any;

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

    private _authenticateObj: string = 'tpp-monitoring-authenticate-obj';
    saveModal: any;
    profileFullname: string;
    profileName: string;
    profileRole: string;
    labelProfileRole: string;
    profileAvatar: any;
    profileImg: string;
    profileEmail: string;
    profilePosition: string;
    profileFirstName: string;
    profileLastName: string;
    profilePhone: string;
    profilePassword: string;
    profileConfirmPassword: string;
    profileCurrentPassword: string;
    invalidPassword = false;
    invalidConfirmPassword = false;
    invalidCurrentPassword = false;
    imageEditDisplay: any;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    chooseImageCard: any = '';
    modalEditProfile: any;
    uploadInputFile: any;
    uploadImage: any;
    displayUploadImage: any;
    editForm: any = {
        name: '',
        lastname: '',
        email: '',
        phone: '',
        position: '',
        newPassword: '',
        profilePicture: ''
    }
    checkPassForm: any = {
        currentPassword: ''
    }

    constructor(private service: EditProfileService,
        private notiService: NotificationsService,
        private ns: NavigationService) { }

    ngOnInit(): void {
        this.ns.resetNavigatToProfile();
        this.setUser();
    }

    async ngAfterViewInit() {
        this.saveModal = new bootstrap.Modal(document.getElementById('saveModal'));
        this.modalEditProfile = new bootstrap.Modal(document.getElementById('editImageModal'), { backdrop: 'static', keyboard: false });
    }

    setUser() {
        let obj = sessionStorage.getItem(this._authenticateObj);
        let data = JSON.parse(obj);
        // let name = data.user.fullname.split(/(\s+)/);
        this.profileFullname = data.user.fullname;
        this.profileRole = data.user.role.defaultRoleName;
        this.labelProfileRole = data.user.role.defaultRole;
        this.profileName = data.user.fullname;
        this.profileImg = data.user.avatar;
        this.profileEmail = data.user.email;
        this.profilePosition = data.user.position;
        this.profileFirstName = data.user.firstname;
        this.profileLastName = data.user.lastname;
        this.profilePhone = data.user.phone;
    }

    transformFullname(name): string {
        let fullname: string = '';
        name.forEach((value, index) => {
            if (index === 0) {
                fullname += value.substr(0, 1).toUpperCase() + value.substr(1);
            }
            if (index === 2) {
                fullname += ' ' + value.substr(0, 1).toUpperCase();
            }
        });
        return fullname;
    }

    openModal() {
        this.saveModal.show();
    }

    openEditModal() {
        this.modalEditProfile.show();
    }

    async saveEditProfile() {
        this.invalidCurrentPassword = true;

        this.saveModal.hide();
        if (this.profileCurrentPassword || this.profilePassword || this.profileConfirmPassword) {

            this.checkPassForm.currentPassword = this.profileCurrentPassword;
            var statusPasword = await this.service.checkCurrentPassword(this.checkPassForm.currentPassword);

            if (statusPasword.status == "not match") {
                this.invalidCurrentPassword = true
                this.saveModal.hide();
            } else {
                this.invalidCurrentPassword = false;
                this.saveModal.hide();
            }

            if (this.profilePassword == this.profileConfirmPassword) {
                this.invalidConfirmPassword = false;
                this.invalidPassword = false;
            } else {
                this.invalidConfirmPassword = true;
            }

        }

        this.editForm = {
            name: this.profileFirstName,
            lastname: this.profileLastName,
            email: this.profileEmail,
            phone: this.profilePhone,
            position: this.profilePosition,
            newPassword: (this.profilePassword) ? this.profilePassword : '',
            profilePicture: (this.uploadImage) ? this.uploadImage : '',
        }

        if (!this.invalidPassword && !this.invalidConfirmPassword && !this.invalidCurrentPassword) {
            try {
                var data = await this.service.editProfile(this.editForm);
                if (data.status === 200) {
                    this.saveModal.hide();
                    this.setProfileData(this.editForm);
                    this.notiService.success('ส่งข้อมูลสำเร็จ', 'ส่งข้อมูลสำหรับรีเซ็ตรหัสผ่านสำเร็จ');
                } else {
                    this.saveModal.hide();
                    this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
                }
            } catch (e) {
                this.saveModal.hide();
                console.log(e);
                this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
            }
        }
    }

    fileChangeEvent(event: any) {
        var selectedFile = event.target.files[0];
        this.uploadImage = selectedFile;
        var reader = new FileReader();
        const myImg: any = document.getElementById('myimage') as HTMLImageElement;
        reader.onload = function (event) {
            myImg.src = event.target.result;
        };
        reader.readAsDataURL(selectedFile);
    }

    getNewImage() {
        const myImg: any = document.getElementById('myimage') as HTMLImageElement;
        this.displayUploadImage = (myImg.src) ? myImg.src : null;
        this.modalEditProfile.hide();
    }

    setProfileData(d) {
        const reader = new FileReader();
        let obj = sessionStorage.getItem(this._authenticateObj);
        let data = JSON.parse(obj);
        reader.onload = (e: any) => {
            const bytes = e.target.result.split('base64,')[1];
            data.user.avatar = bytes;
        };
        if (d.profilePicture != '')
            reader.readAsDataURL(d.profilePicture);
        data.user.firstname = this.profileFirstName;
        data.user.lastname = this.profileLastName;
        data.user.fullname = this.profileFirstName + " " + this.profileLastName;
        data.user.email = this.profileEmail;
        data.user.phone = this.profilePhone;
        data.user.position = this.profilePosition;
        sessionStorage.setItem(this._authenticateObj, JSON.stringify(data))
        window.location.reload();

    }
}
