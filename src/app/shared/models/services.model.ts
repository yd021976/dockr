import { BackendServiceModel } from "./acl/backend-services.model";

export class ServicesModel {
    services:BackendServiceModel[]
    isLoading:boolean
    isError:boolean
    error:string
}