import { TestBed, ComponentFixture } from "@angular/core/testing";
import { RouterModule } from "@angular/router";
import { NgxsModule } from "@ngxs/store";
import { AppLoggerModule } from "src/app/shared/services/logger/app-logger/app-logger.module";
import { ApplicationState } from 'src/app/shared/store/states/application.state';
import { TemplatesState } from 'src/app/shared/store/states/templates.state';
import { UserState } from 'src/app/shared/store/states/user.state';
import { NotificationBaseService } from "src/app/shared/services/notifications/notifications-base.service";
import { AuthSandbox } from "../../../../shared/sandboxes/auth.sandbox";
import { AuthService } from "src/app/shared/services/auth/auth.service";
import { APP_BASE_HREF } from "@angular/common";
import { LogoutComponent } from "../../components/logout/logout.component";





describe('Auth module -- Components -- Logout', () => {
    var component: LogoutComponent
    var fixture: ComponentFixture<LogoutComponent>

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [],
            declarations: [LogoutComponent]
        })
        fixture = TestBed.createComponent(LogoutComponent)
        component = fixture.componentInstance;
    })
    it('#1 Should be created', () => {
        expect(component).toBeDefined();
    })
    it('#2 Should contains logout button', () => {
        const logoutElement: HTMLElement = fixture.nativeElement
        const buttonElement = logoutElement.querySelector('button')
        const buttonText = buttonElement.textContent

        expect(buttonText).toEqual('Confirm')
    })
    it('#3 Should show logged out message when isLoggedOut is true', () => {
        component.isLoggedOut = true
        fixture.detectChanges()
        const logoutElement: HTMLElement = fixture.nativeElement
        const div = logoutElement.querySelector('#logout-component-loggedout')
        expect(div).not.toBeNull()
    })
    it('#4 Should emit event when user click log out button', () => {
        var isClicked: boolean = false

        component.isLoggedOut = false
        fixture.detectChanges()
        const logoutElement: HTMLElement = fixture.nativeElement
        const button: HTMLButtonElement = logoutElement.querySelector('button#logout-component-logout-button')
        component.logout.subscribe((event) => {
            isClicked = true
        })
        button.click()

        expect(isClicked).toBeTruthy()
    })
})