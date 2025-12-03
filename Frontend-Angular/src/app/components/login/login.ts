import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Nav } from '../../shared/nav/nav';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
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
      if (
        typeof google === 'undefined' ||
        !google.accounts ||
        !google.accounts.oauth2
      ) {
        console.warn('Esperando a que cargue el SDK de Google...');
        setTimeout(checkGoogle, 500);
        return;
      }

      console.log('SDK de Google detectado y listo para OAuth2');
    };

    checkGoogle();
  }

  iniciarConGoogle(): void {
    if (
      typeof google === 'undefined' ||
      !google.accounts ||
      !google.accounts.oauth2
    ) {
      console.error('SDK de Google aún no está disponible');
      return;
    }

    console.log('Abriendo ventana grande de inicio de sesión de Google...');

    const client = google.accounts.oauth2.initTokenClient({
      client_id:
        '216216637079-tj6kkvojlq8d4rvjnucsmoov9d7lv8m0.apps.googleusercontent.com',
      scope: 'openid profile email',
      callback: (tokenResponse: any) => {
        console.log('Token recibido:', tokenResponse);
        this.obtenerDatosUsuario(tokenResponse.access_token);
      },
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
      });
      return;
    }

    const { email, password } = this.formLogin.value;

    this.authService.login(email, password).subscribe({
      next: (resp) => {
        console.log('Respuesta del backend:', resp);

        localStorage.setItem('token', resp.token);
        localStorage.setItem('userId', resp.userId);
        localStorage.setItem('email', resp.email);
        localStorage.setItem('role', resp.role);

        Swal.fire({
          icon: 'success',
          title: 'Bienvenido!',
          text: 'Inicio de sesión exitoso',
          timer: 1500,
          showConfirmButton: false,
        });

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);

        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: err.error || 'Credenciales incorrectas',
        });
      },
    });
  }
}