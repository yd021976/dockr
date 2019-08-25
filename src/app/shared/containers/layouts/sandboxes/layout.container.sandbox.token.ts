import { InjectionToken } from '@angular/core';
import { LayoutContainerSandboxInterface } from './layout.container.sandbox.interface';

const LayoutContainerSandboxProviderTokenKey: string = 'layout-container-sandbox-class-provider'
export const LayoutContainerSandboxProviderToken = new InjectionToken<LayoutContainerSandboxInterface>( LayoutContainerSandboxProviderTokenKey )