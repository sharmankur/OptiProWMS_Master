import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierViewComponent } from './carrier-view.component';

describe('CarrierViewComponent', () => {
  let component: CarrierViewComponent;
  let fixture: ComponentFixture<CarrierViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
