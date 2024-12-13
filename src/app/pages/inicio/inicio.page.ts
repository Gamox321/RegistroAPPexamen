import { AuthService } from 'src/app/services/auth.service';
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFooter } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { BienvenidaComponent } from 'src/app/components/bienvenida/bienvenida.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { CodigoqrComponent } from 'src/app/components/codigoqr/codigoqr.component';
import { MiclaseComponent } from 'src/app/components/miclase/miclase.component';
import { ForoComponent } from 'src/app/components/foro/foro.component';
import { MisdatosComponent } from 'src/app/components/misdatos/misdatos.component';
import { Usuario } from 'src/app/model/usuario';
import { Capacitor } from '@capacitor/core';
import { ScannerService } from 'src/app/services/scanner.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  animations: [
    trigger('fadeInAnimation', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ],
  standalone: true,
  imports: [BienvenidaComponent, FooterComponent, HeaderComponent, IonContent
      , IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule
      , CodigoqrComponent, MiclaseComponent
      , ForoComponent, MisdatosComponent
      , IonFooter, TranslateModule ]
})
export class InicioPage {

  @ViewChild(FooterComponent) footer!: FooterComponent;
  componenteSeleccionada = 'bienvenida';

  usuario: Usuario = new Usuario();

  constructor(
    private authService: AuthService
  , private scanner: ScannerService) 
  { 
    /*this.authService.componenteSeleccionada.subscribe((componenteSeleccionada) => {
      this.componenteSeleccionada = componenteSeleccionada;
    })*/
  }

  ionViewWillEnter() {
    this.cambiarComponente('bienvenida');
  }

  async headerClick(button: string) {
    if (button === 'testqr')
      this.mostrarComponente(Usuario.jsonClaseEjemplo);

    if (button === 'scan' && Capacitor.getPlatform() === 'web')
      this.componenteSeleccionada = 'codigoqr';

    if (button === 'scan' && Capacitor.getPlatform() !== 'web')
        this.mostrarComponente(await this.scanner.scan());
  }

  webQrScanned(qr: string) {
    this.mostrarComponente(qr);
  }

  webQrStopped() {
    this.cambiarComponente('bienvenida');
  }

  mostrarComponente(qr: string) {
    if (Usuario.validarCodigoQr(qr)) {
      this.authService.qrCodeData.next(qr);
      this.cambiarComponente('miclase');
      return;
    }
    
    this.cambiarComponente('bienvenida');
  }

  footerClick(button: string) {
    this.componenteSeleccionada = button;
  }

  cambiarComponente(name: string) {
    this.componenteSeleccionada = name;
    this.footer.botonSeleccionado = name;
  }

}
