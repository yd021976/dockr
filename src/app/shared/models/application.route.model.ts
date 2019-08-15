import { Route } from '@angular/router';

export abstract class ApplicationRouteData {
  isMenu: boolean;
  title?: string;
  icon?: string;
  link?: string;
  isAuthRequired?: boolean;
}
export interface ApplicationRouteInterface extends Route {
  data?: ApplicationRouteData;
  children?: ApplicationRouteInterface[]
}