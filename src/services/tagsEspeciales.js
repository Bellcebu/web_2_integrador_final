// Tags con uso especial en el Home: "Destacado" va al carrusel y "Oferta" / "Promoción" a la sección Ofertas.

export function esTagDestacado(tag) {
  return /destacad/i.test(tag.title);
}

export function esTagOferta(tag) {
  return /oferta|promo/i.test(tag.title);
}
