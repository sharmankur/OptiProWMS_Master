import { TestBed } from '@angular/core/testing';

import { ShipmentWizardService } from './shipment-wizard.service';

describe('ShipmentWizardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShipmentWizardService = TestBed.get(ShipmentWizardService);
    expect(service).toBeTruthy();
  });
});
