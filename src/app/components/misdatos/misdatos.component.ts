import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';
import {
  IonInput, IonButton, IonContent, IonFooter, IonGrid,
  IonItem, IonLabel, IonRow, IonSelect, IonSelectOption,
  IonCol,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonImg,
  IonAvatar
} from '@ionic/angular/standalone';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Usuario } from 'src/app/model/usuario';
import { BienvenidaComponent } from '../bienvenida/bienvenida.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { CodigoqrComponent } from '../codigoqr/codigoqr.component';
import { MiclaseComponent } from '../miclase/miclase.component';
import { ForoComponent } from '../foro/foro.component';
import { TranslateModule } from '@ngx-translate/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DataBaseService } from 'src/app/services/data-base.service';
import { AuthService } from 'src/app/services/auth.service';
import { showToast } from 'src/app/tools/message-routines';

@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.component.html',
  styleUrls: ['./misdatos.component.scss'],
  standalone: true,
  imports: [BienvenidaComponent, FooterComponent, HeaderComponent
    , IonContent, IonHeader, IonItem, IonContent, IonInput, IonLabel
    , IonSelect, IonSelectOption
    , IonGrid, IonRow, IonRow, IonButton, IonFooter, IonCol, IonTitle
    , IonToolbar
    , IonImg, IonAvatar, CommonModule, FormsModule
    , CodigoqrComponent, MiclaseComponent
    , ForoComponent, MisdatosComponent
    , TranslateModule, MatDatepickerModule, MatInputModule
    , MatNativeDateModule]
})
export class MisdatosComponent implements OnInit {
  usuario: Usuario = new Usuario();
  listaNivelesEducacionales: NivelEducacional[] = NivelEducacional.getNivelesEducacionales();

  constructor(
    private animationController: AnimationController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private db: DataBaseService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.usuarioAutenticado.subscribe(usuario => {
      if (usuario) {
        this.usuario = usuario;
        // Verificar que nivelEducacional no sea null o undefined
        if (!this.usuario.nivelEducacional) {
          this.usuario.nivelEducacional = NivelEducacional.findNivelEducacionalById(1)!;
        }
        if (!this.usuario.fechaNacimiento) {
          this.usuario.fechaNacimiento = new Date(); // Asignar fecha actual o valor válido
        }
      }
    });
  }

  public limpiar(): void {
    this.usuario.cuenta = '';
    this.usuario.nombre = '';
    this.usuario.apellido = '';
    this.usuario.correo = '';
    this.usuario.preguntaSecreta = '';
    this.usuario.respuestaSecreta = '';
    this.usuario.password = '';
    this.usuario.nivelEducacional = NivelEducacional.findNivelEducacionalById(1)!;
    this.usuario.fechaNacimiento = undefined;
    this.usuario.direccion = '';
    this.usuario.imagen = '';
  }

  // Método para mostrar el menú de selección
  public async mostrarOpcionesDeImagen() {
    const alert = await this.alertController.create({
      header: 'Seleccionar Imagen',
      buttons: [
        {
          text: 'Usar cámara',
          handler: () => {
            this.seleccionarImagenDesdeCamara();
          }
        },
        {
          text: 'Seleccionar desde galería',
          handler: () => {
            this.seleccionarImagenDesdeGaleria();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  // Método para seleccionar imagen desde la cámara
  private async seleccionarImagenDesdeCamara() {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        source: CameraSource.Camera,  // Usamos la cámara
        resultType: CameraResultType.Uri
      });

      this.usuario.imagen = image.webPath!;
      console.log('Imagen tomada con la cámara:', image.webPath);
    } catch (error) {
      console.error('Error al tomar foto con la cámara:', error);
    }
  }

  // Método para seleccionar imagen desde la galería
  private async seleccionarImagenDesdeGaleria() {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        source: CameraSource.Photos,  // Usamos solo la galería
        resultType: CameraResultType.Uri
      });

      this.usuario.imagen = image.webPath!;
      console.log('Imagen seleccionada de la galería:', image.webPath);
    } catch (error) {
      console.error('Error al seleccionar imagen desde la galería:', error);
    }
  }

  async actualizarDatosPersonales() {
    if (this.usuario.nombre.trim() === '') {
      showToast('El usuario debe tener un nombre');
    } else {
      console.log(this.usuario);
      this.db.guardarUsuario(this.usuario);
      this.authService.guardarUsuarioAutenticado(this.usuario);
      showToast('El usuario fue Actualizado correctamente');
    }
  }

  navegar(pagina: string) {
    this.router.navigate([pagina]);
  }


}
