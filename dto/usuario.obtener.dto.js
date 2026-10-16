export default class UsuarioObtenerDTO {
  #dpi;
  #nombre;
  #email;
  #telefono;
  #activo;
  #creadoEn;

  constructor(data){
    this.#dpi = data.DPI;
    this.#nombre = data.nombre;
    this.#email = data.email;
    this.#telefono = data.telefono;
    this.#activo = data.activo;
    this.#creadoEn = data.creado_en;
  }

  set identificacion(id){ this.#dpi = id }
  set nombre(nombre){ this.#nombre = nombre }
  set email(email){ this.#email = email }
  set telefono(telefono){ this.#telefono = telefono }
  set activo(activo){ this.#activo = activo }
  set creadoEn(creado_en){ this.#creadoEn = creado_en }

  get identificacion(){ return this.#dpi }
  get nombre(){ return this.#nombre }
  get email(){ return this.#email }
  get telefono(){ return this.#telefono }
  get activo(){ return this.#activo === 0 ? false : true }
  get creadoEn(){ return this.#creadoEn }

  get data(){
    return {
      dpi: this.#dpi,
      nombre: this.#nombre,
      email: this.#email,
      telefono: this.#telefono,
      activo: this.#activo,
      creadoEn: this.#creadoEn
    }
  }

}