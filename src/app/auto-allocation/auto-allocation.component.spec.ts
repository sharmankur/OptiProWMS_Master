import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoAllocationComponent } from './auto-allocation.component';

describe('AutoAllocationComponent', () => {
  let component: AutoAllocationComponent;
  let fixture: ComponentFixture<AutoAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
