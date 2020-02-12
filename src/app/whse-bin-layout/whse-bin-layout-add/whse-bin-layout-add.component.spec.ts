import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhseBinLayoutAddComponent } from './whse-bin-layout-add.component';

describe('WhseBinLayoutAddComponent', () => {
  let component: WhseBinLayoutAddComponent;
  let fixture: ComponentFixture<WhseBinLayoutAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhseBinLayoutAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhseBinLayoutAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
