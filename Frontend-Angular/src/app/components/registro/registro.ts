import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Nav } from '../../shared/nav/nav';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../service/auth.service';

declare const google: any;

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, CommonModule, Nav, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css'],
})
export class Registro implements OnInit {
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registroForm = this.fb.group({
      // Campos existentes
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required], // Nuevos campos requeridos por el backend/lógica
      tipoDocumento: ['', Validators.required], // Ej: Cédula de Ciudadanía, Pasaporte
      numeroDocumento: ['', Validators.required],
      rol: ['Ciudadano', Validators.required], // Valor por defecto 'Ciudadano'
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

  registrarConGoogle(): void {
    if (
      typeof google === 'undefined' ||
      !google.accounts ||
      !google.accounts.oauth2
    ) {
      console.error('SDK de Google aún no está disponible');
      return;
    }

    const client = google.accounts.oauth2.initTokenClient({
      client_id:
        '216216637079-tj6kkvojlq8d4rvjnucsmoov9d7lv8m0.apps.googleusercontent.com',
      scope: 'openid profile email',
      callback: (tokenResponse: any) => {
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

      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      usuarios.push({
        nombre: data.name,
        correo: data.email,
        rol: 'usuario_google',
      });
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      // Dentro de private async obtenerDatosUsuario(accessToken: string) { ... }
      // ...
      Swal.fire({
        icon: 'success',
        title: `¡Bienvenido, ${data.name || 'usuario'}!`,
        text: 'Registro exitoso con Google',
        showConfirmButton: false,
        timer: 1800,
      }).then(() => {
        // Aseguramos la navegación SOLO después de que el Swal se cierra (por timer)
        this.router.navigate(['/dashboard']);
      });
      // ¡IMPORTANTE! Quita el 'this.router.navigate(['/dashboard']);' que estaba fuera del then().
    } catch (error) {
      console.error('Error al obtener la información del usuario:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: 'No se pudo obtener la información del usuario.',
      });
    }
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor llena todos los campos correctamente.',
      });
      return;
    }

  const data = {
    nombreCompleto: this.registroForm.value.nombre,
    email: this.registroForm.value.correo,
    password: this.registroForm.value.contrasena,
    tipoDocumento: this.registroForm.value.tipoDocumento,
    numeroDocumento: this.registroForm.value.numeroDocumento,
    rol: this.registroForm.value.rol, // 'Ciudadano' por defecto
  };

this.authService.register(data).subscribe({
  next: (resp: any) => {
    // 1. **GUARDAR EL TOKEN (INICIO DE SESIÓN AUTOMÁTICO)**
    if (resp && resp.token) {
      localStorage.setItem('authToken', resp.token);
      // Puedes guardar más info si es necesario, como resp.role
      localStorage.setItem('userRole', resp.role);
    }

    Swal.fire({
      icon: 'success',
      title: '¡Registro exitoso!',
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      // 2. **REDIRECCIONAR A LA PÁGINA PRINCIPAL**
      this.router.navigate(['/dashboard']); // <-- Redirige al dashboard
    });
  },
  error: (err: any) => {
    Swal.fire({
      icon: 'error',
      title: 'Error al registrar',
      text: err.error || 'Hubo un problema',
    });
  },
});
  }
}