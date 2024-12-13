import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,IonCardContent,IonButton, IonHeader, IonTitle, IonToolbar, IonCard, IonLabel } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-correcto',
  templateUrl: './correcto.page.html',
  styleUrls: ['./correcto.page.scss'],
  standalone: true,
  imports: [IonLabel, IonCard, IonCardContent, IonButton, IonContent
    , IonHeader, IonTitle, IonToolbar, CommonModule
    , FormsModule, LanguageComponent, TranslateModule]
})
export class CorrectoPage {

  public password: string | undefined;

  constructor(
    private router: Router
  ) { 
    const nav = this.router.getCurrentNavigation();
    if (nav && nav.extras.state) {
      this.password = nav.extras.state['password'];
    }
  }

  volver() {
    this.router.navigate(['/ingreso']);
  }
}
