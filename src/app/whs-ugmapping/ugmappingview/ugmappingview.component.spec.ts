import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UgmappingviewComponent } from './ugmappingview.component';

describe('UgmappingviewComponent', () => {
  let component: UgmappingviewComponent;
  let fixture: ComponentFixture<UgmappingviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UgmappingviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UgmappingviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
