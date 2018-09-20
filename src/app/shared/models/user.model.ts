export type loginCredentials = {
  strategy: string,
  email?: string,
  password?: string,
  requestedUrl?: string

}

export class UserBackendApiModel {
  email: string;
  anonymous: any;
}

export class UserModel {
  /**
   * User nickname
   * Should be empty for anonymous users
   */
  nickname?: string;
  /**
   * User email
   * Should be empty for anonymous users
   */
  email?: string;
  /**
   * Anonymous user flag 
   */
  isAnonymous: boolean;

  /**
   * User's application settings
   * TODO: implements "settings" type instead of "any"
   */
  settings: any;
  /**
   * User's roles
   * TODO: implements "roles" type instead of "any"
   */
  roles: any;
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
}