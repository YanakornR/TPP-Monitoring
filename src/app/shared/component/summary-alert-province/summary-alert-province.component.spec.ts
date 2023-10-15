import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryAlertProvinceComponent } from './summary-alert-province.component';

describe('SummaryAlertProvinceComponent', () => {
  let component: SummaryAlertProvinceComponent;
  let fixture: ComponentFixture<SummaryAlertProvinceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryAlertProvinceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryAlertProvinceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
