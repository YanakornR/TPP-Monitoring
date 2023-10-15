import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tpp-batt-status-card',
  templateUrl: './batt-status-card.component.html',
  styleUrls: ['./batt-status-card.component.css']
})
export class BattStatusCardComponent implements OnInit {
  _id;
  _no;
  _status;
  _volt;
  _amp;
  _soc;

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
  
  @Input('volt')
  set volt(volt: String) {
    this._volt = volt;
  }
  
  @Input('amp')
  set amp(amp: String) {
    this._amp = amp;
  }
  
  constructor() { }

  ngOnInit(): void {
  }

}
