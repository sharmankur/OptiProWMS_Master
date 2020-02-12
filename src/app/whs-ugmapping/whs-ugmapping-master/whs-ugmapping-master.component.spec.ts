import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhsUGMappingMasterComponent } from './whs-ugmapping-master.component';

describe('WhsUGMappingMasterComponent', () => {
  let component: WhsUGMappingMasterComponent;
  let fixture: ComponentFixture<WhsUGMappingMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhsUGMappingMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhsUGMappingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
