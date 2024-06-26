import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefViewComponent } from './ref-view/ref-view.component';
import { RefUploadComponent } from './ref-upload/ref-upload.component';

const routes: Routes = [
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
