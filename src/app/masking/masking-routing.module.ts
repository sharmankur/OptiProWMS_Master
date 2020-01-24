import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemCodeGenerationComponent } from './item-code-generation/item-code-generation.component';


const routes: Routes = [
  { path: '', component: ItemCodeGenerationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaskingRoutingModule { }
