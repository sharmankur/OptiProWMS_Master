import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContMaintnceComponent } from './cont-maintnce.component';

describe('ContMaintnceComponent', () => {
  let component: ContMaintnceComponent;
  let fixture: ComponentFixture<ContMaintnceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContMaintnceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContMaintnceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
