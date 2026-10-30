import Legal, { EMPRESA } from '../components/Legal';

// Condiciones del Servicio de ethosia.tech (ETHOSLAB S.A.S.). Regulan el uso del sitio y de las cuentas;
// los proyectos contratados se rigen por su propio contrato.
export default function Terminos() {
  return (
    <Legal
      titulo="Condiciones del Servicio"
      descripcion="Condiciones de uso del sitio ethosia.tech y de las cuentas de Ethos IA (ETHOSLAB S.A.S.)."
      ruta="/terminos"
      actualizado="30 de octubre de 2026"
    >
      <p>
        Estas condiciones regulan el uso del sitio <strong>www.ethosia.tech</strong> y de las cuentas que ofrece, operados por{' '}
        <strong>{EMPRESA.razonSocial}</strong> (nombre comercial {EMPRESA.comercial}), RUC {EMPRESA.ruc}, con domicilio en {EMPRESA.domicilio}.
        Al usar el sitio o crear una cuenta, usted las acepta.
      </p>

      <h2>1. Qué ofrece el sitio</h2>
      <ul>
        <li>Información sobre los servicios de software, inteligencia artificial y tecnologías de la información de {EMPRESA.comercial}.</li>
        <li>Solicitud de diagnóstico sin costo y sin compromiso.</li>
        <li>Ethos Noticias, su boletín por correo y Ethos IA Academia.</li>
        <li>Un asistente de IA que responde preguntas generales sobre la empresa.</li>
        <li>Cuentas de usuario con inicio de sesión mediante Google, GitHub o Facebook.</li>
      </ul>

      <h2>2. Su cuenta</h2>
      <ul>
        <li>Debe ser mayor de 18 años y usar una cuenta de proveedor que le pertenezca.</li>
        <li>Es responsable de la seguridad de su cuenta en el proveedor con el que inicia sesión.</li>
        <li>Puede eliminar su cuenta en cualquier momento desde <a href="/cuenta">Mi cuenta</a>.</li>
        <li>Podemos suspender cuentas que incumplan estas condiciones, con aviso al correo registrado cuando sea posible.</li>
      </ul>

      <h2>3. Uso aceptable</h2>
      <p>No está permitido:</p>
      <ul>
        <li>intentar acceder a datos de otras personas o a zonas restringidas del sitio;</li>
        <li>enviar solicitudes automatizadas masivas, código malicioso o contenido ilícito;</li>
        <li>usar el asistente de IA para generar contenido que infrinja derechos de terceros o la ley ecuatoriana;</li>
        <li>suplantar a otra persona o a {EMPRESA.comercial}.</li>
      </ul>
      <p>Si encuentra una vulnerabilidad, repórtela a <a href={`mailto:${EMPRESA.correo}`}>{EMPRESA.correo}</a>; la atenderemos de forma responsable.</p>

      <h2>4. Asistente de inteligencia artificial</h2>
      <p>
        Las respuestas del asistente se generan de forma automática y tienen carácter orientativo. No constituyen una oferta comercial, una
        cotización ni asesoría legal, contable o financiera. Las condiciones de cualquier servicio se fijan por escrito con el equipo de {EMPRESA.comercial}.
      </p>

      <h2>5. Servicios contratados</h2>
      <p>
        El diagnóstico solicitado por el sitio no genera obligación de contratar. Todo proyecto, licencia o servicio se rige por la propuesta y el
        contrato firmados entre las partes, que prevalecen sobre estas condiciones.
      </p>

      <h2>6. Propiedad intelectual</h2>
      <p>
        La marca {EMPRESA.comercial}, los logotipos, los textos, el diseño y el código del sitio pertenecen a {EMPRESA.razonSocial} o a sus
        licenciantes. Los materiales de Ethos IA Academia se publican con la licencia indicada en su repositorio. Las notas de Ethos Noticias
        pueden citarse con mención de la fuente y enlace a la nota original.
      </p>

      <h2>7. Responsabilidad</h2>
      <p>
        Procuramos que el sitio esté disponible y que su información sea exacta, pero se ofrece en el estado en que se encuentra. En la medida
        que permita la ley, {EMPRESA.razonSocial} no responde por interrupciones, por decisiones tomadas solo con base en el contenido del sitio
        o por servicios de terceros enlazados desde él. Nada de lo anterior limita los derechos que la Ley Orgánica de Defensa del Consumidor le reconoce.
      </p>

      <h2>8. Datos personales</h2>
      <p>El tratamiento de sus datos se rige por la <a href="/privacidad">Política de Privacidad</a>.</p>

      <h2>9. Cambios</h2>
      <p>Podemos actualizar estas condiciones. La versión vigente es la publicada en esta página con su fecha; los cambios relevantes se avisarán a las cuentas registradas.</p>

      <h2>10. Ley aplicable y contacto</h2>
      <p>
        Estas condiciones se rigen por las leyes de la República del Ecuador. Cualquier controversia se someterá a los jueces competentes de
        Cuenca, Azuay. Consultas: <a href={`mailto:${EMPRESA.correo}`}>{EMPRESA.correo}</a>.
      </p>
    </Legal>
  );
}
