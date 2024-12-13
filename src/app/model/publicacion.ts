export class Publicacion {
  
  id = 0;
  title = '';
  body = '';
  author = '';
  date = '';
  authorImage ='';

  constructor() { }

  public static ObtenerNuevaPublicacion(
    id: number,
    title: string,
    body: string,
    author: string,
    date: string,
    authorImage: string
  ) {
    const publicacion = new Publicacion()
    publicacion.id = id;
    publicacion.title = title;
    publicacion.body = body;
    publicacion.author = author;
    publicacion.date = date;
    publicacion.authorImage = authorImage;
    return publicacion;
  }
}