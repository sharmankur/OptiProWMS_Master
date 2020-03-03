import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinRangeViewComponent } from './bin-range-view.component';

describe('BinRangeViewComponent', () => {
  let component: BinRangeViewComponent;
  let fixture: ComponentFixture<BinRangeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BinRangeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BinRangeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
