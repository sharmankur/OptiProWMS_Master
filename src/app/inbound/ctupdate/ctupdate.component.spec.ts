import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CTUpdateComponent } from './ctupdate.component';

describe('CTUpdateComponent', () => {
  let component: CTUpdateComponent;
  let fixture: ComponentFixture<CTUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CTUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CTUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
