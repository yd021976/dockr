export class ApplicationStateModel {
    isRequestingBackend:boolean; // Wether the app is currently making a call to any backend service
    isLoggedIn:boolean; // Is a user logged in (except for anonymous that are considered as not logged in users)
}