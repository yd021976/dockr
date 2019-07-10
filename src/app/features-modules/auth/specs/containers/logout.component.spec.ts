import { mock, instance, when, anything } from "ts-mockito";
import { AuthSandbox } from "../../auth.sandbox";
import { TestBed, ComponentFixture } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { LogoutContainer } from "../../containers/logout/logout.container";
import { FormsModule } from "@angular/forms";
import { LogoutComponent } from "../../components/logout/logout.component";
import { AppLoggerModule } from "src/app/shared/services/logger/app-logger/app-logger.module";
import { NgxsModule } from "@ngxs/store";
import { ApplicationState } from "src/app/shared/store/states/application.state";
import { UserState } from "src/app/shared/store/states/user.state";
import { TemplatesState } from "src/app/shared/store/states/templates.state";
import { LoginContainer } from "../../containers/login/login.container";
import { RegisterContainer } from "../../containers/register/register.component";
import { Router } from "@angular/router";
import { AppLoggerService } from "src/app/shared/services/logger/app-logger/service/app-logger.service";


describe('Auth module -- Containers -- Logout', () => {
    let fixture: ComponentFixture<LogoutContainer>
    let component: LogoutContainer

    describe('Unit tests - Mock', () => {
        let mockAuthSandbox: AuthSandbox = mock(AuthSandbox)
        let mockLogger: AppLoggerService = mock(AppLoggerService)
        when(mockAuthSandbox.loggerService).thenReturn(instance(mockLogger))

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [],
                providers: [
                    {
                        provide: AuthSandbox,
                        useFactory: () => instance(mockAuthSandbox)
                    }
                ],
                declarations: [LogoutContainer],
                schemas: [NO_ERRORS_SCHEMA]
            })
            fixture = TestBed.createComponent(LogoutContainer)
            component = fixture.componentInstance
        })
        it('#1 Should create component', () => {
            expect(component).toBeDefined()
        })
        it('#2 Should call sandbox logout when logout', () => {
            spyOn(component.sandbox, 'logout')
            component.onLogout()
            expect(component.sandbox.logout).toHaveBeenCalled()

        })
        it('#3 Should create child component', () => {
            let el: HTMLElement = fixture.nativeElement
            let child = el.querySelector('app-logout-component')
            expect(child).not.toEqual(null)
        })
    })
    describe('Integration tests', () => {
        beforeEach(() => {
            let mockRouter: Router = mock(Router)
            when(mockRouter.navigate(anything())).thenResolve(true)

            TestBed.configureTestingModule({
                imports: [
                    FormsModule,
                    AppLoggerModule.forRoot(),
                    NgxsModule.forRoot([ApplicationState, UserState, TemplatesState])
                ],
                providers: [
                    AuthSandbox,
                    {
                        provide: Router,
                        useFactory: () => instance(mockRouter)
                    }
                ],
                declarations: [LogoutContainer, LogoutComponent, LoginContainer, RegisterContainer],
                schemas: [NO_ERRORS_SCHEMA]
            })
            fixture = TestBed.createComponent(LogoutContainer)
            component = fixture.componentInstance
        })
        it('#1 Should create component', () => {
            expect(component).not.toEqual(null)
        })
        it('#2 Should create logout component', () => {
            let el: HTMLElement = fixture.nativeElement
            let child = el.querySelector('app-logout-component')
            expect(child).not.toEqual(null)

            let button: HTMLButtonElement = child.querySelector('button')
            expect(button).not.toEqual(null)
        })
        it('#3 Should call onLogout when logout component logout button is clicked', () => {
            spyOn(component, 'onLogout')

            let el: HTMLElement = fixture.nativeElement
            let child = el.querySelector('app-logout-component')
            expect(child).not.toEqual(null)

            let button: HTMLButtonElement = child.querySelector('button')
            expect(button).not.toEqual(null)

            button.click()

            expect(component.onLogout).toHaveBeenCalled()
        })
    })
})