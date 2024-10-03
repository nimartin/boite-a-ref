import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { RefService } from "../../api/ref.service";

export const refResolver: ResolveFn<Object> = (route, state) => {
  const id = route.paramMap.get('id');
  return inject(RefService).getRefById(id as string);
}
