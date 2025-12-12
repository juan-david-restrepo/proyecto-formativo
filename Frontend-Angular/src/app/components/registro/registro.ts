import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Nav } from '../../shared/nav/nav';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, CommonModule, Nav, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css'],
})
export class Registro {
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Formulario de registro
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      rol: ['Ciudadano', Validators.required],
    });
  }

  /** Redirección según rol */
  private redirigirSegunRol(rol: string) {
    if (!rol) {
      this.router.navigate(['/home']);
      return;
    }

    rol = rol.toUpperCase();

    switch (rol) {
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'AGENTE':
        this.router.navigate(['/agente']);
        break;
      case 'CIUDADANO':
        this.router.navigate(['/home']);
        break;
      default:
        this.router.navigate(['/home']);
        break;
    }
  }

  /** Enviar formulario */
  onSubmit(): void {
    if (this.registroForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor llena todos los campos correctamente.',
      });
      return;
    }

    // Datos enviados al backend
    const data = {
      nombreCompleto: this.registroForm.value.nombre,
      email: this.registroForm.value.correo,
      password: this.registroForm.value.contrasena,
      tipoDocumento: this.registroForm.value.tipoDocumento,
      numeroDocumento: this.registroForm.value.numeroDocumento,
      rol: this.registroForm.value.rol,
    };

    this.authService.register(data).subscribe({
      next: (resp) => {
        // Guardar token e info del usuario
        // 🔥 Guardar token y activar sesión
        if (resp.token) {
          localStorage.setItem('token', resp.token);
          this.authService.setSession(resp.token);
        }


        if (resp.role) {
          localStorage.setItem('userRole', resp.role);
        }

        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          // 🔥 Redirección correcta según el rol
          this.redirigirSegunRol(resp.role);
        });
      },

      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: err.error || 'Hubo un problema durante el registro.',
        });
      },
    });
  }
}
