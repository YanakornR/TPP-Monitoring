import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PiService {
  private _piUrl: string = environment.baseUrl + '/info/pi/';
  private _NMUrl: string = environment.baseUrl + '/info/nm-module/';
  private _BattUrl: string = environment.baseUrl + '/info/battery/';
  private _EnerUrl: string = environment.baseUrl + '/info/energy-saving';
  private _rectifierUrl: string = environment.baseUrl + '/info/rectifier/';
  '/info/battery/{batteryId}/status'

  constructor(private http: HttpClient) { }

  getPiStatus(id) {
    // return this.http.get<any>(this._piUrl + id + "/status");
    return this.http.get<any>(this._NMUrl + id);
  }

  getLiBatt(id, type) {
    // return this.http.get<any>(this._piUrl + id + '/status/batt');
    return this.http.get<any>(this._BattUrl + 'status?moduleId=' + id + '&moduleType=' + type);
  }

  getLiBattSub(id, no) {
    return this.http.get<any>(this._BattUrl + id + '/status/batt/' + no);
  }

  getEnergy(id, type) {
    // return this.http.get<any>(this._piUrl + id + '/status/energy');
    return this.http.get<any>(this._EnerUrl + '?moduleId=' + id + '&moduleType=' + type);
  }

  saveEnergy(id, data, type) {
    let fullReq = {
      moduleType: type,
      moduleId: id
    }
    let req = {};
    if (data.enable.enegySaveMode)
      req['energySavingMode'] = this.getBooleanStr(data.enegySaveMode);
    if (data.enable.soundAlarm)
      req['soundAlarm'] = this.getBooleanStr(data.soundAlarm);
    if (data.enable.systemReset)
      req['systemReset'] = this.getBooleanStr(data.systemReset);
    if (data.enable.energyConfig) {
      let config = {};
      if (data.enable.config.energySaveStartHour)
        config['energySaveStartHour'] = data.config.energySaveStartHour;
      if (data.enable.config.energySaveStartMin)
        config['energySaveStartMin'] = data.config.energySaveStartMin;
      if (data.enable.config.chargeStartHour)
        config['chargeStartHour'] = data.config.chargeStartHour;
      if (data.enable.config.chargeStartMin)
        config['chargeStartMin'] = data.config.chargeStartMin;
      if (data.enable.config.energyStandbyVoltage)
        config['energyStandbyVoltage'] = data.config.energyStandbyVoltage;
      if (data.enable.config.energyDischVoltage)
        config['energyDischVoltage'] = data.config.energyDischVoltage;
      if (data.enable.config.energySaveSOC)
        config['energySaveSOC'] = data.config.energySaveSOC;
      req['config'] = config;
    }
    req['energySaveDays'] = {
      "monday": this.getBooleanStr(data.days.monday),
      "tuesday": this.getBooleanStr(data.days.tuesday),
      "wednesday": this.getBooleanStr(data.days.wednesday),
      "thursday": this.getBooleanStr(data.days.thursday),
      "friday": this.getBooleanStr(data.days.friday),
      "saturday": this.getBooleanStr(data.days.saturday),
      "sunday": this.getBooleanStr(data.days.sunday)
    }
    fullReq['config'] = req;
    console.log(fullReq);
    return this.http.post(this._EnerUrl + '/update', fullReq, { responseType: 'text' });
  }
  
  getBooleanStr(type) {
    return type === true ? 'on' : 'off';
}

  getPiStatusBatt(battId) {
    return this.http.get<any>(environment.baseUrl + '/info/battery/' + battId + '/status');
  }

  getPiEvaluate(id, option) {
    return this.http.get<any>(this._piUrl + id + "/evaluate");
    // return this.http.get<any>(this._piUrl + id + "/evaluate?option=" + option);
  }

  getRectifierStatus(id) {
    return this.http.get<any>(this._rectifierUrl + id + "/status");
  }
}
