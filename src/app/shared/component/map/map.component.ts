import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'tpp-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnInit {
  filtersLoaded: Promise<boolean> = Promise.resolve(false);

  constructor() { }

  ngOnInit(): void {
  }

  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  map: google.maps.Map;
  marker;

  _lat :number;
  _lng :number;
  title : string;

  // google maps zoom level
  zoom: number = 16;
  heightAgm = 135

  isFist = true;

  @Input('lat')
  set lat(lat: string) {
    this._lat = parseFloat(lat);
  }

  @Input('lng')
  set lng(lng: string) {
    this._lng = parseFloat(lng);
    if(!isNaN(this._lng)) {
      this.title = this._lat + ", " + this._lng;
      this.filtersLoaded = Promise.resolve(true);
    }
  }

  @Input('height')
  set height(height: string) {
    this.heightAgm = parseFloat(height);
  }

  ngAfterViewInit() {
  }

  mapReady(event: any) {
    this.map = event;
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('largerMap'));
}

  viewLargerMap() {
    let url = "https://www.google.com.sa/maps/search/" + this._lat + "," + this._lng;
    window.open(url, "_blank");
  }

  // mapInitializer() {
  //   let coordinates = new google.maps.LatLng(this._lat, this._lng);

  //   let mapOptions: google.maps.MapOptions = {
  //     center: coordinates,
  //     zoom: 16
  //   };

  //   this.map = new google.maps.Map(this.gmap.nativeElement,
  //     mapOptions);
  //   this.marker = new google.maps.Marker({
  //     position: coordinates,
  //     map: this.map,
  //   });
  //   this.marker.setMap(this.map);

  //   var gotoMapButton = document.createElement("div");
  //   gotoMapButton.setAttribute("style", "margin: 10px; border: 1px solid; padding: 2px 12px; font: bold 12px Prompt-Light; color: #000000; background-color: #FFFFFF; cursor: pointer;");
  //   gotoMapButton.innerHTML = "Open Google Maps";
  //   this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(gotoMapButton);
  //   google.maps.event.addDomListener(gotoMapButton, "click", function () {
  //     let url = "https://www.google.com.sa/maps/search/" + this._lat + "," + this._lng;
  //     // you can also hard code the URL
  //     window.open(url);
  //   });
  // }


}