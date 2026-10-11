// Divide un título en palabras que aparecen una tras otra cuando su contenedor (.reveal) entra en pantalla.
// Los estilos (.pw) viven en EfectosInteractivos. El texto completo sigue disponible para lectores de pantalla.
export default function Palabras({ texto }) {
  const palabras = texto.split(' ');
  return (
    <>
      <span className="sr-only-pw" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{texto}</span>
      <span aria-hidden="true">
        {palabras.map((p, i) => (
          <span key={`${p}-${i}`} className="pw" style={{ '--i': i }}>{p}{i < palabras.length - 1 ? ' ' : ''}</span>
        ))}
      </span>
    </>
  );
}
