import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionStepSetupComponent } from './transaction-step-setup.component';

describe('TransactionStepSetupComponent', () => {
  let component: TransactionStepSetupComponent;
  let fixture: ComponentFixture<TransactionStepSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionStepSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionStepSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
