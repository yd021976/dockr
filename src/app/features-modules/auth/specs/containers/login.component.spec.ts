import { mock, instance, when, anything, deepEqual } from "ts-mockito";
import { AuthSandbox } from "../../auth.sandbox";
import { TestBed, ComponentFixture, fakeAsync, tick, flushMicrotasks, flush, async } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA, DebugElement } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { ApplicationState } from "src/app/shared/store/states/application.state";
import { UserState } from "src/app/shared/store/states/user.state";
import { TemplatesState } from "src/app/shared/store/states/templates.state";
import { LoginContainer } from "../../containers/login/login.container";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { loginCredentials } from "src/app/shared/models/user.model";
import { AppLoggerService } from "src/app/shared/services/logger/app-logger/service/app-logger.service";
import { Observable, BehaviorSubject } from "rxjs";
import { AppLoggerModule } from "src/app/shared/services/logger/app-logger/app-logger.module";
import { LoginComponent } from "../../components/login/login.component";
import { By } from "@angular/platform-browser";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";


describe('Auth module -- Containers -- Login', () => {
    let fixture: ComponentFixture<LoginContainer>
    let component: LoginContainer = undefined

    describe('Unit tests - Mock', () => {
        // Mock activatedRoute service
        let mockActivatedRoute: ActivatedRoute = mock(ActivatedRoute)
        const activatedRouteQueryParams: BehaviorSubject<Params> = new BehaviorSubject<Params>({})
        when(mockActivatedRoute.queryParams).thenReturn(activatedRouteQueryParams)

        let mockAuthSandbox: AuthSandbox = mock(AuthSandbox)

        let mockRouter: Router = mock(Router)

        let mockLogger: AppLoggerService = mock(AppLoggerService)
        when(mockAuthSandbox.loggerService).thenReturn(instance(mockLogger))
        when(mockAuthSandbox.authError$).thenReturn(new Observable<string>())
        const mockCredentials: loginCredentials = { "strategy": "local", email: 'test', password: 'test' }


        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [],
                providers: [
                    {
                        provide: AuthSandbox,
                        useFactory: () => instance(mockAuthSandbox)
                    },
                    {
                        provide: ActivatedRoute,
                        useFactory: () => instance(mockActivatedRoute)
                    },
                    {
                        provide: Router,
                        useFactory: () => instance(mockRouter)
                    }

                ],
                declarations: [LoginContainer],
                schemas: [NO_ERRORS_SCHEMA]
            })
            fixture = TestBed.createComponent(LoginContainer)
            component = fixture.componentInstance
        })
        it('#1 Should create component', () => {
            expect(component).toBeDefined()
        })
        it('#2 Should redirect to \'\' when login success and no activated route params', fakeAsync(() => {
            when(mockAuthSandbox.Login(mockCredentials)).thenResolve(true)
            spyOn(instance(mockRouter), "navigate")
            component.ngOnInit()
            activatedRouteQueryParams.next({}) // Ensure we sets redirectTo to '/'
            tick()
            component.login(mockCredentials)
            tick()
            expect(instance(mockRouter).navigate).toHaveBeenCalledWith(['/'])
        }))
        it('#3 Should redirect to \'home\' when login success and no activated route params', fakeAsync(() => {
            when(mockAuthSandbox.Login(mockCredentials)).thenResolve(true)
            spyOn(instance(mockRouter), "navigate")
            component.ngOnInit()
            activatedRouteQueryParams.next({ redirectTo: 'home' }) // Ensure we sets redirectTo to '/'
            tick()
            component.login(mockCredentials)
            tick()
            expect(instance(mockRouter).navigate).toHaveBeenCalledWith(['home'])
        }))
        it('#4 Should not redirect when login error', fakeAsync(() => {
            when(mockAuthSandbox.Login(mockCredentials)).thenResolve(false)
            spyOn(instance(mockRouter), "navigate")
            component.ngOnInit()
            activatedRouteQueryParams.next({ redirectTo: 'home' }) // Ensure we sets redirectTo to '/'
            tick()
            component.login(mockCredentials)
            tick()
            expect(instance(mockRouter).navigate).not.toHaveBeenCalled()
        }))
        it('#5 Should create login component', () => {
            let componentElement: HTMLElement = fixture.nativeElement
            let loginComponent: HTMLElement = componentElement.querySelector('app-login-component')
            expect(loginComponent).not.toBeNull()
        })
    })
    describe('Integration tests (mock services)', () => {
        component = null
        let loginComponentNativeElement: HTMLElement = null

        // Mock activatedRoute service
        let mockActivatedRoute: ActivatedRoute = mock(ActivatedRoute)
        const activatedRouteQueryParams: BehaviorSubject<Params> = new BehaviorSubject<Params>({})
        const authSandboxError$: BehaviorSubject<string> = new BehaviorSubject<string>('')
        when(mockActivatedRoute.queryParams).thenReturn(activatedRouteQueryParams)

        let mockAuthSandbox: AuthSandbox = mock(AuthSandbox)

        let mockRouter: Router = mock(Router)

        let mockLogger: AppLoggerService = mock(AppLoggerService)
        when(mockAuthSandbox.loggerService).thenReturn(instance(mockLogger))
        when(mockAuthSandbox.authError$).thenReturn(authSandboxError$)
        const mockCredentials: loginCredentials = { "strategy": "local", email: 'test', password: 'test' }

        // Create auth sandbox login mock for tests
        when(mockAuthSandbox.Login(deepEqual({ strategy: 'local', email: 'test #3', password: 'test' }))).thenResolve(true)
        when(mockAuthSandbox.Login(deepEqual({ strategy: 'local', email: 'test #4', password: 'test' }))).thenReject(new Error('mock error'))

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, NoopAnimationsModule],
                providers: [
                    {
                        provide: AuthSandbox,
                        useFactory: () => instance(mockAuthSandbox)
                    },
                    {
                        provide: ActivatedRoute,
                        useFactory: () => instance(mockActivatedRoute)
                    },
                    {
                        provide: Router,
                        useFactory: () => instance(mockRouter)
                    }

                ],
                declarations: [LoginContainer, LoginComponent],
                schemas: []
            }).compileComponents().then(() => {
                fixture = TestBed.createComponent(LoginContainer)
                component = fixture.componentInstance
                loginComponentNativeElement = fixture.nativeElement.querySelector('app-login-component')
                fixture.detectChanges()
            })
        }))
        it('#1 Should create Login container', () => {
            expect(component).not.toBeNull()
        })
        it('#2 Should create login component', () => {
            expect(loginComponentNativeElement).not.toBeNull()
        })
        it('#3 Should login user and navigate to \'/\'', fakeAsync(() => {
            component.ngOnInit()
            spyOn(component, "login").and.callThrough()
            spyOn(instance(mockRouter), "navigate")
            spyOn(instance(mockAuthSandbox), "Login").and.callThrough()


            let de = fixture.debugElement
            let loginComponentDebugElement: DebugElement = de.query(By.directive(LoginComponent))
            let button: DebugElement = loginComponentDebugElement.query(By.css('button'));

            // Sets credentials within login component
            const email = loginComponentDebugElement.query(By.css('#login-component-email'))
            const password = loginComponentDebugElement.query(By.css('#login-component-password'))

            email.nativeElement.value = 'test #3'
            password.nativeElement.value = 'test'
            email.nativeElement.dispatchEvent(new Event('input'))
            password.nativeElement.dispatchEvent(new Event('input'));
            (button.nativeElement as HTMLButtonElement).click();
            tick()

            expect(component.login).toHaveBeenCalled();
            expect(instance(mockAuthSandbox).Login).toHaveBeenCalledWith({ strategy: 'local', email: 'test #3', password: 'test' })
            expect(instance(mockRouter).navigate).toHaveBeenCalledWith(['/'])
        }))
        it('#4 Should log in user with error and do not navigate to any url', fakeAsync(() => {
            component.ngOnInit()
            spyOn(component, "login").and.callThrough()
            spyOn(instance(mockRouter), "navigate")
            spyOn(instance(mockAuthSandbox), "Login").and.callThrough()


            let de = fixture.debugElement
            let loginComponentDebugElement: DebugElement = de.query(By.directive(LoginComponent))
            let button: DebugElement = loginComponentDebugElement.query(By.css('button'));

            // Sets credentials within login component
            const email = loginComponentDebugElement.query(By.css('#login-component-email'))
            const password = loginComponentDebugElement.query(By.css('#login-component-password'))

            email.nativeElement.value = 'test #4'
            password.nativeElement.value = 'test'
            email.nativeElement.dispatchEvent(new Event('input'))
            password.nativeElement.dispatchEvent(new Event('input'));
            (button.nativeElement as HTMLButtonElement).click();
            tick()

            expect(component.login).toHaveBeenCalled();
            expect(instance(mockAuthSandbox).Login).toHaveBeenCalledWith({ strategy: 'local', email: 'test #4', password: 'test' })
            expect(instance(mockRouter).navigate).not.toHaveBeenCalled()
        }))
        it('#5 Should show error message when user login is incorrect', fakeAsync(() => {
            component.ngOnInit()
            authSandboxError$.next('Login or password is incorrect (jasmine test)')
            tick()
            fixture.detectChanges()
            let de = fixture.debugElement
            let loginComponentDebugElement: DebugElement = de.query(By.directive(LoginComponent))

            // get login component error text
            let errorText = loginComponentDebugElement.query(By.css('#login-component-loginerror-container'))
            expect(errorText).not.toBeNull()
            expect((errorText.nativeElement as HTMLDivElement).textContent).toEqual('Login error : Login or password is incorrect (jasmine test)')
        }))
    })
})