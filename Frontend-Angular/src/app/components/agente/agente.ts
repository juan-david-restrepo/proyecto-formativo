import { Component,  ViewChild,  } from '@angular/core';
import { Chart,  LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';


// Registrar los componentes necesarios de Chart.js
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

@Component({
  selector: 'app-agente',
  imports: [],
  templateUrl: './agente.html',
  styleUrls: ['./agente.css'],
})
export class Agente  {

 
}
