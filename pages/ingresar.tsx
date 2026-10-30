import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import BotonesSociales from '../components/cuenta/BotonesSociales';
import Header from '../components/home/Header';
import { destinoSeguro, sb } from '../lib/sesion';

// Crear cuenta o iniciar sesión con Google, GitHub o Facebook. Es la misma acción: si la cuenta no existe, se crea.
// ?destino=/prensa devuelve al panel de la redacción después de entrar.
export default function Ingresar() {
  const router = useRouter();
  const destino = destinoSeguro(router.query.destino);

  useEffect(() => {
    sb().auth.getSession().then(({ data }) => {
      if (data.session) router.replace(destino);
    });
  }, [destino, router]);

  return (
    <div className="pagina" id="contenido-principal">
      <Head>
        <title>Ingresar | Ethos IA</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Header />
      <main className="caja">
        <p className="eyebrow">Cuenta Ethos IA</p>
        <h1>Ingrese o cree su cuenta</h1>
        <p className="lead">Con su cuenta revisa el estado de sus solicitudes de diagnóstico y recibe Ethos Noticias en su correo.</p>
        <BotonesSociales destino={destino} />
        <p className="legal">
          Al continuar, Ethos IA recibe de su proveedor solo su nombre, su correo y su foto de perfil, y los trata según la{' '}
          <Link href="/privacidad">Política de Tratamiento de Datos Personales</Link>. Ethos IA nunca conoce su contraseña.
        </p>
      </main>
      <style jsx>{`
        .pagina { min-height: 100vh; background: radial-gradient(circle at 20% 0%, var(--c-azul-2), var(--c-azul) 60%); color: var(--c-claro); font-family: var(--font-brand), -apple-system, sans-serif; }
        .caja { max-width: 440px; margin: 0 auto; padding: 140px 16px 64px; }
        .eyebrow { color: var(--c-cian); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700; margin: 0 0 8px; }
        h1 { font-size: clamp(1.8rem, 5vw, 2.3rem); margin: 0 0 12px; line-height: 1.15; }
        .lead { color: var(--c-claro-2); margin: 0 0 28px; line-height: 1.55; }
        .legal { color: var(--c-claro-2); font-size: 12.5px; line-height: 1.6; margin-top: 24px; }
        .legal :global(a) { color: var(--c-cian); }
      `}</style>
    </div>
  );
}
