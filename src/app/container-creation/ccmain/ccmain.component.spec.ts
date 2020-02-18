import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcmainComponent } from './ccmain.component';

describe('CcmainComponent', () => {
  let component: CcmainComponent;
  let fixture: ComponentFixture<CcmainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcmainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
