import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputParentContainerComponent } from './input-parent-container.component';

describe('InputParentContainerComponent', () => {
  let component: InputParentContainerComponent;
  let fixture: ComponentFixture<InputParentContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputParentContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputParentContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
