import {AuthenticationRequest} from '@feathersjs/authentication'


export interface loginCredentials extends AuthenticationRequest {
  strategy: string,
  email?: string,
  password?: string,
  requestedUrl?: string
}


export class UserBackendApiModel {
  /**
   * User email
   * Should be empty for anonymous users
   */
  name: string
  email?: string
  password?: string
}
export class UserModelBase extends UserBackendApiModel {
  _id?: string
  /**
   * User's roles
   */
  roles: string[]
  /**
   * User's application settings
   * TODO: implements "settings" type instead of "any"
   */
  settings: any[]
}
export class UserModel extends UserModelBase {
  /**
   * User nickname
   * Should be empty for anonymous users
   */
  nickname?: string;

  /**
   * Anonymous user flag 
   */
  anonymous: any
  isAnonymous: boolean;

  /**
   * Flag if user is loggedin (anonymous or not)
   */
  isLoggedIn: boolean;
  /**
   * flag to indicates if login/logout is in progress
   */
  isProgress: boolean;
  /**
   * Flag if login/logout error occured
   */
  isError: boolean;
  /**
   * The last login/logout error
   */
  error: string;

  constructor( user: UserModel ) {
    super()
    Object.assign( this, user );
  }
}

/**
 * 
 */
export class UsersModel {
  users: UserModelBase[]
  selected_user: UserModelBase
  previous_state_users: UserModelBase[]
  isLoading: boolean
  isError: boolean
  error: string
}