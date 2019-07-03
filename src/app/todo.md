## Application developper todo list

- <b>Auth module</b>
    * [x] Structure with root container (app-outlet) like admin module
<br>

- <b>Authentication (module & service)</b>
    * [x] Refactor and simplify auth mechanism for 1st connection and token expiration
<br>

- <b>Settings module</b>
    * [x] Structure module with root container/dumb components (app-outlet) like admin module
<br>

- <b>Notification system</b>
    * [ ] Un duplicate notification service and notifications state (Should remove references to the service "NotificationBaseService" and keep state instead) 
<br>

- <b>ACL mechanism</b> (need to be more detailed)
    * [ ] Implement ACL control in front end  (services, guards, components ...)
    * [x] Backend : Implement storage
    * [ ] Backend : Implement ACL controls
<br>
    
- <b>Front end modules</b>
    * [ ] Users
    * [ ] Settings
    * [x] Acl
    * [ ] Document templates (a lot of work)
    * [ ] Document module (view, search, edit properties)
    * [ ] Dashboard
<br>

- <b>Unit tests</b>
    * [ ] Complete unit tests for Store, main app component
    * [ ] Do we need to unit test for Store states/actions ? If yes : How ?