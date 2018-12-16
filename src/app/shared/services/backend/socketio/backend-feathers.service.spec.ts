import { AppLoggerService } from '../../logger/app-logger/service/app-logger.service';
import { fakeAsync, async, tick } from '@angular/core/testing';
import { mock, instance, when, deepEqual, verify } from 'ts-mockito';
import { FeathersjsBackendService } from './backend-feathers.service';
import { BackendConfigClass } from 'src/app/shared/models/backend-config.model';
import { Server, SocketIO } from 'mock-socket/dist/mock-socket';

describe('Feathers backend service', () => {
    var MockLoggerService: AppLoggerService = null
    var mockSocketServer: Server = null
    var feathersBackendService: FeathersjsBackendService = null
    const fakeURL: string = 'http://localhost:3030'
    var feathersBackendServiceConfig: BackendConfigClass = { apiEndPoint: fakeURL }

    // create fake websocket server
    beforeAll(() => {
        mockSocketServer = new Server(fakeURL);
    })


    beforeEach(async () => {
        mockSocketServer.on('connection', socket => {
            socket.on('upgrade', data => {
                socket.emit('jasmine test socket upgrade')
            })
            socket.on('authenticate', data => {
                socket.emit('jasmine test authenticate')
            })
        })
        MockLoggerService = mock(AppLoggerService)
        const socketIO = SocketIO;
        feathersBackendService = new FeathersjsBackendService(instance(MockLoggerService), null)

        expect(feathersBackendService).not.toBeNull()
    })

    afterEach(async() => {
       await feathersBackendService.logout(); // ensure we are logged out
    })

    it('#1 - Should authenticate as anonymous', async () => {
        var isAuth: boolean = false;
        await feathersBackendService.authenticate({ strategy: 'anonymous' })
            .then((user) => {
                isAuth = true;
            })
            .catch((error) => {
                let a = 0; // for debug purpose only
            })
        expect(isAuth).toBe(true);
    })
    it('#2 - Should fail authenticate', async () => {
        var isAuth: boolean = true;
        await feathersBackendService.authenticate({ strategy: 'local', email: 'jasmine_test_error', password: 'test' })
            .then((user) => {
                isAuth = true;
            })
            .catch((error) => {
                isAuth = false;
            })
        expect(isAuth).toBe(false);
    })
    it('#3 - Should be authenticated after successful anonymous auth', async () => {
        var isAuth: boolean = false;
        await feathersBackendService.authenticate({ strategy: 'anonymous' })
            .then(async (user) => {
                await feathersBackendService.isAuth().then((auth) => {
                    isAuth = auth;
                })
            })
            .catch((error) => {
                isAuth = false;
            })
        expect(isAuth).toBe(true);
    })
    it('#4 - Should be authenticated after successful real user auth', async () => {
        var isAuth: boolean = false;
        await feathersBackendService.authenticate({ strategy: 'local', email: 'jasmine_test', password: 'yann' })
            .then(async (user) => {
                await feathersBackendService.isAuth().then((auth) => {
                    isAuth = auth;
                })
            })
            .catch((error) => {
                isAuth = false;
            })
        expect(isAuth).toBe(true);
    })
    it('#5 - Should return user object after successful real user auth', async () => {
        await feathersBackendService.authenticate({ strategy: 'local', email: 'jasmine_test', password: 'yann' })
            .then((user) => {
            })
            .catch((error) => {
            })
        var user = null;
        user = feathersBackendService.getCurrentUser()
        expect(user).toBeTruthy();
    })
    it('#6 - Should logout', async () => {
        var isAuth = false;
        var isLogout = false;

        await feathersBackendService.authenticate({ strategy: 'local', email: 'jasmine_test', password: 'yann' })
            .then((user) => {
                isAuth = true;
            })
            .catch((error) => {
            })

        expect(isAuth).toBe(true); // should be auth

        await feathersBackendService.logout()
            .then((status) => {
                isLogout = true;
            })
            .catch(error => { })
        expect(isLogout).toBe(true);
    })
    it('#7 - Should NOT be authenticated at start', async () => {
        var isAuth: boolean = false;
        await feathersBackendService.isAuth()
            .then((auth) => {
                isAuth = auth;
            })
            .catch((error) => {
                isAuth = false;
            })
        expect(isAuth).toBe(false);
    })
})