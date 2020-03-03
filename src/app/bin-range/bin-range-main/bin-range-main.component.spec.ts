import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinRangeMainComponent } from './bin-range-main.component';

describe('BinRangeMainComponent', () => {
  let component: BinRangeMainComponent;
  let fixture: ComponentFixture<BinRangeMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BinRangeMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BinRangeMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
