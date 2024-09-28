import { inject, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { RefViewComponent } from './ref-view/ref-view.component';
import { RefUploadComponent } from './ref-upload/ref-upload.component';
import { RefInfiniteScrollComponent } from './ref-infinite-scroll/ref-infinite-scroll.component';
import { RefService } from '../../api/ref.service';

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
    component: RefViewComponent,
    data: {
      resolveRef: (route: ActivatedRouteSnapshot) => {
        const id = route.paramMap.get('id');
        return inject(RefService).getRefById(id!); // Retourne un Observable pour les données
      }
    }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefRoutingModule { }
