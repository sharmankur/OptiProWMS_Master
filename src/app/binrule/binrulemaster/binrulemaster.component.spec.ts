import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinrulemasterComponent } from './binrulemaster.component';

describe('BinrulemasterComponent', () => {
  let component: BinrulemasterComponent;
  let fixture: ComponentFixture<BinrulemasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BinrulemasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BinrulemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
