import { AclServiceModel } from "./acl.services.model";

export class ServicesModel {
    services:AclServiceModel[]
    isLoading:boolean
    isError:boolean
    error:string
}