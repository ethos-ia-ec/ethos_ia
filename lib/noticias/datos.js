// Noticias del sitio. Cada una se publica en /noticias/<slug>. Las víctimas van siempre anónimas.
const NOTICIAS = [
  {
    slug: 'alerta-tiendas-falsas-whatsapp',
    seccion: 'Alerta ciudadana',
    fecha: '2026-11-01',
    fechaTexto: '1 de noviembre de 2026',
    antetitulo: 'Seguridad digital · Compras en línea',
    titulo: '«Me mandó hasta su cédula para que confiara»: denuncian a tienda en redes que cobra y no entrega',
    bajada: 'Personas afectadas relatan que pagaron por adelantado ropa, calzado y disfraces a la tienda «Valero & Co». Para convencerlas, la propia vendedora les enviaba su cédula, su RUC, sus redes sociales y su página web.',
    resumen: 'Testimonios de personas que transfirieron miles de dólares a una tienda de redes sociales que nunca entregó, las cuentas reportadas y cómo protegerse.',
    cuentas: [
      { red: 'Página web', valor: 'sites.google.com/view/valerocompany' },
      { red: 'Instagram', valor: '@valero.ecu' },
      { red: 'TikTok', valor: '@valero.ecu' },
      { red: 'WhatsApp', valor: '+593 98 188 4593' },
      { red: 'Nombre comercial', valor: 'Valero & Co / Valero Company' },
    ],
    cuerpo: [
      { tipo: 'p', texto: 'Ethos IA recibió testimonios de personas que aseguran haber sido estafadas por una tienda que se promociona en TikTok, Instagram, WhatsApp y una página web con el nombre «Valero & Co». Todas coinciden en el mismo patrón: transmisiones en vivo con mercadería, precios atractivos, pago completo por adelantado a una cuenta bancaria de persona natural y, al final, ningún producto entregado.' },
      { tipo: 'h2', texto: 'Lo que cuentan las víctimas' },
      { tipo: 'testimonio', monto: '3 598 dólares', texto: 'Me contactaron por TikTok y me ofrecieron zapatos Nike, Adidas y Under Armour al por mayor. Me enviaron sus redes sociales y su sitio web, por eso confié. Además, ella misma me mandó su RUC para que confiara. Deposité y me estafó.', autor: 'Compradora afectada (identidad reservada)' },
      { tipo: 'testimonio', monto: '5 673 dólares', texto: 'Vi un en vivo en TikTok, vi la mercadería y me dieron un número de empresa. Escribí y me mandó sus redes sociales; hasta su cédula me mandó por WhatsApp. Por eso confié y deposité por dos pacas de ropa original y varias decenas de pares de zapatos deportivos.', autor: 'Comprador afectado (identidad reservada)' },
      { tipo: 'testimonio', monto: '50 dólares', texto: 'Compré un disfraz para Halloween. Apenas mandé el comprobante me escribieron «muchísimas gracias». Horas después me mandaron la foto de una guía de envío que resultó adulterada. El disfraz nunca llegó.', autor: 'Compradora afectada (identidad reservada)' },
      { tipo: 'p', texto: 'Según las personas afectadas, decenas de víctimas más se están comunicando para relatar casos similares.' },
      { tipo: 'h2', texto: 'Las «pruebas» que ella misma enviaba para convencer' },
      { tipo: 'p', texto: 'El elemento común en los testimonios es que la vendedora tomaba la iniciativa de enviar documentos para ganar confianza antes del pago:' },
      { tipo: 'ul', items: [
        'Fotografía de su cédula de identidad, enviada por WhatsApp.',
        'Su número de RUC, para aparentar ser un negocio formal y registrado.',
        'Enlaces a sus perfiles de Instagram y TikTok, con cientos de seguidores y videos de productos.',
        'Una página web con catálogo, precios, tallas y botón de WhatsApp.',
        'Transmisiones en vivo mostrando la mercadería.',
        'En el caso del disfraz, la foto de una guía de envío de una cooperativa de transporte.',
      ] },
      { tipo: 'p', texto: 'Tener RUC activo, redes con seguidores o una página web no garantiza que una tienda entregue lo que vende. Precisamente por eso se usan como carnada.' },
      { tipo: 'galeria', titulo: 'Así se presenta la tienda en internet', imagenes: [
        { src: '/noticias/alerta-tiendas-falsas/sitio-web-1.png', alt: 'Página web de la tienda Valero & Co con ofertas de relojes', pie: 'Página web de la tienda, con ofertas como «2 relojes por $85».' },
        { src: '/noticias/alerta-tiendas-falsas/sitio-web-2.png', alt: 'Catálogo de zapatos de la página web de Valero & Co', pie: 'Catálogo de calzado de marca a 80 dólares y enlaces a Instagram, TikTok y WhatsApp.' },
        { src: '/noticias/alerta-tiendas-falsas/instagram.png', alt: 'Perfil de Instagram valero.ecu', pie: 'Perfil de Instagram @valero.ecu.' },
        { src: '/noticias/alerta-tiendas-falsas/tiktok.png', alt: 'Perfil de TikTok valero.ecu', pie: 'Perfil de TikTok @valero.ecu, donde se hacían transmisiones en vivo.' },
      ] },
      { tipo: 'h2', texto: 'La guía de envío que se delató sola' },
      { tipo: 'p', texto: 'En el caso del disfraz, la guía enviada como «prueba» de despacho tenía señales claras de adulteración:' },
      { tipo: 'ul', items: [
        'El encabezado nombra a una cooperativa, pero la cláusula del pie libera de responsabilidad a otra cooperativa distinta.',
        'El RUC impreso empieza con 18, código de Tungurahua, que no corresponde a la cooperativa del encabezado.',
        'La clave de acceso termina en la secuencia «12345678», algo que el sistema de facturación electrónica no genera.',
        'El valor declarado del contenido es de 0,00 dólares.',
      ] },
      { tipo: 'recuadro', titulo: '¡No se deje engañar! Recomendaciones', items: [
        'Que le envíen una cédula, un RUC o una transmisión en vivo no prueba que la tienda sea legítima.',
        'No transfiera por adelantado a cuentas de personas naturales. Prefiera el pago contra entrega o plataformas con protección al comprador.',
        'Busque el nombre de la tienda y su número de WhatsApp en redes antes de comprar: muchas víctimas publican sus experiencias.',
        'Verifique la guía llamando directamente a la cooperativa, con un número obtenido por su cuenta.',
        'Desconfíe de precios muy por debajo del mercado en productos de marca.',
      ] },
      { tipo: 'recuadro', titulo: 'Si ya cayó, actúe de inmediato', items: [
        'Guarde todo: chats, comprobante de transferencia, guía y enlaces de los perfiles. No borre nada.',
        'Reporte la transferencia a su banco el mismo día.',
        'Presente la denuncia en el Servicio de Atención Integral (SAI) de la Fiscalía con su cédula. Es gratuito y no necesita abogado.',
        'Reporte los perfiles en WhatsApp, TikTok e Instagram para que otras personas no caigan.',
      ] },
      { tipo: 'p', texto: 'Comparta esta alerta con su familia y sus amistades. La mejor protección es la información.' },
    ],
  },
];

const noticiaPorSlug = (slug) => NOTICIAS.find((n) => n.slug === slug) || null;

module.exports = { NOTICIAS, noticiaPorSlug };
