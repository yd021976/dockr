import { AuthService } from './auth.service';
import { fakeAsync, async, tick } from '@angular/core/testing';
import { FeathersjsBackendService } from '../backend/socketio/backend-feathers.service';
import { mock, instance, when, deepEqual, reset, verify, resetCalls } from 'ts-mockito';
import { NotificationBaseService } from '../notifications/notifications-base.service';
import { AppLoggerService } from '../logger/app-logger/service/app-logger.service';
import { BehaviorSubject } from 'rxjs';
import { BackendServiceConnectionState, stateChangeReason } from '../../models/backend-service-connection-state.model';
import { AppError, errorType } from '../../models/app-error.model';

describe('AuthService', () => {
    var authService: AuthService = null
    var MockNotifications: NotificationBaseService = null
    var MockLoggerService: AppLoggerService = null

    var MockFeathersBackend: FeathersjsBackendService = null
    var MockFeathersBackendInstance: FeathersjsBackendService = null
    var backendState: BackendServiceConnectionState = null
    var backendState$: BehaviorSubject<BackendServiceConnectionState> = null

    const authRequest = { email: 'test', password: 'test', strategy: 'local' }
    const authRequestAnonymous = { strategy: 'anonymous' }
    const authSuccessUser = {
        email: 'ok', anonymous: false
    }

    describe('#Unit-Tests', () => {
        describe('#Mock feathersJs service', () => {
            beforeEach(async(() => {
                MockNotifications = mock(NotificationBaseService)
                MockLoggerService = mock(AppLoggerService)
                MockFeathersBackend = mock(FeathersjsBackendService)

                backendState = new BackendServiceConnectionState();
                backendState$ = new BehaviorSubject<BackendServiceConnectionState>(backendState);

                when(MockFeathersBackend.connectionState$).thenReturn(backendState$)
                // Create auth service instance
                MockFeathersBackendInstance = instance(MockFeathersBackend);
                authService = new AuthService(MockLoggerService, MockFeathersBackendInstance, MockNotifications);
                expect(authService).toBeTruthy();
            }));
            it('#1 Should authenticate user with success', async () => {
                when(MockFeathersBackend.authenticate(deepEqual({ email: 'test', password: 'test', strategy: 'local' })))
                    .thenResolve(authSuccessUser)

                var user = null
                await authService.authenticate(authRequest)
                    .then((result) => { user = result })
                    .catch(() => expect(true).toBe(false))

                expect(user).toEqual(authSuccessUser)
            })

            it('#2 Should auth as anonymous with success when triggering socket backend connect event', fakeAsync(() => {
                // Mock feathers authenticate call
                when(MockFeathersBackend.authenticate(deepEqual({ strategy: 'anonymous' })))
                    .thenResolve(authSuccessUser)

                // Return false because we want auth service to log in as anonymous
                when(MockFeathersBackend.isAuth()).thenResolve(false)

                // update behavior subject to trigger auth service login
                MockFeathersBackendInstance.connectionState$.next({ isConnected: true, connectionError: '', attemptNumber: 0, changeReason: stateChangeReason.socketIO_Connected })
                tick();
                verify(MockFeathersBackend.authenticate(deepEqual({ strategy: 'anonymous' }))).once();
            }))
            it('#2.1 Should auth as anonymous with error when triggering socket backend connect event', fakeAsync(() => {
                // Mock feathers authenticate call
                when(MockFeathersBackend.authenticate(deepEqual({ strategy: 'anonymous' })))
                    .thenReject(new AppError('Jasmine error test', errorType.notAuthenticated))

                // Return false because we want auth service to log in as anonymous
                when(MockFeathersBackend.isAuth()).thenResolve(false)

                // update behavior subject to trigger auth service login
                MockFeathersBackendInstance.connectionState$.next({ isConnected: true, connectionError: '', attemptNumber: 0, changeReason: stateChangeReason.socketIO_Connected })
                tick();
                verify(MockFeathersBackend.authenticate(deepEqual({ strategy: 'anonymous' }))).once();
            }))
            it('#3 Should throw error when triggering socket backend connect event when no token exist', fakeAsync(() => {
                var isUserAuth = false;

                // Mock feathers authenticate call : Simulate auth error
                when(MockFeathersBackend.authenticate(null))
                    .thenReject(new AppError('Jasmine error test', errorType.notAuthenticated))

                // Return true because we want auth service to log in with existing token (no token created)
                when(MockFeathersBackend.isAuth()).thenResolve(true)

                // Subscribe to auth service observable that update auth user
                authService.initialAuthentication$.subscribe((user) => {
                    if (user !== null) isUserAuth = true;
                })
                // update behavior subject to trigger auth service login
                MockFeathersBackendInstance.connectionState$.next({ isConnected: true, connectionError: '', attemptNumber: 0, changeReason: stateChangeReason.socketIO_Connected })
                tick();

                // Auth service shouldn't had auth user because there is no token from previous auth user
                expect(isUserAuth).toBe(false);
            }))
            it('#4 Should re-auth last logged in user when triggering socket backend connect event', fakeAsync(() => {
                var isUserAuth = false;

                // Mock feathers authenticate call : Simulate auth error
                when(MockFeathersBackend.authenticate(null))
                    .thenResolve(authSuccessUser)

                // Return true because we want auth service to log in with existing token (no token created)
                when(MockFeathersBackend.isAuth()).thenResolve(true)

                // Subscribe to auth service observable that update auth user
                authService.initialAuthentication$.subscribe((user) => {
                    if (user !== null) isUserAuth = true;
                })
                // update behavior subject to trigger auth service login
                MockFeathersBackendInstance.connectionState$.next({ isConnected: true, connectionError: '', attemptNumber: 0, changeReason: stateChangeReason.socketIO_Connected })
                tick();

                // Auth service shouldn't had auth user because there is no token from previous auth user
                expect(isUserAuth).toBe(true);
            }))
            it('#5 Should not authenticate when backend throw error', fakeAsync(() => {
                var errorFlag = false;

                // Mock feathers authenticate call
                when(MockFeathersBackend.authenticate(deepEqual({ email: 'test', password: 'test', strategy: 'local' })))
                    .thenReject(new AppError('Feathers error', errorType.notAuthenticated, 'Jasmine test'))

                authService.authenticate({ email: 'test', password: 'test', strategy: 'local' }).catch((error) => {
                    errorFlag = true
                })
                tick()
                expect(errorFlag).toBe(true)
            }))
            it('#6 Should logout with success', fakeAsync(() => {
                var logoutFlag = false;

                // Mock feathers logout
                when(MockFeathersBackend.logout()).thenResolve(null)

                authService.logout().then(() => {
                    logoutFlag = true;
                })
                tick()
                expect(logoutFlag).toBe(true)
            }))
            it('#7 Should logout with error', fakeAsync(() => {
                var logoutFlag = true;

                // Mock feathers logout
                when(MockFeathersBackend.logout()).thenReject(false)

                authService.logout().catch((status) => logoutFlag = false)
                tick()
                expect(logoutFlag).toBe(false)
            }))
            it('#8 Should check session active : Return true when user is autenticated', fakeAsync(() => {
                var checkSessionActive = false;

                // Mock feathers :
                // 1 : To return current authenticated user as anonymous
                when(MockFeathersBackend.getCurrentUser()).thenReturn({ anonymous: true });
                // 2 : To return that user is authenticated
                when(MockFeathersBackend.isAuth()).thenResolve(true);

                authService.checkSessionActive().then((isAuth) => {
                    checkSessionActive = isAuth;
                })
                tick()
                expect(checkSessionActive).toBe(true);
            }))
            it('#9 Should check session active : Return false and re-auth user as anonymous', fakeAsync(() => {
                var checkSessionActive = false;

                // Given last logged in user was anonymous

                // Mock feathers :
                // 1 : To return current authenticated user as anonymous
                when(MockFeathersBackend.getCurrentUser()).thenReturn({ anonymous: true });
                // 2 : To return that user is NOT authenticated
                when(MockFeathersBackend.isAuth()).thenResolve(false);
                // 3 : To simulate anonymous auth with success
                when(MockFeathersBackend.authenticate(deepEqual({ strategy: 'anonymous' }))).thenResolve({ email: 'test' })

                // then checksessionactive return false and log user as anonymous
                authService.checkSessionActive().then((isAuth) => {
                    checkSessionActive = isAuth;
                })
                tick()
                expect(checkSessionActive).toBe(false);
            }))
            it('#10 Should check session active : Throw error when re-auth user as anonymous', fakeAsync(() => {
                var checkSessionActive = false;

                // Given last logged in user was anonymous

                // Mock feathers :
                // 1 : To return current authenticated user as anonymous
                when(MockFeathersBackend.getCurrentUser()).thenReturn({ anonymous: true });
                // 2 : To return that anonymous user is NOT authenticated
                when(MockFeathersBackend.isAuth()).thenResolve(false);
                // 3 : To simulate anonymous auth with success
                when(MockFeathersBackend.authenticate(deepEqual({ strategy: 'anonymous' })))
                    .thenReject(new AppError('Feathers error', errorType.notAuthenticated, 'Jasmine test'))

                // then checksessionactive throws error as feathers can't auth anonymous user
                authService.checkSessionActive().catch((error) => {
                    checkSessionActive = true; // Set to true if error is thrown
                })
                tick()
                expect(checkSessionActive).toBe(true);
            }))
            it('#11 Should check session active : Throw error when last logged in user was not anonymous', fakeAsync(() => {
                var checkSessionActive = false;

                // Given last logged in user was anonymous

                // Mock feathers :
                // 1 : To return current authenticated user as NOT anonymous
                when(MockFeathersBackend.getCurrentUser()).thenReturn({ anonymous: false });
                // 2 : To return that user is NOT authenticated
                when(MockFeathersBackend.isAuth()).thenResolve(false);

                // then checksessionactive throw error as it can't log user again (because not anonymous)
                authService.checkSessionActive().catch((error) => {
                    checkSessionActive = true; // Set to true if error is thrown
                })
                tick()
                expect(checkSessionActive).toBe(true);
            }))
        })
        describe('#Unmocked feathersJs service',()=>{
            
        })
    })


})