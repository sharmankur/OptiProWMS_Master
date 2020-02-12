import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WMSUGMappingAddUpdateComponent } from './wmsugmapping-add-update.component';

describe('WMSUGMappingAddUpdateComponent', () => {
  let component: WMSUGMappingAddUpdateComponent;
  let fixture: ComponentFixture<WMSUGMappingAddUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WMSUGMappingAddUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WMSUGMappingAddUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
