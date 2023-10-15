import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import { HomeService } from 'src/app/modules/main/service/home.service';
import { Chart } from 'chart.js';
import { ChartColors, central, southern, eastern, northeastern, northern, western } from 'src/app/constant/ChartColors';

declare const bootstrap: any;

@Component({
    selector: 'tpp-battery-backup',
    templateUrl: './battery-backup.component.html',
    styleUrls: ['./battery-backup.component.css']
})
export class BatteryBackupComponent implements OnInit {

    filterOption: any = {
        region: ['central', 'northern', 'southern', 'eastern', 'northeastern', 'western'],
        page: 1,
        limit: 10,
        pageTotal: 1,
        recordTotal: 0
    };
    @Input('selectRegion')
    set region(region: string[]) {
        this.filterOption.region = region;
    }
    defaultRegion: string[] = ['central', 'northern', 'southern', 'eastern', 'northeastern', 'western'];

    public lineChartColors: Array<any> = [];
    public ChartLabels: Array<any> = [];
    public ChartColor: Array<any> = [];
    public Data: any[] = [];

    sizeStep = 10;

    mobile: boolean;
    filterMain = true;
    filterBatteryBackupModal: any;

    @ViewChild('canvasBackup', { static: true }) canvasBackup: BaseChartDirective;

    constructor(private homeService: HomeService) { }

    ngOnInit(): void {
        this.searchData();
        this.ChartColor = ChartColors;

        Chart.Tooltip.positioners.custom = function (elements, eventPosition) {
            /** @type {Chart.Tooltip} */
            var tooltip = this;

            /* ... */

            return {
                x: eventPosition.x,
                y: eventPosition.y
            };
        }

        if (window.innerWidth <= 768) { // 768px portrait
            this.mobile = true;
        } else {
            this.mobile = false;
        }
    }

