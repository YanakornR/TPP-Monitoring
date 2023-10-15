import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountLevelService {

  constructor(private http: HttpClient) { }

  getCompanyList() {
    let url = environment.baseUrl + '/management/company';
    return this.http.get<any>(url).toPromise();
  }

  insertCompany(data: any) {
    const formData: any = new FormData();
    for (var key in data) {
      formData.append(key, data[key]);
    }
    return this.http.post<any>(environment.baseUrl + '/management/company/insert', formData).toPromise();
  }

  updateCompany(data: any) {
    const formData: any = new FormData();
    for (var key in data) {
      formData.append(key, data[key]);
    }
    return this.http.post<any>(environment.baseUrl + '/management/company/update', formData).toPromise();
  }

  deleteCompany(companyId: number, password: string) {
    console.log(password);
    const formData: any = new FormData();
    formData.append('companyId', companyId);
    formData.append('password', password);
    return this.http.request('delete', environment.baseUrl + '/management/company/delete', { body: formData }).toPromise();
  }
}
