import { TemplatesService } from './templates.service';
import { AppLoggerService } from '../logger/app-logger/service/app-logger.service';
import { mock, instance, when, deepEqual, reset, verify, resetCalls } from 'ts-mockito';
import { FeathersjsBackendService } from '../backend_API_Endpoints/socketio/backend-feathers.service';
import { fakeAsync, tick } from '@angular/core/testing';
import feathers, { Service, ServiceMethods } from '@feathersjs/feathers';
import { AppError } from '../../models/application.error.model';

describe('Templates service', () => {
    describe('#Unit tests', () => {
        var MockLoggerService: AppLoggerService = null
        var mockFeathers: FeathersjsBackendService = null
        var mockFeathersInstance: FeathersjsBackendService = null
        var templateServiceInstance: TemplatesService = null

        describe('When API server is Mocked', () => {
            beforeEach(() => {
                MockLoggerService = instance(mock(AppLoggerService))
                mockFeathers = mock(FeathersjsBackendService)
                mockFeathersInstance = instance(mockFeathers)
            })


            it('#1 - (Mock server) Should return a list of templates', fakeAsync(() => {
                var serviceResults = []
                // Mock the feathers service "templates" find method to return data
                var mockService = {
                    find: (): Promise<any> => { return new Promise((resolve, reject) => { resolve([{ data: 'data1' }, { data: 'data2' }]) }) }
                }
                when(mockFeathers.service('templates')).thenReturn(mockService as Service<any>)

                templateServiceInstance = new TemplatesService(mockFeathersInstance, MockLoggerService);
                expect(templateServiceInstance).toBeTruthy();


                templateServiceInstance.find()
                    .then((templates) => {
                        serviceResults = templates
                    })
                    .catch((error) => {

                    })
                tick()
                expect(serviceResults.length).not.toEqual(0)
            }))
            it('#2 - Should return error on server crash', fakeAsync(() => {
                var error = false

                // Mock the feathers service "templates" find method to return data
                var mockService = {
                    find: (): Promise<any> => {
                        return new Promise((resolve, reject) => {
                            reject(new Error('jasmine unit test error'))
                        })
                    }
                }
                when(mockFeathers.service('templates')).thenReturn(mockService as Service<any>)

                templateServiceInstance = new TemplatesService(mockFeathersInstance, MockLoggerService);
                expect(templateServiceInstance).toBeTruthy();


                templateServiceInstance.find()
                    .then((templates) => {
                        error = false
                    })
                    .catch((returnedError) => {
                        error = true
                    })
                tick()
                expect(error).toEqual(true)
            }))
        })
        describe('When API server is NOT Mocked', () => {
            beforeEach(() => {
                MockLoggerService = instance(mock(AppLoggerService))
                mockFeathers = new FeathersjsBackendService(MockLoggerService, null)
                templateServiceInstance = new TemplatesService(mockFeathers, MockLoggerService)
            })

            it('#1 Should receive templates list', async () => {
                var templates = []
                // we must log in user
                await mockFeathers.authenticate({ strategy: 'anonymous' })

                await templateServiceInstance.find({ query: { returnType: 'results' } })
                    .then((result) => {
                        templates = result
                    })
                    .catch((error) => {
                        templates = []
                    })
                // Then logout user
                await mockFeathers.logout()
                expect(templates.length).not.toEqual(0);
            })
            it('#2 Should catch error when server crash', async () => {
                var templates = [], errorResult: any
                // we must log in user
                await mockFeathers.authenticate({ strategy: 'anonymous' })

                await templateServiceInstance.find({ query: { returnType: 'error' } })
                    .then((result) => {
                        templates = result
                    })
                    .catch((error) => {
                        errorResult = error
                    })
                // Then logout user
                await mockFeathers.logout()
                expect(errorResult instanceof AppError).toBe(true)
            })

        })
    })
    describe('#Integration tests -- NONE to be run', () => {
    })
})