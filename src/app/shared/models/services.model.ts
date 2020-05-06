import { BackendServiceModel } from "./acl.services.model";

export class ServicesModel {
    services:BackendServiceModel[]
    isLoading:boolean
    isError:boolean
    error:string
}