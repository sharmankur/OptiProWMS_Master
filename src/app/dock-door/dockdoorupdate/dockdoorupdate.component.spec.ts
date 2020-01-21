import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DockdoorupdateComponent } from './dockdoorupdate.component';

describe('DockdoorupdateComponent', () => {
  let component: DockdoorupdateComponent;
  let fixture: ComponentFixture<DockdoorupdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DockdoorupdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DockdoorupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
