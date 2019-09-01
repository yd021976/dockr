import { APP_BASE_HREF } from '@angular/common';
import { inject, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
import { UserModel } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AppLoggerModule } from 'src/app/shared/services/logger/app-logger/app-logger.module';
import { User_Action_Login_Success, User_Action_Logout_Success } from 'src/app/shared/store/actions/user.actions';
import { ApplicationState } from 'src/app/shared/store/states/application.state';
import { TemplatesState } from 'src/app/shared/store/states/templates.state';
import { UserState } from 'src/app/shared/store/states/user.state';
import { AuthSandbox } from '../../sandboxes/auth.sandbox';


describe('Auth.sandbox', () => {
    const LocalLoginRequest = {
        "strategy": "local",
        "email": "jasmine_test",
        "password": "test"
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NgxsModule.forRoot([ApplicationState, UserState, TemplatesState]),
                AppLoggerModule.forRoot(),
                RouterModule.forRoot([])
            ],
            providers: [
                AuthSandbox,
                AuthService,
                { provide: APP_BASE_HREF, useValue: '/' }
            ]
        })
    })
    it('#1 Should logout user and dispatch store action', inject([AuthSandbox, Store], async (authSandbox: AuthSandbox, store: Store) => {
        spyOn(store, "dispatch").and.callThrough()
        await authSandbox.logout().then((result) => { })
        expect(store.dispatch).toHaveBeenCalledWith(new User_Action_Logout_Success())
    }))
    it('#2 Should login user and dispatch store action', inject([AuthSandbox, Store], async (authSandbox: AuthSandbox, store: Store) => {
        let authResult: boolean
        let isLoggedin: boolean = true
        let currentUser: UserModel
        let s: Subscription[] = []

        // We should not be logged in at start
        s.push(authSandbox.isLoggedin$.subscribe((state) => {
            isLoggedin = state
        }))
        expect(isLoggedin).toEqual(false)

        // Log in user
        spyOn(store, "dispatch").and.callThrough()
        await authSandbox.Login(LocalLoginRequest).then((result) => {
            authResult = result
        })
        s.push(authSandbox.currentUser$.subscribe((state) => {
            currentUser = state
        }))
        expect(authResult).toEqual(true)
        
        let t = (store.dispatch as jasmine.Spy).calls.mostRecent().args[0]
        expect(t instanceof User_Action_Login_Success).toBeTruthy()

        // Clean subscriptions
        s.forEach((sub) => { sub.unsubscribe() })
    }))
})