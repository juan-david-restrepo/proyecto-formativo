import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Nav } from '../../shared/nav/nav';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, Nav, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit {
  formLogin: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.formLogin = this.fb.group({
      rol: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.initializeGoogleSDK();
  }

  private initializeGoogleSDK(): void {
    const checkGoogle = () => {
      if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
        console.warn('Esperando a que cargue el SDK de Google...');
        setTimeout(checkGoogle, 500);
        return;
      }

      console.log('SDK de Google detectado y listo para OAuth2');
    };

    checkGoogle();
  }

  iniciarConGoogle(): void {
    if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
      console.error('SDK de Google aún no está disponible');
      return;
    }

    console.log('Abriendo ventana grande de inicio de sesión de Google...');

    const client = google.accounts.oauth2.initTokenClient({
      client_id: '216216637079-tj6kkvojlq8d4rvjnucsmoov9d7lv8m0.apps.googleusercontent.com',
      scope: 'openid profile email',
      callback: (tokenResponse: any) => {
        console.log('Token recibido:', tokenResponse);
        this.obtenerDatosUsuario(tokenResponse.access_token);
      }
    });

    client.requestAccessToken();
  }

  private async obtenerDatosUsuario(accessToken: string) {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await res.json();
      console.log('Datos del usuario:', data);

      localStorage.setItem('google_user', JSON.stringify(data));

      Swal.fire({
        icon: 'success',
        title: `¡Bienvenido, ${data.name || 'usuario'}!`,
        text: 'Inicio de sesión exitoso con Google',
        showConfirmButton: false,
        timer: 1800,
      });

      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Error al obtener la información del usuario:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: 'No se pudo obtener la información del usuario.',
      });
    }
  }

  onSubmit(): void {
    if (this.formLogin.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos correctamente.',
        confirmButtonText: 'Entendido',
      });
      return;
    }

    const { rol, email, password } = this.formLogin.value;
    if (!rol) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona un rol',
        text: 'Debes seleccionar tu tipo de usuario para continuar.',
        confirmButtonText: 'Entendido',
      });
      return;
    }

    localStorage.setItem('usuario', JSON.stringify({ rol, email, password }));

    Swal.fire({
      icon: 'success',
      title: `Bienvenido, ${rol.charAt(0).toUpperCase() + rol.slice(1)}!`,
      text: 'Redirigiendo a tu panel...',
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true,
    }).then(() => {
      if (rol === 'administrador') {
        this.router.navigate(['/admin']);
      } else if (rol === 'agente') {
        this.router.navigate(['/agente']);
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}