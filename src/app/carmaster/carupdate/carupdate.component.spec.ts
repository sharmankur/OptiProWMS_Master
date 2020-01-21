import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CARUpdateComponent } from './carupdate.component';

describe('CARUpdateComponent', () => {
  let component: CARUpdateComponent;
  let fixture: ComponentFixture<CARUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CARUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CARUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
