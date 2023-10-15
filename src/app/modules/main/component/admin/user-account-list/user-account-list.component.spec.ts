import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountListComponent } from './user-account-list.component';

describe('UserAccountListComponent', () => {
  let component: UserAccountListComponent;
  let fixture: ComponentFixture<UserAccountListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAccountListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
