import { identifierModuleUrl } from '@angular/compiler';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { PiService } from '../../service/pi.service';
import { NotificationsService } from 'angular2-notifications';
declare var jQuery: any;

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit, AfterViewInit {
  filtersLoaded: Promise<boolean>;

  region: string;
  province: string;
  site: string;
  pi: string;

  @ViewChild('myCanvas', { static: true }) canvas: ElementRef;
  element: HTMLElement;
  statusEle: string;

  piInfo: any = {};
  piInfoBatt: any = {};

  status = "A";
  statusw = "W";
  statusr = "R";
  statusc = "C";
  statusi = "I";

  mobile: boolean;

  lat;
  lng;

  max;
  min;
  vcell: string[] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

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
          fontFamily: 'Prompt-Light',
          fontColor: '#666666'
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          stepSize: 1.0,
          fontSize: 9,
          fontFamily: 'Prompt-Light',
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
  public barChartLabels: string[] = ['Vcell1', 'Vcell2', 'Vcell3', 'Vcell4', 'Vcell5', 'Vcell6', 'Vcell7', 'Vcell8', 'Vcell9', 'Vcell10', 'Vcell11', 'Vcell12', 'Vcell13', 'Vcell14', 'Vcell15', 'Vcell16'];

  public chartColors: Array<any> = [];

  constructor(private ar: ActivatedRoute,
    private router: Router, private piService: PiService,
    private notiService: NotificationsService) { }

  ngOnInit(): void {
    this.initialiseInvites();
    this.searchData(true);

    if (window.innerWidth <= 1200) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }

  }

  ngAfterViewInit() {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth <= 1200) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
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

  searchData(status: boolean = false) {
    this.piService.getPiStatus(this.pi).subscribe(
      data => {
        this.piInfo = data;
        this.setMap();
        if (status) {
          this.piService.getPiStatusBatt(this.piInfo.battery[0].batteryId).subscribe(
            data => {
              this.piInfoBatt = data;
              this.setZeroForNull();
              this.statusEle = this.piInfo.battery[0].status;
              this.setChartData();
              if (status) {
                this.calMaxMin();
                this.initBegin();
                this.filtersLoaded = Promise.resolve(true);
              }
            },
            (err) => {

            });
        }
      },
      (err) => {
        if (err.status != 401) {
          this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
        }
      });
  }

  setZeroForNull() {
    if (this.piInfoBatt.temperature.length === 0) {
      let data = {
        "envT": 0,
        "mosT": 0,
        "tcell1": 0,
        "tcell2": 0,
        "tcell3": 0,
        "tcell4": 0
      };
      this.piInfoBatt.temperature[0] = data;
    }
    if (this.piInfoBatt.packInformation.length === 0) {
      let data = {
        "packVoltage": 0.0,
        "packCurrent": 0.0,
        "soc": 0,
        "soh": 0,
        "remainCapacity": 0,
        "fullCapacity": 0
      };
      this.piInfoBatt.packInformation[0] = data;
    }
    if (this.piInfoBatt.cellVoltage.length === 0) {
      let data = {
        "vcell1": {
          "target": 0,
          "vcell": 0
        },
        "vcell2": {
          "target": 0,
          "vcell": 0
        },
        "vcell3": {
          "target": 0,
          "vcell": 0
        },
        "vcell4": {
          "target": 0,
          "vcell": 0
        },
        "vcell5": {
          "target": 0,
          "vcell": 0
        },
        "vcell6": {
          "target": 0,
          "vcell": 0
        },
        "vcell7": {
          "target": 0,
          "vcell": 0
        },
        "vcell8": {
          "target": 0,
          "vcell": 0
        },
        "vcell9": {
          "target": 0,
          "vcell": 0
        },
        "vcell10": {
          "target": 0,
          "vcell": 0
        },
        "vcell11": {
          "target": 0,
          "vcell": 0
        },
        "vcell12": {
          "target": 0,
          "vcell": 0
        },
        "vcell13": {
          "target": 0,
          "vcell": 0
        },
        "vcell14": {
          "target": 0,
          "vcell": 0
        },
        "vcell15": {
          "target": 0,
          "vcell": 0
        },
        "vcell16": {
          "target": 0,
          "vcell": 0
        }
      };
      this.piInfoBatt.cellVoltage[0] = data;
    }
  }

  setMap() {
    let map = this.piInfo.map;
    map = map.replaceAll('°', '');
    map = map.replace(/\s/g, '')
    map = map.replace('N', '');
    map = map.replace('E', '');
    map = map.split(",");
    this.lat = map[0];
    this.lng = map[1];
  }

  getBattery(id) {
    this.piService.getPiStatusBatt(id).subscribe(
      data => {
        this.piInfoBatt = data;
        this.calMaxMin();
      },
      (err) => {
        if (err.status != 401) {
          this.notiService.error("เกิดข้อผิดพลาด", "กรุณาติดต่อเจ้าหน้าที่");
        }
      });
  }

  calMaxMin() {
    this.vcell = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    let maxList = this.geth(this.piInfoBatt.cellVoltage[0]);
    this.max = maxList.id;
    let minList = this.getl(this.piInfoBatt.cellVoltage[0]);
    this.min = minList.id;
  }

  geth(o) {
    var vals = [];
    for (var i in o) {
      vals.push(o[i].vcell);
    }
    var max = Math.max.apply(null, vals);
    let index = 0;
    for (var i in o) {
      if (o[i].vcell == max) {
        let res = {
          id: o[i].vcell,
          max: max
        }
        this.vcell[index] = 'MAX';
        return res;
      }
      index++;
    }
  }

  getl(o) {
    var vals = [];
    for (var i in o) {
      vals.push(o[i].vcell);
    }

    var min = this.nonZeroMin(vals);

    let index = 0;
    for (var i in o) {
      if (o[i].vcell == min) {
        let res = {
          id: o[i].vcell,
          min: min
        }
        this.vcell[index] = 'MIN';
        return res;
      }
      index++;
    }
  }

  nonZeroMin(args): any {
    for (var i = args.length - 1; i >= 0; i--) {
      if (args[i] == 0) args.splice(i, 1);
    }
    if(args.length === 0)
      return 0;

    return Math.min.apply(null, args);
  }

  setChartData() {
    for (var i in this.piInfoBatt.cellVoltage[0]) {
      this.targetData.push(this.piInfoBatt.cellVoltage[0][i].target);
      this.vcellData.push(this.piInfoBatt.cellVoltage[0][i].vcell)
    }
  }

  back() {
    let path = '/region/' + this.region.toLocaleLowerCase() + '/' + this.province.toLocaleLowerCase() + '/' + this.site.toLocaleLowerCase();
    this.router.navigate([path]);
  }

  selectBatt(id, battId, status, event) {
    this.getBattery(battId);
    this.removeClass(this.statusEle);
    this.element = document.getElementById('batt' + id) as HTMLElement;
    this.setClass(status);
  }

  setClass(status) {
    let eleClass = this.element.getElementsByClassName("batt-card");
    for (var i = 0; i < eleClass.length; i++) {
      if (status === 'N' || status === 'B' || status === 'D')
        eleClass[i].className += " batt-card-hover-active";
      else if (status === 'I')
        eleClass[i].className += " batt-card-hover-inactive";
      else if (status === 'A')
        eleClass[i].className += " batt-card-hover-alert";
    }
    this.statusEle = status;
  }

  removeClass(status) {
    if (this.element == null) {
      this.element = document.getElementById('batt0') as HTMLElement;
    }
    let eleClass = this.element.getElementsByClassName("batt-card");
    for (var i = 0; i < eleClass.length; i++) {
      if (status === 'N' || status === 'B' || status === 'D')
        eleClass[i].className = eleClass[i].className.replace(/\bbatt-card-hover-active\b/g, "");
      else if (status === 'I')
        eleClass[i].className = eleClass[i].className.replace(/\bbatt-card-hover-inactive\b/g, "");
      else if (status === 'A')
        eleClass[i].className = eleClass[i].className.replace(/\bbatt-card-hover-alert\b/g, "");
    }
  }

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
