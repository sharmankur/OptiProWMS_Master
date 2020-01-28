import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierMainComponent } from './carrier-main.component';

describe('CarrierMainComponent', () => {
  let component: CarrierMainComponent;
  let fixture: ComponentFixture<CarrierMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
