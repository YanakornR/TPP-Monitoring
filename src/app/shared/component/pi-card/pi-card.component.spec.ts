import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PiCardComponent } from './pi-card.component';

describe('PiCardComponent', () => {
  let component: PiCardComponent;
  let fixture: ComponentFixture<PiCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PiCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
