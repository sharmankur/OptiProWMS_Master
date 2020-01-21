import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DockdoorviewComponent } from './dockdoorview.component';

describe('DockdoorviewComponent', () => {
  let component: DockdoorviewComponent;
  let fixture: ComponentFixture<DockdoorviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DockdoorviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DockdoorviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
