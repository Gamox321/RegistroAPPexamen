import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { APIClientService } from 'src/app/services/apiclient.service';
import { AuthService } from 'src/app/services/auth.service';
import { IonFabButton, IonFab, IonList, IonCardContent, IonHeader
  , IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle
  , IonCardSubtitle, IonItem, IonLabel, IonInput, IonTextarea
  , IonGrid, IonRow, IonCol, IonButton, IonIcon, IonContent
  , IonFabList, IonSelectOption, 
  IonSelect} from '@ionic/angular/standalone';
import { pencilOutline, trashOutline, add } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Publicacion } from 'src/app/model/publicacion';
import { showToast } from 'src/app/tools/message-routines';
import { addIcons } from 'ionicons';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/model/usuario';
import { LanguageComponent } from '../language/language.component';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.scss'],
  standalone: true,
  imports: [IonList, IonHeader, IonToolbar, IonTitle, IonCard
    , IonCardHeader, IonCardTitle, IonCardSubtitle, IonItem
    , IonLabel, IonInput, IonTextarea, IonGrid, IonRow, IonCol
    , IonButton, IonIcon, IonContent, IonCardContent
    , IonFab, IonFabButton, IonFabList, IonSelect, IonSelectOption
    , CommonModule, FormsModule, LanguageComponent, TranslateModule]
})
export class ForoComponent implements OnInit, OnDestroy {

  publicacion: Publicacion = new Publicacion();
  publicaciones: Publicacion[] = [];
  selectedPostText: string = '';
  intervalId: any = null;
  usuario = new Usuario();

  selectedUserId: number | null = null;  // Nueva propiedad
  usuarios: Usuario[] = [];  // Nueva propiedad para almacenar la lista de usuarios
  
  private publicacionesSubscription!: Subscription;
  private usuarioSubscription!: Subscription;

  constructor(private api: APIClientService, private auth: AuthService) {
    addIcons({ pencilOutline, trashOutline, add });
  }

  ngOnInit() {
    this.publicacionesSubscription = this.api.publicacionLista.subscribe((publicaciones) => {
      this.publicaciones = publicaciones;
    });
    this.usuarioSubscription = this.auth.usuarioAutenticado.subscribe((usuario) => {
      this.usuario = usuario ? usuario : new Usuario();
    });
    this.api.refrescarPublicacionLista(); // Actualiza lista de Publicacions al iniciar
    this.cargarUsuarios(); // Cargar la lista de usuarios al iniciar
  }

  ngOnDestroy() {
    if (this.publicacionesSubscription) this.publicacionesSubscription.unsubscribe();
  }

  limpiarPublicacion() {
    this.publicacion = new Publicacion();
    this.selectedPostText = 'Nueva publicación';
  }

  guardarPublicacion() {
    if (!this.publicacion.title.trim()) {
      showToast('Por favor, completa el título.');
      return;
    }
    if (!this.publicacion.body.trim()) {
      showToast('Por favor, completa el cuerpo.');
      return;
    }

    if (this.publicacion.id) {
      this.actualizarPublicacion();
    } else {
      this.crearPublicacion();
    }
  }

  private async crearPublicacion() {
    this.publicacion.author = this.usuario.nombre + ' ' + this.usuario.apellido;
    const publicacionCreada  = await this.api.crearPublicacion(this.publicacion);
    if (publicacionCreada) {
      showToast(`Publicación creada correctamente: ${publicacionCreada.title}`);
      this.limpiarPublicacion();
    }
  }

  private async actualizarPublicacion() {
    this.publicacion.author = this.usuario.nombre + ' ' + this.usuario.apellido;
    const actualizadoPublicacion = await this.api.actualizarPublicacion(this.publicacion);
    if (actualizadoPublicacion) {
      showToast(`Publicación actualizada correctamente: ${actualizadoPublicacion.title}`);
      this.limpiarPublicacion();
    }
  }

  editarPublicacion(publicacion: Publicacion) {
    this.publicacion = { ...publicacion }; // Crea una copia para editar sin afectar la lista
    this.selectedPostText = `Editando publicación #${publicacion.id}`;
    document.getElementById('topOfPage')!.scrollIntoView({ behavior: 'smooth' });
  }

  async borrarPublicacion(publicacion: Publicacion) {
    const success = await this.api.borrarPublicacion(publicacion.id);
    if (success) {
      showToast(`Publicación eliminada correctamente: ${publicacion.id}`);
      this.limpiarPublicacion();
    }
  }

  getPublicacionId(index: number, publicacion: Publicacion) {
    return publicacion.id;
  }

  cambiarUsuario(selectedId: number) {
    this.selectedUserId = selectedId;
    // Aquí puedes añadir lógica adicional si necesitas realizar alguna acción al cambiar el usuario
  }

  private cargarUsuarios() {
    this.api.getUsuarios().subscribe((usuarios: Usuario[]) => {
      this.usuarios = usuarios; // Asigna el resultado a la propiedad
    }, error => {
      console.error('Error al cargar usuarios', error);
      // Manejo de errores
    });
  }
} 