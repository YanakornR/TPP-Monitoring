import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Auth } from './auth';
import { NotificationsService } from 'angular2-notifications';
import { SessionService } from '../modules/main/service/session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwtJTI: any;
  private jwtHelper: JwtHelperService = new JwtHelperService();

  private _authUrl: string = environment.loginUrl;
  private _passUrl: string = environment.resetUrl;
  private _updateUrl: string = environment.updateUrl;
  private _viewKey: string = "tpp-monitoring-view";
  private _authenticateObj: string = 'tpp-monitoring-authenticate-obj';
  private _accessTokenKey: string = 'tpp-monitoring-authenticate-access-token';

  constructor(
    private router: Router,
    private http: HttpClient,
    private notiService: NotificationsService,
    private sessionService: SessionService
  ) { }

  public get isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  login(username: string, password: string): Observable<any> {
    let authorizationData = 'Basic ' + window.btoa(username + ':' + password);

    let headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": authorizationData
    });


    let urlencoded = new URLSearchParams();
    urlencoded.append("username", username);
    urlencoded.append("password", password);

    const postObservable = this.http.post<Auth>(this._authUrl, urlencoded.toString(), { headers: headers });

    const subject = new ReplaySubject<any>(1);
    subject.subscribe((res: Auth) => {
      sessionStorage.setItem(this._authenticateObj, JSON.stringify(res))
      // // set default 
      // let obj = sessionStorage.getItem(this._authenticateObj);
      // let data = JSON.parse(obj);
      // data.user.role.defaultRole = 'M';
      // data.user.role.defaultRoleName = 'MASTER';
      // sessionStorage.setItem(this._authenticateObj, JSON.stringify(data))

      this.setView();
      this.setAccessToken(res.accessToken);
      if (res.accessToken != null)
        this.jwtJTI = this.jwtHelper.decodeToken(res.accessToken).jti;
    }, (err) => {
      console.log(err);
      this.notiService.error('ไม่สามารถเข้าสู่ระบบได้', 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง')
      this.handleAuthenticationError(err);
    });
    postObservable.subscribe(subject);
    return subject;
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  setView() {
    let obj = sessionStorage.getItem(this._authenticateObj);
    let data = JSON.parse(obj);
    this.sessionService.setCustomer(data.user.companyId);
    let item = this.sessionService.getByKey(this._viewKey);
    let body = {};
    if (item === null || Number.isNaN(item)) {
      item = {};
      body = {
        province: 'icon',
        site: 'icon'
      }
      item[data.user.id] = body;
    } else {
      let info = item[data.user.id];
      if (info === null || Number.isNaN(info)) {
        item = {};
        body = {
          province: 'icon',
          site: 'icon'
        }
        item[data.user.id] = body;
      }
    }
    this.sessionService.archiveView(item);
  }

  resetPassword(user: string) {
    const formData = new FormData();
    formData.append('email', user);
    return this.http.post<any>(this._passUrl, formData);
  }

  firstLogin(userId: string, username: string, newPassword: string) {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('username', username);
    formData.append('newPassword', newPassword);
    return this.http.post<any>(this._updateUrl, formData);
  }

  getAccessToken() {
    return sessionStorage.getItem(this._accessTokenKey);
  }

  private handleAuthenticationError(err: any) {
    this.setAccessToken(null);
  }

  private setAccessToken(accessToken: string) {
    if (!accessToken) {
      sessionStorage.removeItem(this._accessTokenKey);
    } else {
      sessionStorage.setItem(this._accessTokenKey, accessToken);
    }
  }
}
