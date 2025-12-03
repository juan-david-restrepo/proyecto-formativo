import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
// import { authInterceptor } from './core/interceptors/auth.interceptor';  <-- si luego quieres agregarlo

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // 🔥 Necesario para llamar al backend
    provideHttpClient(),

    // Si luego activas el interceptor, habilitas esto:
    // provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
