import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryBackupProvinceComponent } from './battery-backup-province.component';

describe('BatteryBackupProvinceComponent', () => {
  let component: BatteryBackupProvinceComponent;
  let fixture: ComponentFixture<BatteryBackupProvinceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatteryBackupProvinceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatteryBackupProvinceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
