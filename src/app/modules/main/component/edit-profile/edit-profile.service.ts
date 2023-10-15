import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EditProfileService {

  constructor(private http: HttpClient) { }

  editProfile(data: any) {
    const formData: any = new FormData();
    for (var key in data) {
      formData.append(key, data[key]);
    }
    return this.http.post<any>(environment.baseUrl + '/profile/update', formData).toPromise();
  }

  checkCurrentPassword(data: any) {
    const formData: any = new FormData();
    formData.append('currentPassword', data);
    return this.http.post<any>(environment.baseUrl + '/check/currentpassword', formData).toPromise();
  }

}
