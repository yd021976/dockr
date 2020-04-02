import { Route } from '@angular/router';

export abstract class ApplicationRouteData {
  isMenu: boolean
  title?: string
  icon?: string
  link?: string
  isAuthRequired?: boolean
  siteZone?:string // the site zone, used to set app zone user abilities based on roles
}
export interface ApplicationRouteInterface extends Route {
  data?: ApplicationRouteData;
  children?: ApplicationRouteInterface[]
}