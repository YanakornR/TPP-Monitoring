import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattStatusCardComponent } from './batt-status-card.component';

describe('BattStatusCardComponent', () => {
  let component: BattStatusCardComponent;
  let fixture: ComponentFixture<BattStatusCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattStatusCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattStatusCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
