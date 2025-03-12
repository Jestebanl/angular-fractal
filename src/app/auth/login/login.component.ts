import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toast } from 'ngx-sonner';
import { hasEmailError, isRequired } from '../utils/validators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgIf } from '@angular/common';
export interface FormSignIn {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './login.component.html',
  styles: ``
})
export default class LoginComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  isLoading: boolean = false;
  isRequired(field: 'email' | 'password') {
    return isRequired(field, this.form);
  }

  hasEmailError() {
    return hasEmailError(this.form);
  }

  form = this._formBuilder.group<FormSignIn>({
    email: this._formBuilder.control('', [
      Validators.required,
      Validators.email,
    ]),
    password: this._formBuilder.control('', Validators.required),
  });

  async submit() {
    if (this.form.invalid) {
      toast.error('Por favor, completa todos los campos correctamente.');
      return;
    }
  
    const { email, password } = this.form.value;
  
    if (!email || !password) {
      toast.error('Email y contraseña son requeridos.');
      return;
    }
  
    try {
      this.isLoading = true;
  
      const userCredential = await this._authService.signIn({ email, password });
  
      toast.success('Inicio de sesión exitoso. Bienvenido de nuevo.');
    
        this._router.navigateByUrl('/');

    } catch (error) {
      toast.error('Ocurrio un error');
    } finally {
      this.isLoading = false;
    }
  }
  
}
