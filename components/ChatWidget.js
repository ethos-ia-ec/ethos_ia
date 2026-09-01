import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const AVATAR_SRC = '/empresa/hero-cyborg-v4.webp';
// El rostro del cyborg cae en la zona superior-izquierda del encuadre original
// (foto de perfil) — este object-position lo centra en un recorte circular.
const AVATAR_POSITION = '28% 40%';

// Widget de chat del sitio: conversación libre desde el primer mensaje, sin
// menú — llama a /api/empresa-chat (mismo origen), que reutiliza la cascada
// de IA compartida del sitio (lib/ai/complete.js, la misma que usa INGenioso
// en pages/api/chat.js) con un system prompt propio de Ethos IA. El bot de
// WhatsApp llama a este mismo endpoint, server a servidor, para su opción
// "Otra pregunta" — así solo hay un lugar que habla con Groq/OpenRouter/
// NVIDIA y lleva la cuota diaria compartida.
//
// Voz: usa la Web Speech API del navegador (SpeechSynthesis) — es gratis,
// no necesita ninguna clave ni servicio externo, y ya viene en Chrome/Edge/
// Safari. Por eso "leer en voz alta" es instantáneo sin pedirte nada nuevo.

const GREETING = { role: 'assistant', content: 'Hola, soy el asistente de Ethos IA. Pregúntame sobre software a medida, auditoría de IA, o cómo trabajamos.' };

function pickSpanishVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => /es-EC|es-419/i.test(v.lang)) ||
    voices.find((v) => v.lang?.toLowerCase().startsWith('es')) ||
    null
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [history, setHistory] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [voiceReady, setVoiceReady] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [history, open, expanded]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    setVoiceReady(true);
    const loadVoices = () => setVoiceReady(true);
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  function toggleSpeak(index, text) {
    if (!voiceReady) return;
    const synth = window.speechSynthesis;

    if (speakingIndex === index) {
      synth.cancel();
      setSpeakingIndex(null);
      return;
    }

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickSpanishVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang || 'es-ES';
    utterance.rate = 1;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    setSpeakingIndex(index);
    synth.speak(utterance);
  }

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const nextHistory = [...history, { role: 'user', content: text }];
    setHistory(nextHistory);
    setInput('');
    setSending(true);

    try {
      const res = await fetch('/api/empresa-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextHistory.slice(-10) }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setHistory((prev) => [
          ...prev,
          { role: 'assistant', content: data?.error || 'No pude responder en este momento. Escríbenos por el formulario de contacto más abajo.' },
        ]);
        return;
      }

      setHistory((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setHistory((prev) => [
        ...prev,
        { role: 'assistant', content: 'No pude conectar con el asistente. Escríbenos por el formulario de contacto más abajo.' },
      ]);
    } finally {
      setSending(false);
    }
  }

  function close() {
    if (voiceReady) window.speechSynthesis.cancel();
    setSpeakingIndex(null);
    setOpen(false);
    setExpanded(false);
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          className="chat-fab"
          onClick={() => setOpen(true)}
          aria-label="Abrir chat con Ethos IA"
        >
          <Image src={AVATAR_SRC} alt="" fill sizes="56px" className="fab-img" />
        </button>
      )}

      {open && (
        <>
          <div className={`chat-panel${expanded ? ' expanded' : ''}`} role="dialog" aria-label="Chat con Ethos IA">
            <div className="chat-head">
              <div className="chat-head-id">
                <span className="chat-avatar-wrap">
                  <span className="chat-avatar">
                    <Image src={AVATAR_SRC} alt="" fill sizes="28px" className="avatar-img" />
                  </span>
                  <span className="chat-avatar-dot" />
                </span>
                <span>Asistente Ethos IA</span>
              </div>
              <div className="chat-head-actions">
                <button
                  type="button"
                  className="chat-icon-btn"
                  onClick={() => setExpanded((v) => !v)}
                  aria-label={expanded ? 'Reducir chat' : 'Maximizar chat'}
                  title={expanded ? 'Reducir' : 'Maximizar'}
                >
                  {expanded ? '⤡' : '⤢'}
                </button>
                <button type="button" className="chat-icon-btn" onClick={close} aria-label="Cerrar chat" title="Cerrar">
                  ✕
                </button>
              </div>
            </div>

            <div className="chat-list" ref={listRef}>
              <div className="chat-inner">
                {history.map((m, i) => (
                  <div key={i} className={`chat-row chat-row-${m.role === 'user' ? 'user' : 'bot'}`}>
                    {m.role === 'user' ? (
                      <div className="chat-bubble">{m.content}</div>
                    ) : (
                      <>
                        <span className="msg-avatar">
                          <Image src={AVATAR_SRC} alt="" fill sizes="24px" className="avatar-img" />
                        </span>
                        <div className="chat-plain">
                          <p>{m.content}</p>
                          {voiceReady && (
                            <button
                              type="button"
                              className={`chat-voice-btn${speakingIndex === i ? ' speaking' : ''}`}
                              onClick={() => toggleSpeak(i, m.content)}
                              aria-label={speakingIndex === i ? 'Detener lectura' : 'Escuchar esta respuesta'}
                              title={speakingIndex === i ? 'Detener' : 'Escuchar'}
                            >
                              {speakingIndex === i ? '⏸' : '🔊'}
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {sending && (
                  <div className="chat-row chat-row-bot">
                    <span className="msg-avatar">
                      <Image src={AVATAR_SRC} alt="" fill sizes="24px" className="avatar-img" />
                    </span>
                    <div className="chat-plain chat-typing">Escribiendo…</div>
                  </div>
                )}
              </div>
            </div>

            <form className="chat-input-row" onSubmit={handleSend}>
              <div className="chat-input-inner">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu pregunta…"
                  disabled={sending}
                  maxLength={500}
                />
                <button type="submit" disabled={sending || !input.trim()} aria-label="Enviar">
                  ➤
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      <style jsx>{`
        .chat-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #04140a;
          border: 2px solid #2fd8c9;
          padding: 0;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(4, 20, 10, 0.35), 0 0 0 4px rgba(47, 216, 201, 0.12);
          z-index: 60;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s ease;
        }
        .chat-fab:hover {
          transform: scale(1.06);
        }
        .chat-fab :global(.fab-img) {
          object-fit: cover;
          object-position: ${AVATAR_POSITION};
        }

        .chat-panel {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: min(380px, calc(100vw - 32px));
          height: min(520px, calc(100vh - 120px));
          background: #0d1420;
          border: 1px solid #1d2b42;
          border-radius: 18px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 70;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .chat-panel.expanded {
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          border-radius: 0;
          border: none;
        }

        .chat-head {
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #17223a;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12.5px;
          letter-spacing: 0.03em;
          color: #c9d1cc;
          flex-shrink: 0;
        }
        .chat-head-id {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .chat-avatar-wrap {
          position: relative;
          width: 26px;
          height: 26px;
          flex-shrink: 0;
        }
        .chat-avatar {
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
        }
        .chat-avatar :global(.avatar-img) {
          object-fit: cover;
          object-position: ${AVATAR_POSITION};
        }
        .chat-avatar-dot {
          position: absolute;
          bottom: -1px;
          right: -1px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #2fd8c9;
          border: 2px solid #0d1420;
        }
        .chat-head-actions {
          display: flex;
          gap: 4px;
        }
        .chat-icon-btn {
          background: transparent;
          border: none;
          color: #8fa0b8;
          font-size: 15px;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .chat-icon-btn:hover {
          background: #17223a;
          color: #eef3f6;
        }

        .chat-list {
          flex: 1;
          overflow-y: auto;
          padding: 18px 16px;
        }
        .chat-panel.expanded .chat-list {
          padding: 32px 24px;
        }
        .chat-inner {
          max-width: 640px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .chat-row-user {
          display: flex;
          justify-content: flex-end;
        }
        .chat-bubble {
          max-width: 82%;
          background: #2fd8c9;
          color: #04140a;
          padding: 10px 14px;
          border-radius: 14px;
          border-bottom-right-radius: 4px;
          font-size: 14px;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        .chat-row-bot {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .msg-avatar {
          position: relative;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .msg-avatar :global(.avatar-img) {
          object-fit: cover;
          object-position: ${AVATAR_POSITION};
        }
        .chat-plain {
          max-width: 100%;
          color: #eef3f6;
          font-size: 14.5px;
          line-height: 1.65;
          display: flex;
          align-items: flex-end;
          gap: 8px;
        }
        .chat-plain p {
          margin: 0;
          white-space: pre-wrap;
        }
        .chat-typing {
          opacity: 0.55;
          font-style: italic;
        }

        .chat-voice-btn {
          flex-shrink: 0;
          background: transparent;
          border: 1px solid #1d2b42;
          color: #8fa0b8;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          font-size: 11px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chat-voice-btn:hover {
          border-color: #2fd8c9;
          color: #2fd8c9;
        }
        .chat-voice-btn.speaking {
          color: #04140a;
          background: #2fd8c9;
          border-color: #2fd8c9;
        }

        .chat-input-row {
          padding: 14px 16px 18px;
          flex-shrink: 0;
        }
        .chat-panel.expanded .chat-input-row {
          padding: 14px 24px 26px;
        }
        .chat-input-inner {
          max-width: 640px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #131c2c;
          border: 1px solid #223252;
          border-radius: 999px;
          padding: 6px 8px 6px 16px;
        }
        .chat-input-inner:focus-within {
          border-color: #2fd8c9;
        }
        .chat-input-inner input {
          flex: 1;
          background: transparent;
          border: none;
          color: #eef3f6;
          font-size: 14px;
          padding: 8px 0;
        }
        .chat-input-inner input:focus {
          outline: none;
        }
        .chat-input-inner button {
          background: #2fd8c9;
          color: #04140a;
          border: none;
          border-radius: 50%;
          width: 34px;
          height: 34px;
          font-size: 14px;
          cursor: pointer;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chat-input-inner button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .chat-panel {
            right: 16px;
            bottom: 16px;
            width: calc(100vw - 32px);
          }
        }
      `}</style>
    </>
  );
}
