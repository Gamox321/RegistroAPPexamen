import { NivelEducacional } from './nivel-educacional';
import { Persona } from "./persona";
import { Asistencia } from '../interfaces/asistencia';
import { DataBaseService } from '../services/data-base.service';
import { Optional } from '@angular/core';
import { showAlert, showToast } from '../tools/message-routines';
import { Router } from '@angular/router';

export class Usuario extends Persona {
  public id: number;
  public cuenta: string;
  public correo: string;
  public password: string;
  public preguntaSecreta: string;
  public respuestaSecreta: string;
  public asistencia: Asistencia;
  public listaUsuarios: Usuario[];
  public imagen: string;

  constructor(@Optional() private db?: DataBaseService) {
    super();
    this.id = 0;
    this.cuenta = '';
    this.correo = '';
    this.password = '';
    this.preguntaSecreta = '';
    this.respuestaSecreta = '';
    this.nombre = '';
    this.apellido = '';
    this.nivelEducacional = NivelEducacional.findNivelEducacionalById(1)!;
    this.fechaNacimiento = undefined;
    this.asistencia = this.asistenciaVacia();
    this.listaUsuarios = [];
    this.imagen = '';
  }

  static jsonClaseEjemplo =
    `{
      "bloqueInicio": "1",
      "bloqueTermino": "6",
      "dia": "Lunes",
      "horaFin": "12:00",
      "horaInicio": "08:00",
      "idAsignatura": "PGY1234",
      "nombreAsignatura": "Programación",
      "nombreProfesor": "Cgomez",
      "seccion": "-10D",
      "sede": "Padre Alonso de Ovalle"
    }`;

  static jsonClaseVacio =
  `{
      "bloqueInicio": "",
      "bloqueTermino": "",
      "dia": "",
      "horaFin": "",
      "horaInicio": "",
      "idAsignatura": "",
      "nombreAsignatura": "",
      "nombreProfesor": "",
      "seccion": "",
      "sede": ""
    }`;

  public asistenciaVacia(): Asistencia {
    return {
      bloqueInicio: 0,
      bloqueTermino: 0,
      dia: '',
      horaFin: '',
      horaInicio: '',
      idAsignatura: '',
      nombreAsignatura: '',
      nombreProfesor: '',
      seccion: '',
      sede: ''
    };
  }

  static getNewUsuario(
    cuenta: string,
    correo: string,
    password: string,
    preguntaSecreta: string,
    respuestaSecreta: string,
    nombre: string,
    apellido: string,
    nivelEducacional: NivelEducacional,
    fechaNacimiento: Date | undefined,
    direccion: string,
    imagen: string
  ) {
    if (!cuenta || !correo || !password || !nombre || !apellido || !direccion) {
      throw new Error('Todos los campos son obligatorios');
    }
  
    let usuario = new Usuario();
    usuario.cuenta = cuenta;
    usuario.correo = correo;
    usuario.password = password;
    usuario.preguntaSecreta = preguntaSecreta;
    usuario.respuestaSecreta = respuestaSecreta;
    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.nivelEducacional = nivelEducacional;
    usuario.fechaNacimiento = fechaNacimiento;
    usuario.direccion = direccion;
    usuario.imagen = imagen;
    return usuario;
  }

  // Método para buscar un usuario por cuenta
  async buscarUsuarioPorCuenta(cuenta: string): Promise<Usuario | undefined> {
    return await this.db!.buscarUsuarioPorCuenta(cuenta);
  }

  // Método para buscar un usuario por correo
  public async buscarUsuarioPorCorreo(correo: string): Promise<Usuario | undefined> {
    return await this.db!.buscarUsuarioPorCorreo(correo);
  }

  // Método para guardar un usuario
  async guardarUsuario(usuario: Usuario): Promise<void> {
    await this.db!.guardarUsuario(usuario);
  }

  // Método para eliminar un usuario, con la restricción para la cuenta 'admin'
  async eliminarUsuario(cuenta: string): Promise<void>  {
    // Verificamos si la cuenta es 'admin'
    if (cuenta === 'admin') {
      alert('No puedes eliminar la cuenta admin.');
      return;
    }

    // Si no es la cuenta admin, procedemos a eliminar el usuario
    await this.db!.eliminarUsuarioUsandoCuenta(cuenta);
  }

  // Método para actualizar los datos del usuario
  async actualizarDatosPersonales() {
    try {
      if (!this.db) {
        throw new Error('El servicio DataBaseService no está disponible.');
      }
      await this.db.guardarUsuario(this);
      console.log('Datos personales actualizados correctamente');
    } catch (error) {
      console.error('Error al actualizar los datos personales: ', error);
    }
  }

  // Método para login
  async login(userName: string, password: string): Promise<boolean> {
    const usuario = await this.db!.buscarUsuarioValido(userName, password);  // Cambiar 'this.bd' por 'this.db'
    
    if (usuario) {
      if (usuario.cuenta === 'admin') {
        showToast('¡Bienvenido Administrador!');
        // Otorga permisos especiales si es admin
      }
      await this.guardarUsuarioAutenticado(usuario);  // Suponiendo que este método existe en la clase
      return true;
    } else {
      showToast('El correo o la contraseña son incorrectos');
      return false;
    }
  }

  // Método para guardar el usuario autenticado
  async guardarUsuarioAutenticado(usuario: Usuario) {
    try {
      await this.db!.guardarUsuario(usuario);
    } catch (error) {
      console.error('Error al guardar usuario autenticado:', error);
    }
  }

  // Método toString
  public override toString(): string {
    return `
      ${this.cuenta}
      ${this.correo}
      ${this.password}
      ${this.preguntaSecreta}
      ${this.respuestaSecreta}
      ${this.nombre}
      ${this.apellido}
      ${this.nivelEducacional.getTextoNivelEducacional()}
      ${this.getFechaNacimiento()}
      ${this.imagen}`;
  }

  // Método para validar un código QR
  static validarCodigoQr(qr: string) {
    if (qr === '') return false;

    try {
      const json = JSON.parse(qr);

      if (json.bloqueInicio !== undefined &&
        json.bloqueTermino !== undefined &&
        json.dia !== undefined &&
        json.horaFin !== undefined &&
        json.horaInicio !== undefined &&
        json.idAsignatura !== undefined &&
        json.nombreAsignatura !== undefined &&
        json.nombreProfesor !== undefined &&
        json.seccion !== undefined &&
        json.sede !== undefined) {
        return true;
      }
    } catch (error) { }

    showAlert('El código QR escaneado no es válido');
    return false;
  }
}
