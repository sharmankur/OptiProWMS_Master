import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCodeGenerationAddComponent } from './item-code-generation-add.component';

describe('ItemCodeGenerationAddComponent', () => {
  let component: ItemCodeGenerationAddComponent;
  let fixture: ComponentFixture<ItemCodeGenerationAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemCodeGenerationAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCodeGenerationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
