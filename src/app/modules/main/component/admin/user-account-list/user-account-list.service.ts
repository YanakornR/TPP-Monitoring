import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
    providedIn: 'root'
})
export class UserAccountListService {

    constructor(private http: HttpClient, private notiService: NotificationsService) { }

    getUserList(filterOption: any = { page: 1, limit: 10 }, search: any) {
        let url = environment.baseUrl + '/management/user?page=' + filterOption.page + '&limit=' + filterOption.limit;
        for (let roleId of filterOption.roleId) {
            url += '&roleId=' + roleId;
        }
        if (search) {
            url += '&search=' + search;
        }
        return this.http.get<any>(url).toPromise();
    }

    getRoleList(companyId: any) {
        return this.http.get<any>(environment.baseUrl + '/management/role/menu?companyId=' + companyId).toPromise();
    }

    getCompanyList() {
        return this.http.get<any>(environment.baseUrl + '/management/company').toPromise();
    }

    getRegionList() {
        return this.http.get<any>(environment.baseUrl + '/management/region').toPromise();
    }

    insertUser(data: any) {
        const formData: any = new FormData();
        for (var key in data) {
            if (key != 'province') {
                formData.append(key, data[key]);
            }
        }
        return this.http.post<any>(environment.baseUrl + '/management/user/insert', formData).toPromise().catch(err => {
            this.notiService.error('Cannot Add User', err.error);
        });;
    }

    updateUser(data: any) {
        const formData: any = new FormData();
        for (var key in data) {
            if (key != 'province') {
                formData.append(key, data[key]);
            }
        }
        return this.http.post<any>(environment.baseUrl + '/management/user/update', formData).toPromise().catch(err => {
            this.notiService.error("Error userId : " + data.userId, err.error);
        });;
    }

    deleteUser(userId: number) {
        const formData: any = new FormData();
        formData.append('userId', userId);
        return this.http.post<any>(environment.baseUrl + '/management/user/delete', formData).toPromise();
    }

    exportUser(): any {
        return this.http.get(environment.baseUrl + '/management/user/export', { responseType: 'blob' }).toPromise();
    }

    getDefaultRole(): any {
        return this.http.get<any>(environment.baseUrl + '/role/default').toPromise();
    }
}
