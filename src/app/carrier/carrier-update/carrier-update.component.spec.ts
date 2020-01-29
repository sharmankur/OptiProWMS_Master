import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierUpdateComponent } from './carrier-update.component';

describe('CarrierUpdateComponent', () => {
  let component: CarrierUpdateComponent;
  let fixture: ComponentFixture<CarrierUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
