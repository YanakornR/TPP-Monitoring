import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  _regionKey = "tpp-monitoring-region-info";
  _provinceKey = "tpp-monitoring-province";
  _viewKey = "tpp-monitoring-view";
  _deviceKey = "tpp-monitoring-device";
  _customerIdKey = "tpp-monitoring-customerId";

  _encryptSecretKey = "tpp-monitoring-secret-key";

  constructor() { }

  getByKey(key) {
    if (sessionStorage.getItem(key) != null)
      return this.decryptData(sessionStorage.getItem(key));
    else
      return null;
  }

  getViewByKey(key) {
    if (localStorage.getItem(key) != null)
      return this.decryptData(localStorage.getItem(key));
    else
      return null;
  }

  archiveView(data) {
    localStorage.setItem(this._viewKey, this.encryptData(JSON.stringify(data)));
  }
  
  archiveDevice(data) {
    localStorage.setItem(this._deviceKey, this.encryptData(JSON.stringify(data)));
  }

  archiveRegionId(allInfo) {
    let regions = {};
    allInfo.region.forEach(e => {
      let reg = {
        id: e.regionId,
        status: e.regionStatus
      };
      let name = e.regionName.toLocaleLowerCase().replace(/\s/g, "");
      regions[name] = reg;
    });
    sessionStorage.setItem(this._regionKey, this.encryptData(JSON.stringify(regions)));
  }

  archiveProvinceId(regionInfoData, region) {
    let provinces = {};

    let provinceInfo = this.getByKey(this._provinceKey);
    if (provinceInfo != null) {
      provinces = provinceInfo;
    }
    let province = {};
    regionInfoData.province.forEach(e => {
      let reg = {
        id: e.provinceId,
        status: e.status
      };
      let name = e.provinceName.toLocaleLowerCase();
      province[name] = reg;
    });
    provinces[region] = province;
    sessionStorage.setItem(this._provinceKey, this.encryptData(JSON.stringify(provinces)));
  }

  archiveSiteId(info, region) {
    let provinces = {};
    let provinceInfo = this.getByKey(this._provinceKey);
    if (provinceInfo != null) {
      provinces = provinceInfo;
    }
    if (provinces[region] == null) {
      provinces[region] = {};
    }
    let regionInfo = provinces[region];
    let nameProvince = info.provinceName.toLocaleLowerCase();
    if (regionInfo[nameProvince] == null) {
      regionInfo[nameProvince] = {};
    }
    let province = regionInfo[nameProvince];
    let data = [];
    info.sites.forEach(e => {
      let reg = {
        id: e.siteId,
        status: e.status,
        name: e.siteName.toLocaleLowerCase()
      };
      data.push(reg);
    });
    province['site'] = data;
    regionInfo[nameProvince] = province;
    provinces[region] = regionInfo;
    sessionStorage.setItem(this._provinceKey, this.encryptData(JSON.stringify(provinces)));
  }


  archiveOneSiteId(info) {
    let provinces = {};
    let provinceInfo = this.getByKey(this._provinceKey);
    if (provinceInfo != null) {
      provinces = provinceInfo;
    }
    let region = info.region.toLocaleLowerCase();
    if (provinces[region] == null) {
      provinces[region] = {};
    }
    let regionInfo = provinces[region];
    let nameProvince = info.province.toLocaleLowerCase();
    if (regionInfo[nameProvince] == null) {
      regionInfo[nameProvince] = {
        id: info.provinceId,
        status: 'W'
      };
    }
    let province = regionInfo[nameProvince];
    let data = province['site'];
    if (data == null) {
      data = [];
    }
    if (!this.existsId(info.siteId, data)) {
      let reg = {
        id: info.siteId,
        status: 'W',
        name: info.site.toLocaleLowerCase()
      };
      data.push(reg);
    }
    province['site'] = data;
    regionInfo[nameProvince] = province;
    provinces[region] = regionInfo;
    sessionStorage.setItem(this._provinceKey, this.encryptData(JSON.stringify(provinces)));
  }

  setCustomer(id) {
    sessionStorage.setItem(this._customerIdKey, id);
  }

  getCustomer() {
    return sessionStorage.getItem(this._customerIdKey)
  }

  existsId(id, arr) {
    return arr.some(function (el) {
      return el.id === id;
    });
  }

  encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(data, this._encryptSecretKey).toString();
    } catch (e) {
      console.log(e);
    }
  }

  decryptData(data) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this._encryptSecretKey);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }
}
