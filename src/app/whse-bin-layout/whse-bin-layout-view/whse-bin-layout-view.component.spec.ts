import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhseBinLayoutViewComponent } from './whse-bin-layout-view.component';

describe('WhseBinLayoutViewComponent', () => {
  let component: WhseBinLayoutViewComponent;
  let fixture: ComponentFixture<WhseBinLayoutViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhseBinLayoutViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhseBinLayoutViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
