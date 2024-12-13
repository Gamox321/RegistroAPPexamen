import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { Asistencia } from 'src/app/interfaces/asistencia';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Usuario } from 'src/app/model/usuario';
import { IonContent, IonCol, IonGrid, IonRow } from "@ionic/angular/standalone";
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { LanguageComponent } from '../language/language.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-miclase',
  templateUrl: './miclase.component.html',
  styleUrls: ['./miclase.component.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonCol, IonRow
    , IonGrid, LanguageComponent, TranslateModule]
})
export class MiclaseComponent implements AfterViewInit, OnDestroy {

  @ViewChild('page', { read: ElementRef, static: false }) page!: ElementRef;

  /*
  public usuario: Usuario = new Usuario();
  public listaNivelesEducacionales = NivelEducacional.getNivelesEducacionales();

  public asistencia: Asistencia | undefined = undefined;
  public datosQR: string = '';
  */

  asistencia: any;

  private subscription: Subscription;

  constructor(private authService: AuthService
    ,private animationController: AnimationController
    ,private activatedRoute: ActivatedRoute
    ,private router: Router
  ) { 
    /*
    this.authService.usuarioAutenticado.subscribe((usuarioAutenticado) => {
      if (usuarioAutenticado) {
        this.usuario = usuarioAutenticado;
      } else {
        this.usuario = new Usuario();
      }
    })
    */

    this.subscription = this.authService.qrCodeData.subscribe((qr) => {
      this.asistencia = qr? JSON.parse(qr): null;
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  navegar(pagina: string) {
    this.router.navigate([pagina]);
  }

  ngAfterViewInit() {
    this.animarVueltaDePagina();
  }
  
  animarVueltaDePagina() {
    this.animationController
      .create()
      .addElement(this.page.nativeElement)
      .iterations(1)
      .duration(1000)
      .fromTo('transform', 'rotateY(deg)', 'rotateY(-180deg)')
      .duration(1000)
      .fromTo('transform', 'rotateY(-180deg)', 'rotateY(0deg)')
      .play();
  }
}
