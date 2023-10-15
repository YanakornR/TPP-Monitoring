import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NmModuleListComponent } from './nm-module-list.component';

describe('NmModuleListComponent', () => {
  let component: NmModuleListComponent;
  let fixture: ComponentFixture<NmModuleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NmModuleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NmModuleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
