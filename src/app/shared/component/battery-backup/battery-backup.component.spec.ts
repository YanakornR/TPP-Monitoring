import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryBackupComponent } from './battery-backup.component';

describe('BatteryBackupComponent', () => {
  let component: BatteryBackupComponent;
  let fixture: ComponentFixture<BatteryBackupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatteryBackupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatteryBackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
