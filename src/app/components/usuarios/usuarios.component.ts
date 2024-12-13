
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataBaseService } from '../../services/data-base.service';
import { Usuario } from '../../model/usuario';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  isAdmin: boolean = false; // Variable para verificar si es admin

  constructor(
    private authService: AuthService,
    private dbService: DataBaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    // Verificar si el usuario autenticado es admin
    const usuario = await this.authService.leerUsuarioAutenticado();
    
    if (usuario?.cuenta === 'admin') {
      this.isAdmin = true; // Es admin, muestra las opciones de administración
    } else {
      // Si no es admin, redirigir a otra página
      this.router.navigate(['/inicio']);
    }

    // Cargar los usuarios si es admin
    if (this.isAdmin) {
      this.cargarUsuarios();
    }
  }

  async cargarUsuarios() {
    this.usuarios = await this.dbService.listaUsuarios.getValue();
  }

  async eliminarUsuario(cuenta: string) {
    if (cuenta === 'admin') {
      alert('No puedes eliminar la cuenta admin.');
      return;
    }

    await this.dbService.eliminarUsuarioUsandoCuenta(cuenta);
    await this.cargarUsuarios();
  }
}
