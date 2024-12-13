import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom, Observable, retry } from 'rxjs';
import { Publicacion } from '../model/publicacion';
import { showAlertError, showToast } from '../tools/message-routines';
import { Usuario } from '../model/usuario';


@Injectable({
  providedIn: 'root'
})
export class APIClientService {

  httpOptions = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'access-control-allow-origin': '*'
    })
  };

  //apiUrl = 'http://localhost:3000'; // Url al usar navegador web
  apiUrl = 'http://172.20.10.5'; //Url al usar en mi celular en mi wifi, tú puedes tener otra ip
  publicacionLista: BehaviorSubject<Publicacion[]> = new BehaviorSubject<Publicacion[]>([]);

  constructor(private http: HttpClient) { }



  getUsuario(cuenta: string): Observable<any> {
    return this.http.get(this.apiUrl + '/usuario/' + cuenta).pipe(retry(3));
  }

  getUsuarios(): Observable<any> {
    return this.http.get(this.apiUrl + '/usuario/').pipe(retry(3));
  }

  getPublicacione(id: number): Observable<any> {
    return this.http.get(this.apiUrl + '/publicacion/' + id).pipe(retry(3));
  }

  getPublicaciones(): Observable<any> {
    return this.http.get(this.apiUrl + '/publicacion/').pipe(retry(3));
  }

  // Crear una publicación y actualizar publicacionLista; devuelve el registro recién creado
  async crearPublicacion(publicacion: Publicacion): Promise<Publicacion | null> {
    try {
      const postWithoutId = {
        "title": publicacion.title,
        "body": publicacion.body,
        "author": publicacion.author,
        "date": publicacion.date,
        "authorImage": publicacion.authorImage
      };

      const createdPost = await lastValueFrom(
        this.http.post<Publicacion>(this.apiUrl + '/publicaciones', 
          postWithoutId, this.httpOptions).pipe(retry(3))
      );
      await this.refrescarPublicacionLista();
      return createdPost;
    } catch (error) {
      showAlertError('APIClientService.crearPublicacion', error);
      return null;
    }
  }

  // Actualizar una publicación; devuelve la publicación actualizada
  async actualizarPublicacion(publicacion: Publicacion): Promise<Publicacion | null> {
    try {
      const actualizarPublicacion = await lastValueFrom(
        this.http.put<Publicacion>(this.apiUrl + '/publicaciones/' + publicacion.id, 
          publicacion, this.httpOptions).pipe(retry(3))
      );
      await this.refrescarPublicacionLista();
      return actualizarPublicacion;
    } catch (error) {
      showAlertError('APIClientService.actualizarPublicacion', error);
      return null;
    }
  }

  // Eliminar una publicación; devuelve true si se eliminó exitosamente
  async borrarPublicacion(id: number): Promise<boolean> {
    try {
      await lastValueFrom(
        this.http.delete(this.apiUrl + '/publicaciones/' + id, this.httpOptions).pipe(retry(3))
      );
      await this.refrescarPublicacionLista();
      return true;
    } catch (error) {
      showAlertError('APIClientService.borrarPublicacion', error);
      return false;
    }
  }

  // Refrescar el listado de publicaciones y notificar a los suscriptores
  async refrescarPublicacionLista(): Promise<void> {
    try {
      const publicaciones = await this.fetchPublicaciones();
      console.log(publicaciones);
      this.publicacionLista.next(publicaciones);
    } catch (error) {
      showAlertError('APIClientService.refrescarPublicacionLista', error);
    }
  }

  // Obtener todas las publicaciones desde la API
  async fetchPublicaciones(): Promise<Publicacion[]> {
    try {
      const publicaciones = await lastValueFrom(
        this.http.get<Publicacion[]>(this.apiUrl + '/publicaciones').pipe(retry(3)));
      return publicaciones.reverse();
    } catch (error) {
      this.handleHttpError('APIClientService.fetchPublicaciones', error);
      return [];
    }
  }

  // Manejo de errores HTTP con detección de códigos de estado
  private handleHttpError(methodName: string, error: any): void {
    if (error instanceof HttpErrorResponse) {
      const statusCode = error.status;
      if (statusCode === 400) {
        showAlertError(`${methodName} - Solicitud incorrecta (400)`, error.message);
      } else if (statusCode === 401) {
        showAlertError(`${methodName} - No autorizado (401)`, error.message);
      } else if (statusCode === 404) {
        showAlertError(`${methodName} - No encontrado (404)`, error.message, true);
      } else if (statusCode === 500) {
        showAlertError(`${methodName} - Error interno del servidor (500)`, error.message);
      } else {
        showAlertError(`${methodName} - Error inesperado (${statusCode})`, error.message);
      }
    } else {
      showAlertError(`${methodName} - Error desconocido`, error);
    }
  }
}
