import { Component, OnInit } from '@angular/core';

declare const bootstrap: any;

@Component({
  selector: 'app-energy-saving',
  templateUrl: './energy-saving.component.html',
  styleUrls: ['./energy-saving.component.css']
})
export class EnergySavingComponent implements OnInit {

  isDay: boolean = true;
  isMonth: boolean = false;
  isYear: boolean = false;
  isLifetime: boolean = false;

  isReDay: boolean = true;
  isReMonth: boolean = false;
  isReYear: boolean = false;
  isReLifetime: boolean = false;

  currentDate: string = null;
  revenueDate: string = null;

  filterModal: any;

  listOfRegion = ['Northern', 'Central', 'Western', 'Northeastern', 'Eastern', 'Southern'];
  listOfRegionSelectedValue: string[] = [];

  listOfSubRegion = [
    {
      region: 'Northern',
      subRegion: ['Upper Northern', 'Center Northern', 'Lower Northern']
    },
    {
      region: 'Central',
      subRegion: ['Upper Central', 'Center Central', 'Lower Central']
    }
  ];

  subRegionValue: string = '';
  listOfSubRegionSelected: string[] = [];
  listOfSubRegionSelectedValue: string[] = [];

  listOfProvince = [
    {
      provinceId: 1,
      provinceName: 'Prachin Buri'
    },
    {
      provinceId: 2,
      provinceName: 'Pathum thani'
    },
    {
      provinceId: 3,
      provinceName: 'Phetchabun'
    },
    {
      provinceId: 4,
      provinceName: 'Phitsanulok'
    },
    {
      provinceId: 5,
      provinceName: 'Nakorn Sawan'
    }
  ];
  listOfProvinceSelectedValue: string[] = [];

  listOfSite = [
    {
      siteId: 1,
      siteName: 'AN-SKW-09'
    },
    {
      siteId: 2,
      siteName: 'AN-SKW-10'
    },
    {
      siteId: 3,
      siteName: 'AN-SKW-11'
    },
    {
      siteId: 4,
      siteName: 'AN-SKW-12'
    },
    {
      siteId: 5,
      siteName: 'AN-SKW-13'
    },
    {
      siteId: 6,
      siteName: 'AN-SKW-14'
    },
    {
      siteId: 7,
      siteName: 'AN-SKW-15'
    },
    {
      siteId: 8,
      siteName: 'AN-SKW-16'
    },
    {
      siteId: 9,
      siteName: 'AN-SKW-17'
    },
    {
      siteId: 10,
      siteName: 'AN-SKW-18'
    }
  ];
  listOfSiteSelectedValue: string[] = [];

  periodValue = [10, 90];
  minVal = null;
  maxVal = null;

  constructor() { }

  ngOnInit(): void {
    this.currentDate = new Date().toISOString().split('T')[0];
    this.revenueDate = new Date().toISOString().split('T')[0];
  }

  async ngAfterViewInit() {
    this.filterModal = new bootstrap.Modal(document.getElementById('filterEnergyModal'));
  }

  setGraph(mode: string) {
    this.isDay = false;
    this.isMonth = false;
    this.isYear = false;
    this.isLifetime = false;

    if (mode == "DAY") {
      this.isDay = true;
    } else if (mode == "MONTH") {
      this.isMonth = true;
    } else if (mode == "YEAR") {
      this.isYear = true;
    } else if (mode == "LIFETIME") {
      this.isLifetime = true;
    }
  }

  setGraphRevenue(mode: string) {
    this.isReDay = false;
    this.isReMonth = false;
    this.isReYear = false;
    this.isReLifetime = false;

    if (mode == "DAY") {
      this.isReDay = true;
    } else if (mode == "MONTH") {
      this.isReMonth = true;
    } else if (mode == "YEAR") {
      this.isReYear = true;
    } else if (mode == "LIFETIME") {
      this.isReLifetime = true;
    }
  }

  checkDate() {
    console.log(this.currentDate);
  }

  checkDateRevenue() {
    console.log(this.revenueDate);
  }

  openFilterEnergyModal() {
    this.filterModal.show();
  }

  resetFilter() {

  }

  submitFilter() {
    this.filterModal.hide();
  }

  isNotRegionSelected(value: string): boolean {
    return this.listOfRegionSelectedValue.indexOf(value) === -1;
  }

  isNotSubRegionSelected(value: string): boolean {
    return this.listOfSubRegionSelectedValue.indexOf(value) === -1;
  }

  isNotProvinceSelected(value: string): boolean {
    return this.listOfProvinceSelectedValue.indexOf(value) === -1;
  }

  isNotSiteSelected(value: string): boolean {
    return this.listOfSiteSelectedValue.indexOf(value) === -1;
  }

  selectSubRegion(val: any) {
    console.log(val)
    this.listOfSubRegion.forEach(s => {
      if (s.region == val)
        this.listOfSubRegionSelected = s.subRegion;
    });
  }
}