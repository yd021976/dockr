import { Route } from '@angular/router';

export abstract class RouteData {
  isMenu: boolean;
  title?: string;
  icon?: string;
  link?: string;
  isAuthRequired?: boolean;
}
export interface AppRoute extends Route {
  data?: RouteData;
  children?: AppRoute[]
}