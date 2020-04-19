import { InjectionToken } from "@angular/core"
import { AppSandboxService } from "./app-sandbox.service"

const appSandboxToken: string = 'app-sandbox-class-provider'
export const appSandboxTokenProvider = new InjectionToken<AppSandboxService>(appSandboxToken)
