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

  isLoggedIn = false;

  ngOnInit() {
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

  logout() {
    localStorage.clear();
    location.reload();
  }
}
