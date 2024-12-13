import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { showAlertError, showToast } from 'src/app/tools/message-routines';
import { Usuario } from '../model/usuario';
import { Storage } from '@ionic/storage-angular';
import { DataBaseService } from './data-base.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  keyUsuario = 'USUARIO_AUTENTICADO';
  usuarioAutenticado = new BehaviorSubject<Usuario | null>(null);
  storageQrCodeKey = 'QR_CODE';
  qrCodeData = new BehaviorSubject<string | null>(null);

  // La variable primerInicioSesion vale true cuando el usuario digita correctamente sus
  // credenciales y logra entrar al sistema por primera vez. Pero vale falso, si el 
  // usuario ya ha iniciado sesión, luego cierra la aplicación sin cerrar la sesión
  // y vuelve a entrar nuevamente. Si el usuario ingresa por primera vez, se limpian todas
  // las componentes, pero se dejan tal como están y no se limpian, si el suario
  // cierra al aplicación y la vuelve a abrir sin haber previamente cerrado la sesión.
  primerInicioSesion =  new BehaviorSubject<boolean>(false);

  componenteSeleccionada = new BehaviorSubject<string>('codigoqr');

  constructor(private router: Router, private bd: DataBaseService, private storage: Storage) { }

  async inicializarAutenticacion() {
    try {
      await this.storage.create();
    } catch (error) {
      showAlertError('AuthService.initializeAuthService', error);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      return Boolean(await this.leerUsuarioAutenticado());
    } catch (error) {
      showAlertError('AuthService.isAuthenticated', error);
      return false;
    }
  }

  async leerUsuarioAutenticado(): Promise<Usuario | null> {
    try {
      const user = (await this.storage.get(this.keyUsuario)) as Usuario | null;
      this.usuarioAutenticado.next(user ?? null);
      return user;
    } catch (error) {
      showAlertError('AuthService.readAuthUser', error);
      return null;
    }
  }

  async guardarUsuarioAutenticado(usuario: Usuario) {
    try {
      await this.storage.set(this.keyUsuario, usuario);
      this.usuarioAutenticado.next(usuario);
      return usuario;
    } catch (error) {
      showAlertError('AuthService.saveAuthUser', error);
      return null;
    }
  }

  async eliminarUsuarioAutenticado(): Promise<boolean> {
    try {
      await this.storage.remove(this.keyUsuario);
      this.usuarioAutenticado.next(null);
      return true;
    } catch (error) {
      showAlertError('AuthService.deleteAuthUser', error);
      return false;
    }
  }

  async login(userName: string, password: string): Promise<boolean> {
    try {
      const authUser = await this.storage.get(this.keyUsuario);

      if (authUser) {
        this.usuarioAutenticado.next(authUser);
        this.primerInicioSesion.next(false);
        await this.router.navigate(['/inicio']);
        return true;
      } else {
        const usuario = await this.bd.buscarUsuarioValido(userName, password);

        if (usuario) {
          showToast(`¡Bienvenid@ ${usuario.nombre} ${usuario.apellido}!`);
          await this.guardarUsuarioAutenticado(usuario);
          this.primerInicioSesion.next(true);
          await this.router.navigate(['/inicio']);
          return true;
        } else {
          showToast('El correo o la contraseña son incorrectos');
          await this.router.navigate(['/ingreso']);
          return false;
        }
      }
    } catch (error) {
      showAlertError('AuthService.login', error);
      return false;
    }
  }

  async logout(): Promise<boolean> {
    try {
      const usuario = await this.leerUsuarioAutenticado();

      if (usuario) {
        showToast(`¡Hasta pronto ${usuario.nombre} ${usuario.apellido}!`);
        await this.eliminarUsuarioAutenticado();
      }

      await this.router.navigate(['/ingreso']);
      return true;
    } catch (error) {
      showAlertError('AuthService.logout', error);
      return false;
    }
  }

  // async readQrFromStorage(): Promise<string | null> {
  //   try {
  //     const qrData = await this.storage.get(this.storageQrCodeKey) as string | null;
  //     this.qrCodeData.next(qrData);
  //     return qrData;
  //   } catch (error) {
  //     showAlertError('AuthService.readQrFromStorage', error);
  //     return null;
  //   }
  // }

  // async saveQrToStorage(qrData: string): Promise<string | null> {
  //   try {
  //     await this.storage.set(this.storageQrCodeKey, qrData);
  //     this.qrCodeData.next(qrData);
  //     return qrData;
  //   } catch (error) {
  //     showAlertError('AuthService.saveQrToStorage', error);
  //     return null;
  //   }
  // }

  // async deleteQrFromStorage(): Promise<boolean> {
  //   try {
  //     await this.storage.remove(this.storageQrCodeKey);
  //     this.qrCodeData.next(null);
  //     return true;
  //   } catch (error) {
  //     showAlertError('AuthService.deleteQrFromStorage', error);
  //     return false;
  //   }
  // }
}