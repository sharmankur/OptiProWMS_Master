import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerOperationComponent } from './container-operation.component';

describe('ContainerOperationComponent', () => {
  let component: ContainerOperationComponent;
  let fixture: ComponentFixture<ContainerOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
