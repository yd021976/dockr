import { InjectionToken } from '@angular/core';
import { DashboardSandboxInterface } from './dashboard.sandbox.interface';

const dashboardSandboxProviderTokenKey: string = 'home-dashboard-sandbox-class-provider'
export const dashboardSandboxProviderToken = new InjectionToken<DashboardSandboxInterface>( dashboardSandboxProviderTokenKey )