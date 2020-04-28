import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputInternalContainerComponent } from './input-internal-container.component';

describe('InputInternalContainerComponent', () => {
  let component: InputInternalContainerComponent;
  let fixture: ComponentFixture<InputInternalContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputInternalContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputInternalContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
