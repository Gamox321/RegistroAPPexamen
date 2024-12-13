import { MapPage } from '../mapa/mapa.page';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { checkmark, colorWandOutline, logIn } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonContent,IonFooter, IonItem, IonHeader, IonRow,
  IonGrid,IonCol,IonLabel, IonTitle, IonToolbar, IonCardContent, 
  IonCard, IonCardHeader, IonButton, IonIcon, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.page.html',
  styleUrls: ['./ingreso.page.scss'],
  standalone: true,
  imports: [IonContent,IonFooter, IonItem, IonHeader
      , IonRow, IonGrid, IonCol, IonLabel, IonTitle
      , IonToolbar, IonCardContent, IonCard, IonCardHeader
      , IonButton, IonIcon, CommonModule, FormsModule
      , IonInput, TranslateModule, LanguageComponent ]
})
export class IngresoPage implements ViewWillEnter {

  /** 
   * CGV-INI-Traducciones
   * Para poder utilizar la traducción de textos, se debe:
   *   1. Ejecutar: npm i @ngx-translate/core 
   *   2. Ejecutar: npm i @ngx-translate/http-loader
   *   3. Crear carpeta: src/app/assets/i18n
   *   4. Crear archivo: src/app/assets/i18n/es.json para los textos en español
   *   5. Crear archivo: src/app/assets/i18n/en.json para los textos en inglés
   * 
   * CGV-FIN-Traducciones
  */ 

  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;

  cuenta: string="";
  password: string="";

  
  constructor(
    
    private router: Router
  , private translate: TranslateService
  , private authService: AuthService) 
{ 
  
  this.cuenta = 'atorres';
  this.password = '1234';
  // Los iconos deben ser agregados a uno (ver en https://ionic.io/ionicons)
  addIcons({ colorWandOutline, checkmark, logIn }); 
}
 
  public ingresarValidarCorreo(): void {
    this.router.navigate(['/correo']);
  }

  public miRuta(): void {
    this.router.navigate(['/mapa']);
  }
  
  navegar(pagina: string) {
   this.router.navigate([pagina]);
  }

  //añadido control 2

  public ingresar(): void{
    this.authService.login(this.cuenta,this.password)
  }

  async ionViewWillEnter() {
    this.selectLanguage.setCurrentLanguage();
  }

  navigateTheme() {
    this.router.navigate(['/theme']);
  }

  registrarNuevoUsuario() {
    this.router.navigate(['/registrarme']);
  }

  recuperarContraseña() {
    
  }
}
