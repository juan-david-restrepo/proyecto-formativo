import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';


@Component({
  selector: 'app-normas',
  imports: [Nav,Footer],
  templateUrl: './normas.html',
  styleUrls: ['./normas.css']
})
export class Normas {

  constructor(private router: Router) {}

  volverInicio() {
    this.router.navigate(['/home']);
  }

}
