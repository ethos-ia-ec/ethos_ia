import type { Perfil } from './SesionProvider';

// Foto del proveedor o, si la persona la ocultó o no tiene, su inicial.
export default function Avatar({ perfil, tam = 32 }: { perfil: Perfil; tam?: number }) {
  const inicial = perfil.nombre.trim().charAt(0).toUpperCase() || '·';
  return (
    <span className="avatar" style={{ width: tam, height: tam, fontSize: tam * 0.42 }} aria-hidden="true">
      {perfil.mostrarFoto && perfil.foto ? <img src={perfil.foto} alt="" width={tam} height={tam} referrerPolicy="no-referrer" /> : inicial}
      <style jsx>{`
        .avatar { display: inline-grid; place-items: center; flex: none; border-radius: 50%; overflow: hidden; background: linear-gradient(135deg, #0b5f75, #04ebff); color: #05111e; font-weight: 800; box-shadow: 0 0 0 2px rgba(4, 235, 255, 0.35); }
        img { width: 100%; height: 100%; object-fit: cover; }
      `}</style>
    </span>
  );
}
