import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar ,IonCard,IonButton, IonCardContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-incorrecto',
  templateUrl: './incorrecto.page.html',
  styleUrls: ['./incorrecto.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonContent, IonHeader, IonTitle
    , IonToolbar, IonCard,IonButton,CommonModule, FormsModule
    , LanguageComponent, TranslateModule]
})
export class IncorrectoPage implements OnInit {
  private previousPage: string | undefined;

  constructor(private navCtrl: NavController, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    
    //Verifica si previousNavigation existe y tiene finalUrl
    if (navigation?.previousNavigation?.finalUrl) {
      this.previousPage = navigation.previousNavigation.finalUrl.toString();
      console.log('Página anterior:', this.previousPage);
    } else {
      console.log('No hay navegación previa.');
    }
  }

  ngOnInit() {}

  incorrectoVolver() {
    this.navCtrl.back();
  }

  /*
  incorrectoVolver() {
    console.log('Página anterior:', this.previousPage);
  
    //{Redirige según la página anterior almacenada
    if (this.previousPage) {
      if (this.previousPage.includes('/correo')) {
        console.log('Navegando de vuelta a /correo');
        this.navController.navigateBack('/correo');
      } else if (this.previousPage.includes('/pregunta')) {
        console.log('Navegando de vuelta a /pregunta');
        this.navController.navigateBack('/pregunta');
      } else {
        console.log('Redirección por defecto a /ingreso');
        this.navController.navigateBack('/ingreso');
      }
    } else {
      console.log('No hay historial, redirigiendo a /ingreso');
      this.navController.navigateBack('/ingreso');
    }
  }
  */

}
