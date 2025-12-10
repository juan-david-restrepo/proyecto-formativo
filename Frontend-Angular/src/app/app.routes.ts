import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { AdminComponent } from './components/admin/admin';
import { Login } from './components/login/login';
import { Recuperar } from './components/recuperar/recuperar';
import { Registro } from './components/registro/registro';
import { SubirReporteComponent } from './components/subir-reporte/subir-reporte';
import { Parking } from './components/parking/parking';
import { Agente } from './components/agente/agente';
import { Footer } from './shared/footer/footer';
import { Soporte } from './components/soporte/soporte';
import { PicoPlaca } from './components/pico-placa/pico-placa';
import { Normas } from './components/normas/normas';


export const routes: Routes = [
    { path: '', component: Home },
    { path: 'home', component: Home },
    { path: 'admin', component: AdminComponent },
    { path: 'login', component: Login },
    { path: 'recuperar', component: Recuperar },
    { path: 'registro', component: Registro },
    { path: 'subir-reporte', component: SubirReporteComponent },
    { path: 'parking', component: Parking },
    { path: 'agente', component: Agente },
    { path: 'footer', component: Footer },
    { path: 'soporte', component: Soporte },
    { path: 'pico-placa', component: PicoPlaca },
    { path: 'normas', component: Normas }
];
