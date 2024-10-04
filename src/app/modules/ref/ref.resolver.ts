import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { RefService } from "../../api/ref.service";
import { catchError, of, tap } from "rxjs";

export const refResolver: ResolveFn<Object> = (route, state) => {
  const id = route.paramMap.get('id');
  const refService = inject(RefService);

  console.log('RefResolver: Resolving ref with ID:', id);

  return refService.getRefById(id as string).pipe(
    tap(ref => {
      console.log('RefResolver: Successfully resolved ref:', ref);
    }),
    catchError(error => {
      console.error('RefResolver: Error occurred while resolving ref:', error);
      // Return a default value or null to prevent the error from propagating
      return of(null);
    })
  );
};
