import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefViewComponent } from './ref-view/ref-view.component';
import { RefUploadComponent } from './ref-upload/ref-upload.component';
import { RefInfiniteScrollComponent } from './ref-infinite-scroll/ref-infinite-scroll.component';

const routes: Routes = [
  {
    path: '',
    component: RefInfiniteScrollComponent
  },
  {
    path: 'upload',
    component: RefUploadComponent
  },
  {
    path: ':id', // Route avec paramètre id
    component: RefViewComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefRoutingModule { }
