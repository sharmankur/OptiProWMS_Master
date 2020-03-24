import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildParentContainerComponent } from './build-parent-container.component';

describe('BuildParentContainerComponent', () => {
  let component: BuildParentContainerComponent;
  let fixture: ComponentFixture<BuildParentContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildParentContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildParentContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
