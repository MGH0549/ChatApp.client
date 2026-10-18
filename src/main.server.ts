import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(App, config, context);
if (environment.production) {
  enableProdMode();
}


export default bootstrap;
