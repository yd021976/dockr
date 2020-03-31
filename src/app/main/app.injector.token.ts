import { InjectionToken, Injector } from "@angular/core";
import { ApplicationInjector } from "../shared/application.injector.class";

export const AppInjectorToken = new InjectionToken<(injector: Injector) => {}>('ApplicationInjectorSingleton')

export function initAppInjector(injector: Injector) {
    ApplicationInjector.injector = injector
    return ApplicationInjector
  }