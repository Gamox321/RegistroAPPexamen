import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, 
    IonButton, IonLabel, IonCardSubtitle, IonCard, IonCardContent, 
    IonInput,
    NavController} from '@ionic/angular/standalone';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { DataBaseService } from 'src/app/services/data-base.service';
import { addIcons } from 'ionicons';
import { key, returnDownBackOutline } from 'ionicons/icons';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.page.html',
  styleUrls: ['./pregunta.page.scss'],
  standalone: true,
  imports: [IonInput, IonIcon, IonButton, IonLabel, IonContent, IonCardSubtitle
    , IonHeader, IonCard, IonCardContent, IonTitle, IonToolbar
    , CommonModule, FormsModule, LanguageComponent, TranslateModule]
})
export class PreguntaPage implements OnInit {

  public usuario: Usuario;
  public respuesta: string | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private db: DataBaseService // Inyectamos el servicio de base de datos
  ) {
    // Usamos getNewUsuario para inicializar el usuario con valores por defecto
    /*
    this.usuario = Usuario.getNewUsuario(
      '', '', '', '', '', '', '',
      NivelEducacional.findNivelEducacionalById(1)!, undefined,''
    );
    */
    this.usuario = new Usuario(this.db);  // Crear instancia de Usuario con el servicio

    // Obtenemos el usuario desde la navegación o redirigimos
    this.activatedRoute.queryParams.subscribe(params => {
      const nav = this.router.getCurrentNavigation();
      if (nav && nav.extras.state) {
        this.usuario = nav.extras.state['usuario'];
        return;
      }
      this.router.navigate(['/ingreso']);
    });
    addIcons ({ key, returnDownBackOutline });
  }

  ngOnInit() {}

  public validarRespuestaSecreta(): void {
    this.db.buscarUsuarioPorCuenta(this.usuario.cuenta).then(usuarioEncontrado => {
      if (usuarioEncontrado && usuarioEncontrado.respuestaSecreta === this.respuesta) {
        this.router.navigate(['/correcto'], { state: { password: usuarioEncontrado.password } });
      } else {
        this.router.navigate(['/incorrecto']);
      }
    }).catch(error => {
      console.error("Error al buscar usuario:", error);
      this.router.navigate(['/incorrecto']);
    });
  }
  

  public regresar() {
    this.navCtrl.back();
  }

  /*
  public validarRespuestaSecreta(): void {
    // Verificar si la respuesta es correcta
    if (this.usuario.respuestaSecreta === this.respuesta) {
      this.router.navigate(['/correcto']);
    } else {
      this.router.navigate(['/incorrecto']);
    }
  }
  */

  /*
  public validarRespuestaSecreta(): void {
    // Validamos la respuesta secreta en la base de datos
    this.db.buscarUsuarioPorCuenta(this.usuario.cuenta).then(usuarioEncontrado => {
      if (usuarioEncontrado && usuarioEncontrado.respuestaSecreta === this.respuesta) {
        this.router.navigate(['/correcto']);
      } else {
        this.router.navigate(['/incorrecto']);
      }
    }).catch(error => {
      console.error("Error al buscar usuario:", error);
      this.router.navigate(['/incorrecto']);
    });
  }
  */
}






/*    pregunta.ts control 1

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';
import { NivelEducacional } from 'src/app/model/nivel-educacional';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.page.html',
  styleUrls: ['./pregunta.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class PreguntaPage implements OnInit {

  public usuario: Usuario;
  public respuesta: string | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.usuario = new Usuario('','','','','','','',
      NivelEducacional.findNivelEducacionalById(1)!, undefined);
    this.activatedRoute.queryParams.subscribe(params => {
      const nav = this.router.getCurrentNavigation();
      if (nav) {
        if (nav.extras.state) {
          this.usuario = nav.extras.state['usuario'];
          return;
        }
      }
      this.router.navigate(['/ingreso']);
    });
  }

  ngOnInit() {
  }

  public validarRespuestaSecreta(): void {
    if (this.usuario.respuestaSecreta === this.respuesta) {
      this.router.navigate(['/correcto']);
    } else {
      this.router.navigate(['/incorrecto']);
    }
  }
}
*/