### **Angular 21 Resource Demo Avatars + .NET/C# WebAPI + PostgreSQL database**

A demo that demonstrates the **Angular 21** _Resource_ function.  
It uses a simple .NET/C# WebAPI as Backend and a PostgreSQL database.  
The .NET/C# WebAPI stores Avatars/images in the database as base64-strings.

The Angular application uses interfaces and abstract Injectables to reduce the amount of code.  
And the Angular application can fetch, filter, create, update and delete Avatars/images.  
The Angular application is _Zoneless_ (no Zone.js) and without _RxJs_.  

See the images in the root of this project for examples.

### **PostgreSQL database:**

See the folder: _Docker\_PostgreSQL\_database_ with the docker-compose file.

Command to add the _docker container_:

**docker-compose up --build -d**

### **Add database migrations**

Install the **dotnet ef-tool** - version: 8.0.11 or above

When the tool is installed, run the command for a _database migration:_

**dotnet ef database update**

For more information see the link below:

[https://learn.microsoft.com/en-us/ef/core/cli/dotnet](https://learn.microsoft.com/en-us/ef/core/cli/dotnet)

### **Angular application (with** [**Angular CLI**](https://github.com/angular/angular-cli) **version 21.2.3) installation**

**Angular 21** needs a **Node.js** version of at least _20.19.0_

**Command to install**

_npm install_

or shorter:

_npm i_

**Command to run the application:**

_ng serve --open_

or shorter:

_ng s --o_

### **Changelog:**

_March 2026_

**Frontend:**

\- Updated packages for Angular 21.

\- Removed empty homepage.

\- Updated _Vitest_ specification/test files for future use.

\- Changed abstract classes to Injectables for reusability, maintainability and lesser code.

\- Replaced _Reactive Form_ with _Signal Form_.

\- Various changes in templates and components.

**Backend:**

\- Added 5 new Avatars.

\- Changes in code to add more Avatars easily in the future.

_November 2025_

\- Upgrade to _Angular 21_ and upgraded other packages.

*   Removed deprecated _Karma_ and installed _Vitest._
*   Migrated _Jasmine_ tests to _Vitest_ tests for future use (command: **ng generate refactor-jasmine-vitest**).
*   _HttpClient_ removed from _app.config.ts_ (_HttpClient_ is default in _Angular 21_).

_July 2025_

\- Removed _Zone.js_, removed _RxJS_ and removed polyfills from _angular.json_.

\- Using in Angular 20 the _params_ option of _resource_ function (in stead of _request_ option of Angular 19).

\- Using the keyword **readonly** for properties initialized by Angular (input(), output(), model()).

\- Using the keyword **protected** for properties that are only accessible in the template.

_\- Various other small changes._