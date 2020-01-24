import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCodeGenerationViewComponent } from './item-code-generation-view.component';

describe('ItemCodeGenerationViewComponent', () => {
  let component: ItemCodeGenerationViewComponent;
  let fixture: ComponentFixture<ItemCodeGenerationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemCodeGenerationViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCodeGenerationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
