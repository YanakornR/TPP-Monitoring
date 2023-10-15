import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class RoleManagementService {

  constructor(private http: HttpClient, private notiService: NotificationsService) { }

  getRoleList(filterOption: any = { page: 1, limit: 10 }, searchFilter: any) {
    let url = environment.baseUrl + '/management/role?page=' + filterOption.page + '&limit=' + filterOption.limit;
    if(searchFilter != '') {
      url += '&search=' + searchFilter;
    }
    return this.http.get<any>(url).toPromise();
  }

  getRoleMenu() {
    return this.http.get<any>(environment.baseUrl + '/management/role/menu').toPromise();
  }
  
  getDefaultRole(): any {
    // let data = [
    //   { defaultRole : 'M', defaultRoleName : 'MASTER' },
    //   { defaultRole : 'S', defaultRoleName : 'SUPER ADMIN' },
    //   { defaultRole : 'A', defaultRoleName : 'ADMIN' },
    //   { defaultRole : 'U', defaultRoleName : 'USER' }
    // ];
    // return data;
    return this.http.get<any>(environment.baseUrl + '/role/default').toPromise();
  }

  getCompany() {
    return this.http.get<any>(environment.baseUrl + '/management/company').toPromise();
  }

  insertRole(data: any) {
    const formData: any = new FormData();
    for (var key in data) {
      formData.append(key, data[key]);
    }
    return this.http.post<any>(environment.baseUrl + '/management/role/insert', formData).toPromise();
  }

  updateRole(data: any) {
    const formData: any = new FormData();
    for (var key in data) {
      formData.append(key, data[key]);
    }
    return this.http.post<any>(environment.baseUrl + '/management/role/update', formData).toPromise();
  }

  deleteRole(roleId: number) {
    const formData: any = new FormData();
    formData.append('roleId', roleId);
    return this.http.request('delete', environment.baseUrl + '/management/role/delete', { body: formData }).toPromise()
      .catch(err => {
        this.notiService.error("Error roleId : " + roleId, err.error);
      });
  }
}
