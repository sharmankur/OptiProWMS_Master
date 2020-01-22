import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonLookupComponent } from './common-lookup.component';

describe('CommonLookupComponent', () => {
  let component: CommonLookupComponent;
  let fixture: ComponentFixture<CommonLookupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonLookupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
