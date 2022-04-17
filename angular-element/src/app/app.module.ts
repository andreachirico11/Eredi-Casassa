import { ApplicationRef, DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {
    customElements.define(
      'angular-component',
      createCustomElement(AppComponent, { injector: this.injector })
    );
  }

  ngDoBootstrap(appRef: ApplicationRef): void {}
}
