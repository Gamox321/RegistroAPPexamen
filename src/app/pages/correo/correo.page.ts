import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard
  , IonCardContent, IonCardSubtitle, IonButton, IonIcon
  , IonLabel, IonInput, 
  IonButtons,
  NavController} from '@ionic/angular/standalone';
import { NavigationExtras, Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { DataBaseService } from 'src/app/services/data-base.service';
import { TranslateModule } from '@ngx-translate/core'; //nuevo
import { LanguageComponent } from 'src/app/components/language/language.component'; //nuevo
import { addIcons } from 'ionicons'; //nuevo
import { checkmark, returnDownBackOutline, returnDownForwardOutline } from 'ionicons/icons'; //nuevo

@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonCardSubtitle, IonCardContent
    , IonCard, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons
    , CommonModule, FormsModule, IonInput, IonLabel //nuevo
    , TranslateModule, LanguageComponent] //nuevo
})
export class CorreoPage implements OnInit {


  public correo: string = '';
  public cuenta: string = '';
  

  constructor(
    private router: Router
  , private navCtrl: NavController
  , private db: DataBaseService) { 

    addIcons({ checkmark, returnDownBackOutline });
  }

  ngOnInit() {
  }

  public ingresarValidarRespuestaSecreta(): void {
    const esCorreo = this.correo.includes('@');
    const usuario = new Usuario(this.db); // Crear instancia de Usuario

    // Realizar la búsqueda según si es correo o cuenta
    const busquedaUsuario = esCorreo
        ? usuario.buscarUsuarioPorCorreo(this.correo)
        : usuario.buscarUsuarioPorCuenta(this.cuenta);

    busquedaUsuario.then(usuarioEncontrado => {
        if (!usuarioEncontrado) {
            this.router.navigate(['/incorrecto']);
        } else {
            // Si se encuentra el usuario, pasar a la página de preguntas
            const navigationExtras: NavigationExtras = {
                state: {
                    usuario: usuarioEncontrado
                }
            };
            this.router.navigate(['/pregunta'], navigationExtras);
        }
    }).catch(error => {
        console.error("Error al buscar usuario:", error);
        this.router.navigate(['/incorrecto']);
    });
  }

  public regresar() {
    this.router.navigate(['/ingreso']);
  }

  /*
  public ingresarValidarRespuestaSecreta(): void {
    const usuario = new Usuario(this.db); 

    // Determinamos si el usuario ingresó un correo o una cuenta
    const esCorreo = this.correo.includes('@');

    const busquedaUsuario = esCorreo 
        ? usuario.buscarUsuarioPorCorreo(this.correo) 
        : usuario.buscarUsuarioPorCuenta(this.cuenta);

    busquedaUsuario.then(usuarioEncontrado => {
        if (!usuarioEncontrado) {
            this.router.navigate(['/incorrecto']);
        } else {
            const navigationExtras: NavigationExtras = {
                state: {
                    usuario: usuarioEncontrado
                }
            };
            this.router.navigate(['/pregunta'], navigationExtras);
        }
    }).catch(error => {
        console.error("Error al buscar usuario:", error);
        this.router.navigate(['/incorrecto']);
    });
  }
  */


  /*
  public ingresarValidarRespuestaSecreta(): void {
    const usuario = new Usuario('','','','','','','',
    NivelEducacional.findNivelEducacionalById(1)!, undefined);
    const usuarioEncontrado = usuario.buscarUsuarioPorCorreo(this.correo);

    if(!usuarioEncontrado) {
      this.router.navigate(['/incorrecto'])
    }else{
      const navigationExtras: NavigationExtras = {
        state: {
          usuario: usuarioEncontrado
        }
      };
      this.router.navigate(['/pregunta'], navigationExtras); 
    }
  }*/
} 