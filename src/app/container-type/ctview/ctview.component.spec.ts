import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CTViewComponent } from './ctview.component';

describe('CTViewComponent', () => {
  let component: CTViewComponent;
  let fixture: ComponentFixture<CTViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CTViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CTViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
