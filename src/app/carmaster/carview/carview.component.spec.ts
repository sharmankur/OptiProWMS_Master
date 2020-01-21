import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CARViewComponent } from './carview.component';

describe('CARViewComponent', () => {
  let component: CARViewComponent;
  let fixture: ComponentFixture<CARViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CARViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CARViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
