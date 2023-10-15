import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { PiService } from '../../service/pi.service';
import { NotificationsService } from 'angular2-notifications';
import { NavigationService } from '../../service/navigation-service.service';
import { FormControl, Validators } from '@angular/forms';
import { SessionService } from '../../service/session.service';
import { SiteService } from '../../service/site.service';
declare var jQuery: any;

declare const bootstrap: any;

@Component({
    selector: 'app-evaluate',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
    filtersLoaded: Promise<boolean>;

    _deviceKey = "tpp-monitoring-device";

    region: string;
    province: string;
    site: string;
    pi: string;
    lat = '13.8591';
    lng = '100.5217';
    mobile: boolean;
    moblieChart: boolean;

    isFirst: boolean = true;
    isNMModule: boolean = false;
    isRectifier: boolean = false;
    isLiBattery: boolean = false;
    isStatus: boolean = false;
    isEvaluate: boolean = false;
    isEnergySaving: boolean = false;
    isSubLiBattery: boolean = false;

    isBatt2: boolean = false;
    isBatt3: boolean = false;
    isBatt4: boolean = false;

    buttonRight: any;
    buttonLeft: any;
    gotoMapModal: any;
    @ViewChild('myCanvas', { static: true }) canvas: ElementRef;

    isBatteryNo: any = 1;
    selectData = 2;
    time = '';
    deviceName: any;
    siteId: any;
    piId: any;
    regionId: any;
    provinceId: any;
    piInfo: any;
    evaluateInfo: any;
    siteInfo: any;
    battInfo: any;
    battInfoSize: any;
    rectifierInfo: any;
    subLiBattery: any;
    subLiCellVolt: any;
    energySaving: any;

    energyCon = [0, 0, 0, 0, 42, 50, 0];
    energyConfigControl: any;

    mode: any;
    map: any;

    regionBackup: string[] = ['central', 'northern', 'southern', 'eastern', 'northeastern', 'western'];

    constructor(private ar: ActivatedRoute, private piService: PiService,
        private notiService: NotificationsService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private ns: NavigationService,
        private sessionService: SessionService,
        private siteService: SiteService) { }

    ngOnInit(): void {
        let type = 'nmmodule';
        this.activeRoute.paramMap.subscribe((params: ParamMap) => {
            this.siteId = params.get('siteId');
            this.provinceId = params.get('provinceId');
            this.regionId = params.get('regionId');
            this.piId = params.get('piId');
            type = params.get('type');
        });

        let item = this.sessionService.getViewByKey(this._deviceKey);
        let device = item[type][this.piId];
        this.deviceName = device.name;

        if (type === 'nmmodule')
            this.mode = 'N';
        else
            this.mode = 'R';

        this.gotoMapModal = new bootstrap.Modal(document.getElementById('gotoMapModal'));

        this.initialiseInvites();
        this.getInfo();
        this.ns.addSummaryNavigat('summary');

        this.buttonRight = document.getElementById('slideRight');
        this.buttonLeft = document.getElementById('slideLeft');

        this.energyConfigControl = new FormControl("", [Validators.max(23), Validators.min(0)])

        if (window.innerWidth <= 1200) {
            this.mobile = true;
        } else {
            this.mobile = false;
        }

        if (window.innerWidth <= 992) {
            this.moblieChart = true;
        } else {
            this.moblieChart = false;
        }
    }

    back() {
        let path = '/region/' + this.region.toLocaleLowerCase() + '/' + this.province.toLocaleLowerCase() + '/' + this.site.toLocaleLowerCase();
        this.router.navigate([path]);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if (window.innerWidth <= 1200) { // 1280px portrait
            this.mobile = true;
        } else {
            this.mobile = false;
        }

        if (window.innerWidth <= 992) {
            this.moblieChart = true;
        } else {
            this.moblieChart = false;
        }
    }

    getInfo() {
        this.siteService.getSite(this.siteId).subscribe(
            data => {
                this.siteInfo = data;
                // this.ns.addSummaryNavigat({siteId : this.siteId, piId : this.piId, provinceId: this.provinceId, regionId: this.regionId});
                if (this.mode === 'N') {
                    this.setShowMode('NM Module');
                } else {
                    this.setShowMode('Rectifier');
                }
                this.map = data.map;
                this.getLiBatt();
                this.setMap();
                this.filtersLoaded = Promise.resolve(true);
            },
            (err) => {
                if (err.status != 401) {
                    this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
                }
            });
        // this.piService.getPiStatus(this.piId).subscribe(
        //     data => {
        //         this.piInfo = data;
        //         console.log(this.mode);
        //         if (this.mode === 'N') {
        //             this.setShowMode('NM Module');
        //         } else {
        //             this.setShowMode('Rectifier');
        //         }
        //         this.getLiBatt();
        //         this.setMap();
        //     }, (err) => {
        //         if (err.status != 401) {
        //             this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
        //         }
        //     });
    }

    getRectifierInfo(rectfierId: any) {
        this.piService.getRectifierStatus(rectfierId).subscribe(
            data => {
                this.rectifierInfo = data;
            }, (err) => {
                if (err.status != 401) {
                    this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
                }
            });
    }

    getLiBatt() {
        let type = this.mode === 'N' ? 'NMModule' : 'Rectifier';
        this.piService.getLiBatt(this.piId, type).subscribe(
            data => {
                this.battInfo = data.batteryList;
                let i = 1;
                this.battInfo.forEach(e => {
                    e.no = i;
                    i = i + 1;
                });
                let size = this.battInfo.length;
                this.battInfoSize = [];
                for (let i = 1; i <= size; i++) {
                    this.battInfoSize.push(i);
                }
                if (size > 4)
                    this.isBatt2 = true;
                if (size > 8)
                    this.isBatt3 = true;
                if (size > 12)
                    this.isBatt4 = true;
                for (let i = size + 1; i <= 16; i++) {
                    let data = {
                        no: i,
                        address: "-",
                        busCurrent: 0,
                        busVoltage: 0,
                        current: 0,
                        energySaving: false,
                        soc: 0,
                        soh: 0,
                        voltage: 0
                    }
                    this.battInfo.push(data);
                }
            }, (err) => {
                if (err.status != 401) {
                    this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
                }
            });
    }

    setMap() {
        let map = this.map;
        // map = map.replaceAll('°', '');
        // map = map.replace(/\s/g, '')
        // map = map.replace('N', '');
        // map = map.replace('E', '');
        map = map.split(",");
        this.lat = map[0];
        this.lng = map[1];
    }

    initialiseInvites() {
        if (this.ar.snapshot.params.region) {
            this.region = this.ar.snapshot.params.region;
        }
        if (this.ar.snapshot.params.province) {
            this.province = this.ar.snapshot.params.province;
        }
        if (this.ar.snapshot.params.site) {
            this.site = this.ar.snapshot.params.site;
        }
        if (this.ar.snapshot.params.pi) {
            this.pi = this.ar.snapshot.params.pi;
        }
    }

    setShowMode(mode: string) {
        this.isNMModule = false;
        this.isRectifier = false;
        this.isStatus = false;
        this.isLiBattery = false;
        this.isEvaluate = false;
        this.isEnergySaving = false;
        this.isSubLiBattery = false;

        if (mode == "NM Module") {
            this.getPi();
            this.isNMModule = true;
        } else if (mode == "Rectifier") {
            this.getRectifierInfo(this.piId);
            this.isRectifier = true;
        } else if (mode == "LiBattery") {
            this.getLiBatt();
            this.isLiBattery = true;
        } else if (mode == "SubLiBattery") {
            this.isSubLiBattery = true;
        } else if (mode == "Evaluate") {
            this.isEvaluate = true;
        } else if (mode == "Energy Saving") {
            this.getEnergy();
            this.isEnergySaving = true;
        }
    }

    getPi() {
        this.piService.getPiStatus(this.piId).subscribe(
            data => {
                this.piInfo = data;
            }, (err) => {
                if (err.status != 401) {
                    this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
                }
            });
    }

    setBatteryNo(no: any) {
        this.isBatteryNo = no;
        this.getSubLiBattery(no);
        console.log('Battery No => ' + this.isBatteryNo)
    }

    openSubLiBattery(no: string) {
        this.isBatteryNo = Number(no);
        this.getSubLiBattery(no);
        this.setShowMode('SubLiBattery');
    }

    getSubLiBattery(no: string) {
        this.piService.getLiBattSub(this.piId, no).subscribe(
            data => {
                this.subLiBattery = data;
                this.subLiCellVolt = {};
                let maxIndex = 0;
                let minIndex = 0;
                let max = -1;
                let min = 5000;
                this.subLiCellVolt.data = this.subLiBattery.cellVoltage;
                this.subLiCellVolt.data.sort((a, b) => (a.no - b.no));
                let size = this.subLiBattery.cellVoltage.length;
                this.barChartLabels = [];
                this.vcellData = [];
                this.targetData = [];
                for (let i = 0; i < size; i++) {
                    let d = this.subLiBattery.cellVoltage[i];
                    if (min > d.vcell) {
                        min = d.vcell;
                        minIndex = i;
                    }
                    if (max < d.vcell) {
                        max = d.vcell;
                        maxIndex = i;
                    }
                    this.barChartLabels.push('Vcell' + d.no);
                    this.vcellData.push(d.vcell);
                    this.targetData.push(d.target);
                }
                this.subLiCellVolt.max = max;
                this.subLiCellVolt.min = min;
                this.subLiCellVolt.maxIndex = maxIndex;
                this.subLiCellVolt.minIndex = minIndex;

                for (let i = size + 1; i <= 16; i++) {
                    let data = {
                        no: i,
                        target: 0,
                        vcell: 0
                    }
                    this.subLiCellVolt.data.push(data);
                }

                this.barChartData = [
                    {
                        data: this.targetData
                        , label: 'Target'
                        , type: 'line'
                        , borderWidth: 2
                    },
                    {
                        data: this.vcellData
                        , label: 'Vcell'
                        , stack: 'a'
                    }
                ];
                this.initBegin();
                console.log(this.subLiCellVolt);
            }, (err) => {
                if (err.status != 401) {
                    this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
                }
            });
    }

    getEnergy() {
        // let data = {
        //     "enegySaveMode": true,
        //     "soundAlarm": false,
        //     "systemReset": true,
        //     "days": {
        //         "monday": true,
        //         "tuesday": true,
        //         "wednesday": false,
        //         "thursday": true,
        //         "friday": true,
        //         "saturday": true,
        //         "sunday": true
        //     },
        //     "config": {
        //         "energySaveStartHour": 20,
        //         "energySaveStartMin": 20,
        //         "chargeStartHour": 20,
        //         "chargeStartMin": 20,
        //         "energyStandbyVoltage": 10,
        //         "energyDischVoltage": 10,
        //         "energySaveSOC": 90
        //     }
        // };
        let type = this.mode === 'N' ? 'NMModule' : 'Rectifier';
        this.piService.getEnergy(this.piId, type).subscribe(
            data => {
                let config = data;
                let d = {
                    "enegySaveMode": this.getBoolean(config.energySavingMode),
                    "soundAlarm": this.getBoolean(config.soundAlarm),
                    "systemReset": this.getBoolean(config.systemReset),
                    "days": {
                        "monday": this.getBoolean(config.monday),
                        "tuesday": this.getBoolean(config.tuesday),
                        "wednesday": this.getBoolean(config.wednesday),
                        "thursday": this.getBoolean(config.thursday),
                        "friday": this.getBoolean(config.friday),
                        "saturday": this.getBoolean(config.saturday),
                        "sunday": this.getBoolean(config.sunday)
                    },
                    "config": {
                        "energySaveStartHour": parseInt(config.energySaveStartHour),
                        "energySaveStartMin": parseInt(config.energySaveStartMinute),
                        "chargeStartHour": parseInt(config.chargeStartHour),
                        "chargeStartMin": parseInt(config.chargeStartMinute),
                        "energyStandbyVoltage": parseInt(config.energyStandbyVoltage),
                        "energyDischVoltage": parseInt(config.energyDischCurrent),
                        "energySaveSOC": parseInt(config.energySaveSOC)
                    }
                };
                this.energySaving = d;
                this.energySaving.enable = {
                    "enegySaveMode": true,
                    "soundAlarm": true,
                    "systemReset": true,
                    "energyConfig": true,
                    "config": {
                        "energySaveStartHour": true,
                        "energySaveStartMin": true,
                        "chargeStartHour": true,
                        "chargeStartMin": true,
                        "energyStandbyVoltage": true,
                        "energyDischVoltage": true,
                        "energySaveSOC": true
                    }
                }
                this.energyCon = [];
                this.energyCon.push(this.energySaving.config.energySaveStartHour);
                this.energyCon.push(this.energySaving.config.energySaveStartMin);
                this.energyCon.push(this.energySaving.config.chargeStartHour);
                this.energyCon.push(this.energySaving.config.chargeStartMin);
                this.energyCon.push(this.energySaving.config.energyStandbyVoltage);
                this.energyCon.push(this.energySaving.config.energyDischVoltage);
                this.energyCon.push(this.energySaving.config.energySaveSOC);
        
                let alldays = true;
                Object.values(this.energySaving.days).forEach(val => (val == false ? alldays = false : ''));
                this.energySaving.alldays = alldays ? true : false;
            }, (err) => {
                console.log(err)
                if (err.status != 401) {
                    this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
                }
            });
    }

    getBoolean(type) {
        return type === 'on' ? true : false;
    }

    gotoGoogleMaps() {
        this.gotoMapModal.show();
    }

    handleMinus(no: any, min: number, max: number) {
        if (this.energyCon[no] - 1 >= min)
            this.energyCon[no] = this.energyCon[no] - 1;
        if (this.energyCon[no] > max)
            this.energyCon[no] = max;
    }

    handlePlus(no: any, min: number, max: number) {
        if (this.energyCon[no] + 1 <= max)
            this.energyCon[no] = this.energyCon[no] + 1;
        if (this.energyCon[no] < min)
            this.energyCon[no] = min;
    }

    handleChangeEneryCon(val: any, no: any, min: number, max: number) {
        if (val >= min && val <= max) {
            this.energyCon[no] = val;
        } else {
            if (val < min)
                this.energyCon[no] = min;
            if (val > max)
                this.energyCon[no] = max;
        }
    }

    selectDays(all: any) {
        if (all === 'Y') {
            if (this.energySaving.alldays) {
                this.energySaving.days.monday = true;
                this.energySaving.days.tuesday = true;
                this.energySaving.days.wednesday = true;
                this.energySaving.days.thursday = true;
                this.energySaving.days.friday = true;
                this.energySaving.days.saturday = true;
                this.energySaving.days.sunday = true;
            } else {
                this.energySaving.days.monday = false;
                this.energySaving.days.tuesday = false;
                this.energySaving.days.wednesday = false;
                this.energySaving.days.thursday = false;
                this.energySaving.days.friday = false;
                this.energySaving.days.saturday = false;
                this.energySaving.days.sunday = false;
            }
        } else {
            let alldays = true;
            Object.values(this.energySaving.days).forEach(val => (val == false ? alldays = false : ''));
            this.energySaving.alldays = alldays;
        }
    }

    saveConfig() {
        let type = this.mode === 'N' ? 'NMModule' : 'Rectifier';
        this.piService.saveEnergy(this.piId, this.energySaving, type).subscribe(
            data => {
                console.log('data => ' + data)
                this.notiService.success("สถานะการบันทึกข้อมูล", "สำเร็จ");
        });
    }

    // Chart
    public barChartOptions: ChartOptions = {
        responsive: true,
        elements: {
            line: {
                fill: false
            }
        },
        animation: {
            animateScale: true,
            animateRotate: true
        },
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                boxWidth: 8,
                usePointStyle: true
            }
        },
        scales: {
            xAxes: [{
                stacked: false,
                gridLines: {
                    display: false,
                },
                ticks: {
                    fontSize: 9,
                    autoSkip: false,
                    maxRotation: 90,
                    minRotation: 90,
                    fontFamily: 'Roboto',
                    fontColor: '#666666'
                }
            }],
            yAxes: [{
                ticks: {
                    min: 0,
                    stepSize: 1000,
                    fontSize: 9,
                    fontFamily: 'Roboto',
                    fontColor: '#666666'
                },
                stacked: false,
                gridLines: {
                    display: true,
                    color: '#E7E7E7'
                }
            }]
        }
    };
    public barChartType: ChartType = 'bar';
    public barChartLegend = true;

    targetData = [];
    vcellData = [];
    public barChartData: ChartDataSets[] = [
        {
            data: this.targetData
            , label: 'Target'
            , type: 'line'
            , borderWidth: 2
        },
        {
            data: this.vcellData
            , label: 'Vcell'
            , stack: 'a'
        }
    ];
    public barChartLabels: string[] = [];

    public chartColors: Array<any> = [];


    // events
    public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
        // console.log(event, active);
    }

    public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
        // console.log(event, active);
    }

    initBegin() {
        this.chartColors = [
            { // first color
                borderColor: '#00F883',
                pointBackgroundColor: '#F43A00',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#F74F32',
                pointHoverBorderColor: 'rgba(225,10,24,0.2)'
            },
            { // second color
                backgroundColor: '#4FBBE9',
                borderColor: '#fff',
                pointBackgroundColor: '#F43A00',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#4FBBE9',
                pointHoverBorderColor: 'rgba(225,10,24,0.2)'
            }
        ];

        (function ($) {
            $(document).ready(function () {
                var itemsMainDiv = ('.MultiCarousel');
                var itemsDiv = ('.MultiCarousel-inner');
                var itemWidth = 0;

                $('.leftLst, .rightLst').click(function () {
                    var condition = $(this).hasClass("leftLst");
                    if (condition)
                        click(0, this);
                    else
                        click(1, this)
                });

                ResCarouselSize();




                $(window).resize(function () {
                    ResCarouselSize();
                });

                //this function define the size of the items
                function ResCarouselSize() {
                    var incno = 0;
                    var dataItems = ("data-items");
                    var itemClass = ('.item');
                    var id = 0;
                    var btnParentSb = '';
                    var itemsSplit: any;
                    var sampwidth = $(itemsMainDiv).width();
                    var bodyWidth = $('body').width();
                    $(itemsDiv).each(function () {
                        id = id + 1;
                        var itemNumbers = $(this).find(itemClass).length;
                        btnParentSb = $(this).parent().attr(dataItems);
                        itemsSplit = btnParentSb.split(',');
                        $(this).parent().attr("id", "MultiCarousel" + id);


                        if (bodyWidth >= 1200) {
                            incno = itemsSplit[3];
                            itemWidth = sampwidth / incno;
                        }
                        else if (bodyWidth >= 992) {
                            incno = itemsSplit[2];
                            itemWidth = sampwidth / incno;
                        }
                        else if (bodyWidth >= 768) {
                            incno = itemsSplit[1];
                            itemWidth = sampwidth / incno;
                        }
                        else {
                            incno = itemsSplit[0];
                            itemWidth = sampwidth / incno;
                        }
                        $(this).css({ 'transform': 'translateX(0px)', 'width': 140 * itemNumbers });
                        $(this).find(itemClass).each(function () {
                            $(this).outerWidth(140);
                        });

                        $(".leftLst").addClass("over");
                        $(".rightLst").removeClass("over");

                    });
                }


                //this function used to move the items
                function ResCarousel(e, el, s) {
                    var leftBtn = ('.leftLst');
                    var rightBtn = ('.rightLst');
                    var translateXval = 0;
                    var divStyle = $(el + ' ' + itemsDiv).css('transform');
                    var values = divStyle.match(/-?[\d\.]+/g);
                    var xds = Math.abs(values[4]);
                    if (e == 0) {
                        translateXval = (xds) - (itemWidth * s);
                        $(el + ' ' + rightBtn).removeClass("over");

                        if (translateXval <= itemWidth / 2) {
                            translateXval = 0;
                            $(el + ' ' + leftBtn).addClass("over");
                        }
                    }
                    else if (e == 1) {
                        var itemsCondition = $(el).find(itemsDiv).width() - $(el).width();
                        translateXval = (xds) + (itemWidth * s);
                        $(el + ' ' + leftBtn).removeClass("over");

                        if (translateXval >= itemsCondition - itemWidth / 2) {
                            translateXval = itemsCondition;
                            $(el + ' ' + rightBtn).addClass("over");
                        }
                    }
                    $(el + ' ' + itemsDiv).css('transform', 'translateX(' + -translateXval + 'px)');
                }

                //It is used to get some elements from btn
                function click(ell, ee) {
                    var Parent = "#" + $(ee).parent().attr("id");
                    var slide = $(Parent).attr("data-slide");
                    ResCarousel(ell, Parent, slide);
                }

            });
        })(jQuery);
    }
}
