import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Nav } from '../../shared/nav/nav';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, Nav, CurrencyPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {

  carouselItems = [
    {
      id: 1, 
      imagen: 'https://media.discordapp.net/attachments/1372666423423537152/1438278621809610804/principal.png?ex=69164cd9&is=6914fb59&hm=3c869550ecd66eb1bd28f0515b12b2104e5e90d9ab67f6c525d1c6eeb47c6967&=&format=webp&quality=lossless&width=1376&height=774',
      titulo: 'Puedes hacer reportes de infracciones viales',
      direccion: '/subir-reporte', 
      boton: 'Reporta'
    },

    {
      id: 2, 
      imagen: 'https://www.armenia.gov.co/wp-content/uploads/2024/Boletines_Febrero_2024_/Boletn_para_27_de_febrero/FOTO_SETTA_2_PROYECTO.JPG',
      titulo: 'Puedes ver parqueaderos en tu area', 
      direccion: '/parking',
      boton: 'ver parqueaderos'
    },

    {
      id: 3, 
      imagen: 'https://media.discordapp.net/attachments/1372666423423537152/1438278621809610804/principal.png?ex=69164cd9&is=6914fb59&hm=3c869550ecd66eb1bd28f0515b12b2104e5e90d9ab67f6c525d1c6eeb47c6967&=&format=webp&quality=lossless&width=1376&height=774',
      titulo: 'La seguridad vial empieza contigo. Reporta, participa, mejora tu ciudad', 
      direccion: '/register',
      boton: 'Registrate'
    }

  ];
  
  currentIndex = 0;
  intervalId: any;
  fade = false; // 🔹 Nueva variable para controlar la animación

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.nextImage();
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  nextImage() {
    this.fade = true;
    setTimeout(() => {
      this.currentIndex = (this.currentIndex + 1) % this.carouselItems.length;
      this.fade = false;
    }, 500); // duración de fade-out
  }

  prevImage() {
    this.fade = true;
    setTimeout(() => {
      this.currentIndex = (this.currentIndex - 1 + this.carouselItems.length) % this.carouselItems.length;
      this.fade = false;
    }, 500);
  }


}
