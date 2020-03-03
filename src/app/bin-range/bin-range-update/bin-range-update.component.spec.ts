import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinRangeUpdateComponent } from './bin-range-update.component';

describe('BinRangeUpdateComponent', () => {
  let component: BinRangeUpdateComponent;
  let fixture: ComponentFixture<BinRangeUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BinRangeUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BinRangeUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
