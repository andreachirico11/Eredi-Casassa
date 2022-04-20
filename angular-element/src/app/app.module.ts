import { ApplicationRef, DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';

import { AppComponent } from './app.component';
import { DeleteButtonRender } from './delete-button-render';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AgGridModule.withComponents([DeleteButtonRender])],
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
