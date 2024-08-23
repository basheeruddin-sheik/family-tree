import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BasicPrimitivesModule } from 'ngx-basic-primitives';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
  // Add your modifications here
};
