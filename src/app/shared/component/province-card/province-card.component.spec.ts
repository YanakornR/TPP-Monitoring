import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinceCardComponent } from './province-card.component';

describe('ProvinceCardComponent', () => {
  let component: ProvinceCardComponent;
  let fixture: ComponentFixture<ProvinceCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvinceCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvinceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
