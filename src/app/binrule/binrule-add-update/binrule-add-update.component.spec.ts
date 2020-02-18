import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinruleAddUpdateComponent } from './binrule-add-update.component';

describe('BinruleAddUpdateComponent', () => {
  let component: BinruleAddUpdateComponent;
  let fixture: ComponentFixture<BinruleAddUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BinruleAddUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BinruleAddUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
