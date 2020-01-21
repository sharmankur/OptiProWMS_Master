import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DockdoormainComponent } from './dockdoormain.component';

describe('DockdoormainComponent', () => {
  let component: DockdoormainComponent;
  let fixture: ComponentFixture<DockdoormainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DockdoormainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DockdoormainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