    async ngAfterViewInit() {
        this.filterBatteryBackupModal = new bootstrap.Modal(document.getElementById('filterBatteryBackupModal'));
    }


    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if (window.innerWidth <= 768) { // 768px portrait
            this.mobile = true;
        } else {
            this.mobile = false;
        }
    }

    public chartClicked(e: any): void {
    }
    public chartHovered(e: any): void {
    }

    highlightSegment(chart, index, isHighlight) {
        var activeSegment = chart.getDatasetMeta(0).data[index];
        if (isHighlight) chart.updateHoverStyle([activeSegment], null, true);
        else chart.updateHoverStyle([activeSegment], null, false);
        chart.draw();
    }

    searchData() {
        this.homeService.getBatteryBackupTime(this.filterOption)
            .subscribe(data => {
                this.pushLabel(data);
                this.pushData(data);
                this.refreshChart();
            });
    }

    async openFilterModal() {
        this.filterBatteryBackupModal.show();
    }

    async selectRegionFilter(event: any, region: any) {
        if (event.target.checked) {
            this.filterOption.region.push(region.toLowerCase());
        } else {
            this.filterOption.region = this.filterOption.region.filter((row: any) => {
                return row != region.toLowerCase();
            });
        }
        await this.searchData();
    }

    async selectAllRegionFilter(event: any) {
        if (event.target.checked) {
            this.filterOption.region = this.defaultRegion;
        } else {
            this.filterOption.region = [];
        }
        await this.searchData();
    }

    async clearFilter() {
        this.filterOption.region = this.defaultRegion;
        await this.searchData();
    }

    pushLabel(datas) {
        this.ChartLabels = [];
        datas.forEach(d => {
            d.datas.forEach(data => {
                if (this.ChartLabels.indexOf(data.date) === -1) {
                    this.ChartLabels.push(data.date);
                }
            });
        });
    }

    pushData(datas) {
        this.Data = [];
        let max = 0;
        datas.forEach(d => {
            let dataArray = [];
            d.datas.forEach(data => {
                dataArray.push(data.totality);
                if (data.totality > max)
                    max = data.totality;
            });
            let body = {
                label: d.regionName,
                data: dataArray,
                type: 'line',
                borderWidth: 3
            };
            this.Data.push(body);
        });
        if (max == 0) {
            this.sizeStep = 10;
        } else {
            let range = Math.ceil(max / 10);
            if (range > 8) {
                this.sizeStep = 20;
            } else {
                this.sizeStep = 10;
            }
        }
    }

    refreshChart() {
        this.barChartOptions = {
            elements: {
                point:
                {
                    radius: 5,
                    hitRadius: 5,
                    hoverRadius: 5,
                    hoverBorderWidth: 2
                },
                line: {
                    fill: false
                }
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    boxWidth: 8,
                    usePointStyle: true
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'month',
                        displayFormats: {
                            month: 'MMM'
                        },
                    },
                    ticks: {
                        fontFamily: 'Prompt-Light',
                        fontColor: '#A4A4A4',
                        beginAtZero: true
                    },
                    stacked: false,
                    gridLines: {
                        display: false,
                    },
                }],
                yAxes: [{
                    ticks: {
                        min: 0,
                        stepSize: this.sizeStep,
                        fontSize: 9,
                        fontFamily: 'Prompt-Light',
                        fontColor: '#A4A4A4',
                        beginAtZero: true
                    },
                    stacked: false,
                    gridLines: {
                        display: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Mins',
                        fontFamily: 'Prompt-Light',
                        lineHeight: 1,
                        fontSize: 10
                    }
                }]
            },
            scaleShowVerticalLines: false,
            responsive: true,
            tooltips: {
                position: 'custom',
                enabled: false,
                custom:
                    function (tooltipModel) {
                        // Tooltip Element
                        var tooltipEl = document.getElementById('chartjs-tooltip');
                        let datepipe: DatePipe = new DatePipe('en-us');
                        // Create element on first render
                        if (!tooltipEl) {
                            tooltipEl = document.createElement('div');
                            tooltipEl.id = 'chartjs-tooltip';
                            tooltipEl.innerHTML = '<table></table>';
                            document.body.appendChild(tooltipEl);
                        }

                        // Hide if no tooltip
                        if (tooltipModel.opacity === 0) {
                            tooltipEl.style.opacity = "0";
                            tooltipEl.style.left = '0px';
                            tooltipEl.style.top = '0px'
                            return;
                        }

                        // Set caret Position
                        tooltipEl.classList.remove('above', 'below', 'no-transform');
                        if (tooltipModel.yAlign) {
                            tooltipEl.classList.add(tooltipModel.yAlign);
                        } else {
                            tooltipEl.classList.add('no-transform');
                        }

                        function getBody(bodyItem) {
                            return bodyItem.lines;
                        }

                        let height = 0;
                        let size = 0;
                        let textThismonth = "font-weight: thin;width: fit-content;";
                        let textMonth = "width: fit-content;";
                        let textBackup = "font-size: 18px;";
                        let textBackupRegion = "font-size: 12px;";

                        let mobileTooltips: boolean;
                        if (window.innerWidth <= 768) { // 768px portrait
                            mobileTooltips = true;
                        } else {
                            mobileTooltips = false;
                        }

                        if (!mobileTooltips) {
                            textThismonth += "font-size: 10px;";
                            textMonth += "font-size: 12px;";
                        } else {
                            textThismonth += "font-size: 8px;";
                            textMonth += "font-size: 10px;";
                            textBackup = "font-size: 14px;";
                            textBackupRegion = "font-size: 10px;";
                        }

                        let width = -81;

                        // Set Text
                        if (tooltipModel.body) {
                            var titleLines = tooltipModel.title || [];
                            var bodyLines = tooltipModel.body.map(getBody);

                            var innerHtml = '<thead style="width: 150px; height: fit-content; position: relative;display: block;">';

                            titleLines.forEach(function (title) {
                                let month = datepipe.transform(new Date(title), 'MMM').toUpperCase();
                                if (month === 'JAN') {
                                    width = 0;
                                }
                                if (month === 'DEC') {
                                    width = -162;
                                }
                                innerHtml += '<tr style="display: block;"><th style="display: block;"><span style="' + textThismonth + '">This Month: <span style="' + textMonth + '">' + month + '</span></span></th></tr>';
                            });
                            innerHtml += '</thead><tbody>';

                            bodyLines.forEach(function (body, i) {
                                size++;
                                let str = body + '';
                                let data = str.split(":");
                                let colors = tooltipModel.labelColors[i];
                                let style = 'color:' + colors.backgroundColor;
                                style += '; font-weight: bold;';
                                let td = '<td style="' + style + textBackup + '">';
                                innerHtml += '<tr">' + td + data[1] + '</td></tr>';
                                innerHtml += '<tr"><td style="' + textBackupRegion + '">' + data[0] + '</td></tr>';
                            });
                            innerHtml += '</tbody>';

                            var tableRoot = tooltipEl.querySelector('table');
                            tableRoot.innerHTML = innerHtml;
                        }

                        if (!mobileTooltips) {
                            height = 32.4 + (50.4 * size);
                        } else {
                            height = 32.4 + (40.8 * size);
                        }

                        // `this` will be the overall tooltip
                        var position = this._chart.canvas.getBoundingClientRect();
                        // Display, position, and set styles for font
                        tooltipEl.style.opacity = "1";
                        tooltipEl.style.position = 'absolute';
                        tooltipEl.style.boxShadow = 'rgba(0, 0, 0, 0.24) 0px 3px 8px';
                        tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + width + 'px';
                        tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY - height + 'px';
                        tooltipEl.style.fontFamily = 'Prompt-Light';
                        tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                        tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                        tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                        tooltipEl.style.pointerEvents = 'none';
                        tooltipEl.style.backgroundColor = 'rgb(255,255,255)';
                        tooltipEl.style.color = 'rgb(105, 105, 105)';
                    }
            },
        };
    }

    public barChartOptions: any = {};
    public barChartType = 'line';
}

