import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, 
  EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AnimationController, IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { arrowBackOutline, logOut, logOutOutline, qrCodeOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common'; // Si necesitas saber la ruta actual

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
      CommonModule    // CGV-Permite usar directivas comunes de Angular
    , FormsModule     // CGV-Permite usar formularios
    , IonicModule     // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule // CGV-Permite usar pipe 'translate'
  ]
})
export class HeaderComponent implements AfterViewInit, OnInit {

  MostrarBotonEscaneo: boolean = false;

  @ViewChild('titulo', { read: ElementRef, static: false }) itemTitulo!: ElementRef;
  
  @Output() headerClick = new EventEmitter<string>();

  constructor(
    private location: Location,
    private navCtrl: NavController, 
    private authService: AuthService,
    private animationController: AnimationController) { 
    addIcons({ logOutOutline, qrCodeOutline });
  }

  ngOnInit() {
    if (this.location.path() === '/inicio') {
      this.MostrarBotonEscaneo = true;
    } else {
      this.MostrarBotonEscaneo = false;
    }
  }

  sendClickEvent(buttonName: string) {
    this.headerClick.emit(buttonName);
  }

  logout() {
    this.authService.logout();
  }

  ngAfterViewInit(): void {
    this.animarTituloIzqDer();
  }

  animarTituloIzqDer() {
    this.animationController
      .create()
      .addElement(this.itemTitulo.nativeElement)
      .iterations(Infinity)
      .duration(5500)
      .keyframes([
        { offset: 0, transform: 'translateX(-100%)', opacity: 0 }, // Comienza fuera de la izquierda
        { offset: 0.1, transform: 'translateX(-80%)', opacity: 1 }, // Aparece gradualmente
        { offset: 0.9, transform: 'translateX(80%)', opacity: 1 }, // Desaparece gradualmente
        { offset: 1, transform: 'translateX(100%)', opacity: 0 } // Termina fuera de la derecha
      ])
      .play();
  }
  

}