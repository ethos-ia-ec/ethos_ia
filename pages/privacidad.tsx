import Legal, { EMPRESA } from '../components/Legal';

// Política de Privacidad y Tratamiento de Datos Personales de ETHOSLAB S.A.S. (LOPDP del Ecuador).
// Describe solo lo que el sitio hace de verdad: cuentas OAuth, formulario de diagnóstico, boletín, asistente de IA y Ethos Prensa.
export default function Privacidad() {
  return (
    <Legal
      titulo="Política de Privacidad"
      descripcion="Cómo ETHOSLAB S.A.S. (Ethos IA) trata los datos personales de quienes usan ethosia.tech, conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador."
      ruta="/privacidad"
      actualizado="30 de octubre de 2026"
    >
      <p>
        Esta política explica qué datos personales trata {EMPRESA.comercial} en el sitio <strong>www.ethosia.tech</strong>, para qué los usa,
        con quién los comparte y cómo ejercer sus derechos, conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador (LOPDP)
        y su Reglamento.
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <div className="recuadro">
        <p>
          <strong>{EMPRESA.razonSocial}</strong>, nombre comercial {EMPRESA.comercial}, RUC {EMPRESA.ruc}, con domicilio en {EMPRESA.domicilio}.<br />
          Correo para asuntos de datos personales: <a href={`mailto:${EMPRESA.correo}`}>{EMPRESA.correo}</a>
        </p>
      </div>

      <h2>2. Datos que tratamos</h2>
      <table>
        <thead><tr><th>Cuándo</th><th>Datos</th></tr></thead>
        <tbody>
          <tr><td>Crea una cuenta o inicia sesión con Google, GitHub o Facebook</td><td>Nombre, correo electrónico y foto de perfil que entrega el proveedor, e identificador de la cuenta. Ethos IA nunca recibe ni guarda su contraseña.</td></tr>
          <tr><td>Envía el formulario de diagnóstico o contacto</td><td>Nombre, correo, área de interés y el mensaje que escriba.</td></tr>
          <tr><td>Se suscribe al boletín Ethos Noticias</td><td>Correo, fecha de alta y, si se da de baja, fecha de baja.</td></tr>
          <tr><td>Conversa con el asistente de IA del sitio</td><td>El texto que escribe en el chat, solo durante la conversación.</td></tr>
          <tr><td>Forma parte del equipo de redacción (Ethos Prensa)</td><td>Nombre, correo, rol y el historial de versiones de las notas que edita.</td></tr>
          <tr><td>Navega por el sitio</td><td>Dirección IP de forma temporal, solo para limitar abusos (límite de solicitudes por minuto).</td></tr>
        </tbody>
      </table>
      <p>No tratamos datos sensibles ni datos de menores de edad de forma intencional. El sitio está dirigido a personas mayores de 18 años y a empresas.</p>

      <h2>3. Para qué los usamos</h2>
      <ul>
        <li>Crear y mantener su cuenta y mostrarle, en «Mi cuenta», las solicitudes que envió con su correo.</li>
        <li>Responder su solicitud de diagnóstico y preparar una propuesta de servicios.</li>
        <li>Enviarle Ethos Noticias, solo si se suscribió.</li>
        <li>Responder sus preguntas mediante el asistente de IA.</li>
        <li>Gestionar los permisos del equipo de redacción y la trazabilidad de lo publicado.</li>
        <li>Proteger el sitio frente a abusos y cumplir obligaciones legales.</li>
      </ul>
      <p>No vendemos sus datos, no los cedemos con fines publicitarios y no tomamos decisiones automatizadas que produzcan efectos jurídicos sobre usted.</p>

      <h2>4. Base legal</h2>
      <ul>
        <li><strong>Consentimiento</strong>: al crear su cuenta, marcar la casilla del formulario o suscribirse al boletín. Puede retirarlo en cualquier momento.</li>
        <li><strong>Ejecución de medidas precontractuales</strong>: para atender una solicitud de diagnóstico que usted pidió.</li>
        <li><strong>Interés legítimo</strong>: seguridad del sitio y prevención de abusos.</li>
      </ul>

      <h2>5. Encargados y transferencias internacionales</h2>
      <p>Para operar el sitio usamos proveedores que tratan datos fuera del Ecuador, con garantías contractuales de protección:</p>
      <table>
        <thead><tr><th>Proveedor</th><th>Para qué</th></tr></thead>
        <tbody>
          <tr><td>Supabase Inc.</td><td>Base de datos, autenticación y almacenamiento.</td></tr>
          <tr><td>Vercel Inc.</td><td>Alojamiento y entrega del sitio.</td></tr>
          <tr><td>Google LLC, GitHub Inc. y Meta Platforms Inc.</td><td>Inicio de sesión, solo si usted elige ese proveedor.</td></tr>
          <tr><td>Groq Inc., OpenRouter Inc. y NVIDIA Corp.</td><td>Modelos del asistente de IA. Reciben solo el texto del chat, no los datos de su cuenta.</td></tr>
        </tbody>
      </table>

      <h2>6. Cuánto tiempo los conservamos</h2>
      <ul>
        <li>Cuenta y perfil: hasta que usted la elimine o lo solicite.</li>
        <li>Boletín: mientras esté suscrito; la constancia de alta y baja se conserva como prueba del consentimiento.</li>
        <li>Solicitudes de diagnóstico: hasta dos años desde el último contacto, o menos si pide su eliminación.</li>
        <li>Conversaciones con el asistente: no se guardan después de la sesión.</li>
        <li>Registros de límite de solicitudes: se borran solos en minutos.</li>
      </ul>

      <h2>7. Sus derechos</h2>
      <p>
        Puede ejercer sus derechos de acceso, rectificación y actualización, eliminación, oposición, portabilidad, suspensión del tratamiento
        y a no ser objeto de decisiones automatizadas escribiendo a <a href={`mailto:${EMPRESA.correo}`}>{EMPRESA.correo}</a>.
        Respondemos en un plazo máximo de 15 días.
      </p>
      <p>
        Desde <a href="/cuenta">Mi cuenta</a> puede, sin escribirnos, darse de baja del boletín y eliminar su cuenta de forma inmediata.
        Si considera que sus derechos no fueron atendidos, puede acudir a la Superintendencia de Protección de Datos Personales.
      </p>

      <h2>8. Seguridad</h2>
      <p>
        Las conexiones van cifradas (HTTPS). El acceso a la base de datos está restringido por reglas de seguridad a nivel de fila: cada persona
        solo ve sus propios datos y solo el personal autorizado ve las solicitudes. Las claves de servicio nunca llegan al navegador.
      </p>

      <h2>9. Almacenamiento en su navegador</h2>
      <p>
        Al iniciar sesión guardamos su sesión en el almacenamiento local del navegador, solo para mantenerlo conectado. No usamos cookies de
        publicidad ni de rastreo de terceros.
      </p>

      <h2>10. Cambios a esta política</h2>
      <p>Publicaremos cualquier cambio en esta página con su fecha. Si el cambio es relevante, lo avisaremos a las cuentas registradas por correo.</p>
    </Legal>
  );
}
