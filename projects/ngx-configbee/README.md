# ngx-configbee

ngx-configbee is an Angular library that provides seamless integration with ConfigBee, a Dynamic Configs & Feature Flags Management Platform. With ngx-configbee, you can easily manage dynamic configurations and feature flags within your Angular applications.

## Installation

You can install ngx-configbee via npm or yarn:

```bash
npm install ngx-configbee
# or
yarn add ngx-configbee
```

## Usage

### 1. Initialize the service

#### For AppModule

In your Angular application's root module (e.g., `AppModule`), initialize `NgxConfigbeeService` with provided values from platform:

```typescript
import { NgModule } from '@angular/core';
..
import { NgxConfigbeeService } from 'ngx-configbee';
..

@NgModule({
...
})
export class AppModule {
  constructor(cb: NgxConfigbeeService){
    cb.init({
    accountId: 'your-account-id',
    projectId: 'your-project-id',
    environmentId: 'your-environment-id'
    });
  }
  ...
}

```

**(OR)**

#### For Standalone Applications

If you have a standalone application without `AppModule`, you can use the same approach in your entry point file (e.g., `main.ts` or `app.config.ts`):

```typescript
import { APP_INITIALIZER } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgxConfigbeeService } from 'ngx-configbee';

function initializeConfigBee(cb: NgxConfigbeeService): () => Promise<any> {
  return () => cb.init({
    accountId: 'your-account-id',
    projectId: 'your-project-id',
    environmentId: 'your-environment-id'
  });
}

platformBrowserDynamic([
  {
    provide: APP_INITIALIZER,
    useFactory: initializeConfigBee,
    deps: [NgxConfigbeeService],
    multi: true
  }
]).bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

### 2. Use the service

Inject `NgxConfigbeeService` into your components or services to access dynamic configurations and feature flags:

  ```typescript
import { Component} from '@angular/core';
import { NgxConfigbeeService } from 'ngx-configbee';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(protected cb: NgxConfigbeeService) {}
}
```


**(Optional)** Subscribe to updates and invoke change detection:\
> **Note:** This is typically not required when using Default change detection strategy in componets,
required only when using OnPush change detection strategy

```typescript
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgxConfigbeeService } from 'ngx-configbee';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(protected cb: NgxConfigbeeService, private cd: ChangeDetectorRef) {}


  ngOnInit() {
    cb.updates.subscribe(event => {
      cd.markForCheck();
    });
  }
}
```
    
### 3. Access configurations in your templates

Use `NgxConfigbeeService` within your component templates to display dynamic configurations and feature flags:

```html
<div *ngIf="cb.isLoading">
    Loading..
</div>
<div *ngIf="cb.isActive">
    multilingual Enabled: {{cb.flags.multilingualEnabled?("Yes"):("No")}}
    <br/>
    side Bar Size: {{cb.numbers.sideBarSize}}
    <br/>
    top bar text: {{cb.texts.topBarText}}
    <br/>
    updateConfig <br/>-> active_versions: {{cb.jsons.updateConfig.active_versions}}
    <br/>
</div>
```

#### Note:

When accessing configurations through ngx-configbee, keys are automatically normalized to follow the standard JavaScript variable naming convention. For instance, if your configuration key in ConfigBee is "multilingual.enabled", ngx-configbee will transform it to "multilingualEnabled" for usage within your application.


### 4. Available methods and getters

#### Methods:

- `init({ accountId, projectId, environmentId,  normalizeKeys = true }: { accountId: string, projectId: string, environmentId: string, normalizeKeys?: boolean })`: Initializes the ConfigBee service with the provided values from platform. You can optionally set `normalizeKeys` to `false` if you want to disable automatic key normalization.

- `setTargetProperties(targetProperties:{[key: string]: string}):void`: Set/update target properties
- `unsetTargetProperties():void`: Clear target properties

#### Getters:

- `isActive`: Returns a boolean indicating whether the ConfigBee service is active.
- `isLoading`: Returns a boolean indicating whether the ConfigBee service is currently loading data.
- `isTargetingActive`: Returns a boolean indicating whether the ConfigBee targeting is active.
- `isTargetingLoading`: Returns a boolean indicating whether the ConfigBee targeting is currently loading data.
- `status`: Returns the current status of the ConfigBee service, which can be "INITIALIZING", "ACTIVE", "DEACTIVE", or "ERROR".
- `targetingStatus`: Returns the current targeting status of the ConfigBee service, which can be "INITIALIZING", "ACTIVE", "DEACTIVE", or "ERROR".
- `flags`: Returns an object containing dynamic feature flags.
- `texts`: Returns an object containing dynamic text configurations.
- `numbers`: Returns an object containing dynamic number configurations.
- `jsons`: Returns an object containing dynamic JSON configurations.
- `updates`: Returns an Observable that emits whenever there is an update in the configuration or flags data or status.

## Targeting
Configbee allows you to define target properties to tailor configurations based on specific criteria. You can set target properties either by using setTargetProperties, unsetTargetProperties service methods or by passing targetProperties to init.

### Example using setTargetProperties,unsetTargetProperties methods
```typescript

@Component({
  ...
})
export class MyComponent {
  constructor(private cb: NgxConfigbeeService, private cd: ChangeDetectorRef) {}

  loginSuccess() {
    cb.setTargetProperties({"userId": this.userId, "userName": this.userName})
  }
  logoutSuccess() {
    cb.unsetTargetProperties()
  }

}
```

### Example using init (only once while application initialization)
```typescript
configbeeService.init({
    accountId: 'your-account-id',
    projectId: 'your-project-id',
    environmentId: 'your-environment-id',
    targetProperties: {"userId": userId}
  });
```


## Resources
- [NOTICE](https://github.com/configbee/cb-client-angularjs/blob/main/NOTICE)
- [LICENSE](https://github.com/configbee/cb-client-angularjs/blob/main/LICENSE)
