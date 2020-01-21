import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CARMainComponent } from './carmain.component';

describe('CARMainComponent', () => {
  let component: CARMainComponent;
  let fixture: ComponentFixture<CARMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CARMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CARMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
