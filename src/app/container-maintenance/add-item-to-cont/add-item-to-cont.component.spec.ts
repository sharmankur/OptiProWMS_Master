import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemToContComponent } from './add-item-to-cont.component';

describe('AddItemToContComponent', () => {
  let component: AddItemToContComponent;
  let fixture: ComponentFixture<AddItemToContComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddItemToContComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemToContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
