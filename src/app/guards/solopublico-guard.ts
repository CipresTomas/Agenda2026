import { CanActivateFn } from '@angular/router';

export const solopublicoGuard: CanActivateFn = (route, state) => {
  return true;
};
