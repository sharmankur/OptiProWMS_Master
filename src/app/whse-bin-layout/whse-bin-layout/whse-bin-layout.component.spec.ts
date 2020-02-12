import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhseBinLayoutComponent } from './whse-bin-layout.component';

describe('WhseBinLayoutComponent', () => {
  let component: WhseBinLayoutComponent;
  let fixture: ComponentFixture<WhseBinLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhseBinLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhseBinLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
