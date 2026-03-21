import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  modo: 'login' | 'registro' = 'login';

  loginForm: FormGroup;
  registroForm: FormGroup;

  loading = false;
  errorMensaje = '';
  exitoMensaje = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registroForm = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(2)]],
        username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmarPassword: ['', [Validators.required]]
      },
      { validators: this.passwordsCoinciden }
    )
  }

  private passwordsCoinciden(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmarPassword')?.value;
    return pass === confirm ? null : { noCoinciden: true };
  }

  get f() {
    return this.loginForm?.controls;
  }

  get fr() {
    return this.registroForm.controls;
  }

  cambiarModo(modo: 'login' | 'registro'): void {
    this.modo = modo;
    this.errorMensaje = '';
    this.exitoMensaje = '';
    this.loginForm.reset();
    this.registroForm.reset();
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMensaje = '';

    this.authService.login(this.loginForm?.value).subscribe({
      next: () => {
        this.router.navigate(['/insumos']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMensaje = err.status === 401
          ? 'Credenciales incorrectas'
          : 'Error al conectar con el servidor'
      }
    });
  }

  onRegistro(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMensaje = '';
    this.exitoMensaje = '';

    const { nombre, username, password } = this.registroForm.value;

    this.authService.registro({ nombre, username, password }).subscribe({
      next: ()=> {
        this.loading = false;
        this.exitoMensaje = 'Se ha creado el usuario exitosamente, ya puede iniciar sesión';
        setTimeout(() => {
          this.cambiarModo('login');
          this.loginForm.patchValue({ username });
        }, 1500);
      },
      error: err => {
        this.loading = false;
        if (err.status === 409) {
          this.errorMensaje = 'Nombre de usuario ya existe';
        } else if (err.status === 400) {
          this.errorMensaje = err.error?.mensaje || 'Datos Inválidos';
        } else {
          this.errorMensaje = 'Error al crear el usuario';
        }
      }
    });
  }
}
