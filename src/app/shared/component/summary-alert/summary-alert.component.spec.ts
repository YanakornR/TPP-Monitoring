import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryAlertComponent } from './summary-alert.component';

describe('SummaryAlertComponent', () => {
  let component: SummaryAlertComponent;
  let fixture: ComponentFixture<SummaryAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
