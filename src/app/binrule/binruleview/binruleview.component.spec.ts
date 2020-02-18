import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinruleviewComponent } from './binruleview.component';

describe('BinruleviewComponent', () => {
  let component: BinruleviewComponent;
  let fixture: ComponentFixture<BinruleviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BinruleviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BinruleviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
