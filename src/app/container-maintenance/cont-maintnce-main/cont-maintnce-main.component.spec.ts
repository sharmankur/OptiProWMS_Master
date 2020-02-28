import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContMaintnceMainComponent } from './cont-maintnce-main.component';

describe('ContMaintnceMainComponent', () => {
  let component: ContMaintnceMainComponent;
  let fixture: ComponentFixture<ContMaintnceMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContMaintnceMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContMaintnceMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
