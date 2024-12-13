import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-registrarme',
  templateUrl: './registrarme.page.html',
  styleUrls: ['./registrarme.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    CommonModule,
    FormsModule,
  ],
})
export class RegistrarmePage implements OnInit {
  nombre: string = '';
  correo: string = '';
  password: string = '';

  constructor() {}

  ngOnInit() {}

  registrar() {
    if (this.nombre && this.correo && this.password) {
      console.log('Registro exitoso:', { nombre: this.nombre, correo: this.correo });
    } else {
      console.error('Por favor completa todos los campos');
    }
  }

  limpiar() {
    this.nombre = '';
    this.correo = '';
    this.password = '';
    console.log('Formulario limpiado');
  }
}
