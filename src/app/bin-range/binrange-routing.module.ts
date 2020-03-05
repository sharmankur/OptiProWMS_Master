import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BinRangeViewComponent } from './bin-range-view/bin-range-view.component';
import { BinRangeUpdateComponent } from './bin-range-update/bin-range-update.component';
import { BinRangeMainComponent } from './bin-range-main/bin-range-main.component';

const routes: Routes = [
  { path: '', component: BinRangeMainComponent },
  { path: 'binranges-update', component: BinRangeUpdateComponent },
  { path: 'binranges-view', component: BinRangeViewComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BinRangeRoutingModule { }
