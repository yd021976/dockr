import { BackendServiceModel } from "./backend-services.model";

export class ServicesModel {
    services:BackendServiceModel[]
    isLoading:boolean
    isError:boolean
    error:string
}