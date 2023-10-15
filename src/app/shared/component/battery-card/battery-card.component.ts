import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tpp-battery-card',
  templateUrl: './battery-card.component.html',
  styleUrls: ['./battery-card.component.css']
})
export class BatteryCardComponent implements OnInit {
  _id;
  _no;
  _status;
  _soc;
  _hover;

  @Input('id')
  set id(id: String) {
    this._id = id;
  }

  @Input('no')
  set no(no: String) {
    this._no = no;
  }
  
  @Input('status')
  set status(status: String) {
    this._status = status;
  }
    
  @Input('soc')
  set soc(soc: String) {
    this._soc = soc;
  }

  @Input('hover')
  set hover(hover: String) {
    this._hover = hover;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
