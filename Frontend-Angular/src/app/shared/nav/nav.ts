import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule, CommonModule, ModalComponent],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css'],
})
export class Nav implements OnInit {
  isSidebarOpen = false;
  isModalOpen = false;
  currentAvatar = 'assets/images/images (3).png';

  // 🔥 ESTO CONTROLARÁ SI MOSTRAR O NO ACCESO / INSCRIBIRSE
  isLoggedIn = false;

  ngOnInit() {
    // 🔥 VERIFICA SI EXISTE TOKEN REAL
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  openModal() {
    this.isModalOpen = true;
  }

  onAvatarSelected(avatar: string) {
    this.currentAvatar = avatar;
    this.isModalOpen = false;
  }

  // 🔥 Cerrar sesión desde la barra lateral
  logout() {
    localStorage.clear();
    location.reload();
  }
}
