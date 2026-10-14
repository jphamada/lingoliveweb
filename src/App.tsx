/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';

const simulationBank = {
  es: {
    items: [
      { orig: "Bienvenidos a la sesión bilingüe del directorio general.", trans: "Welcome to the bilingual general board meeting session." },
      { orig: "Hoy revisaremos la estrategia de expansión regional y los nuevos objetivos.", trans: "Today we will review the regional expansion strategy and the new targets." },
      { orig: "Cualquier asistente puede realizar preguntas desde su celular en tiempo real.", trans: "Any attendee can ask questions from their mobile device in real time." }
    ],
    src: "Español",
    dst: "Inglés (EN)"
  },
  en: {
    items: [
      { orig: "Thank you all for joining our global keynote summit this morning.", trans: "Gracias a todos por unirse a nuestra cumbre principal esta mañana." },
      { orig: "As you can see on the main screen, latency is under 200 milliseconds.", trans: "Como pueden ver en la pantalla principal, la latencia es menor a 200 milisegundos." },
      { orig: "All conversations and agreements are safely recorded and ready for minutes export.", trans: "Todas las conversaciones y acuerdos quedan grabados de forma segura y listos para exportar minutas." }
    ],
    src: "Inglés",
    dst: "Español (ES)"
  }
};

export default function App() {
  const [activeLang, setActiveLang] = useState<'es' | 'en'>('es');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [jitterLatency, setJitterLatency] = useState(142);
  const [isPlaying, setIsPlaying] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);
  const [logsStore, setLogsStore] = useState<string[]>([
    "[10:00:02 AM] Conexión WSS establecida con nodo redundante LingoLive.",
    "[10:00:15 AM] Sala bilingüe inicializada con proyección 4K y BYOD activo."
  ]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    eventType: 'Conferencia Internacional',
    audience: '50 - 250 personas'
  });

  // Simulator interval
  useEffect(() => {
    if (!isPlaying) return;
    const payload = simulationBank[activeLang];
    const timer = setInterval(() => {
      setPhraseIdx((prev) => {
        const next = (prev + 1) % payload.items.length;
        const current = payload.items[next];
        const newLatency = Math.floor(Math.random() * 35) + 135;
        setJitterLatency(newLatency);

        const timeStr = new Date().toLocaleTimeString();
        setLogsStore(l => [
          ...l,
          `[${timeStr}] (${payload.src}): ${current.orig}`,
          `[${timeStr}] (${payload.dst}): ${current.trans}`
        ]);
        return next;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [activeLang, isPlaying]);

  const payload = simulationBank[activeLang];
  const currentItem = payload.items[phraseIdx];

  const handleRunSimulation = (lang: 'es' | 'en') => {
    setActiveLang(lang);
    setPhraseIdx(0);
    setIsPlaying(true);
  };

  const handleResetSimulation = () => {
    setIsPlaying(false);
    setPhraseIdx(0);
  };

  const showToast = (title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleDownloadLog = () => {
    const content = "=================================================\n" +
                    "LINGOLIVE - ACTA OFICIAL DE SESIÓN BILINGÜE\n" +
                    "Fecha: " + new Date().toLocaleString() + "\n" +
                    "Protocolo de Cifrado: E2E TLS/WSS 256-bit\n" +
                    "=================================================\n\n" +
                    "RESUMEN EJECUTIVO:\n" +
                    "- Sesión simultánea con pantalla principal y celulares BYOD.\n" +
                    "- Latencia media del enlace: 146ms.\n\n" +
                    "REGISTRO CRONOLÓGICO:\n" +
                    logsStore.join("\n") + "\n\n" +
                    "=================================================\n" +
                    "Fin de la minuta digital generada por LingoLive.\n";

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `LingoLive_Minuta_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Minuta Descargada", "Se ha guardado el archivo de texto estructurado.");
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      if (id === 'demo') {
        setIsPlaying(true);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(false);
    showToast("Demostración Solicitada", "Un especialista técnico se pondrá en contacto en breve.");
    setFormData({ name: '', email: '', eventType: 'Conferencia Internacional', audience: '50 - 250 personas' });
  };

  return (
    <div className="min-h-screen bg-[#f9f9f7] text-[#1a1c1b] flex flex-col font-['Space_Grotesk'] antialiased">
      
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-[#f9f9f7]/90 backdrop-blur-xl border-b border-[#e5e3e1]">
        <div className="h-20 w-full px-6 md:px-16 flex items-center justify-between gap-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#bc0421] flex items-center justify-center shrink-0 shadow-sm">
              <span className="font-['Bodoni_Moda'] text-[18px] text-[#ffffff] italic leading-none select-none">Ll</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-['Bodoni_Moda'] text-[22px] tracking-tight font-normal text-[#1a1c1b]">LingoLive</span>
              <span className="text-[10px] tracking-[0.12em] font-bold text-[#5c403e] uppercase hidden sm:inline">/ TECH</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <button onClick={() => scrollToSection('solucion')} className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5c403e] hover:text-[#1a1c1b] transition-colors">Solución</button>
            <button onClick={() => scrollToSection('demo')} className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5c403e] hover:text-[#1a1c1b] transition-colors">Simulador en Vivo</button>
            <button onClick={() => scrollToSection('caracteristicas')} className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5c403e] hover:text-[#1a1c1b] transition-colors">Características</button>
            <button onClick={() => scrollToSection('comparativa')} className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5c403e] hover:text-[#1a1c1b] transition-colors">Comparativa vs Cabinas</button>
            <button onClick={() => scrollToSection('seguridad')} className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5c403e] hover:text-[#1a1c1b] transition-colors">Seguridad</button>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center bg-[#bc0421] text-[#ffffff] text-[12px] font-semibold uppercase tracking-[0.08em] px-6 py-3 rounded-full hover:bg-[#ab2e32] transition-colors shadow-sm"
            >
              Pedir Demo
            </button>
            <div className="w-8 h-8 rounded-full bg-[#bc0421] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#ffffff] text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="w-full pt-20 flex-grow">
        
        {/* SECTION 1: EDITORIAL SPLIT HERO */}
        <section id="solucion" className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-between px-6 md:px-16 py-12 lg:py-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch my-auto">
            
            {/* Left Column: Typographic Haute-Couture Statement */}
            <div className="lg:col-span-7 flex flex-col justify-between pr-0 lg:pr-8">
              <div>
                {/* Monogram Badge */}
                <div className="mb-8 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#bc0421] flex items-center justify-center shrink-0 shadow-md">
                    <span className="font-['Bodoni_Moda'] text-[24px] text-[#ffffff] italic font-normal select-none">Ll</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] tracking-[0.12em] font-bold text-[#bc0421] uppercase">LingoLive Protocol</span>
                    <span className="text-[13px] text-[#5f5e5e]">Motor Lingüístico Neuronal Simultáneo</span>
                  </div>
                </div>

                {/* Editorial Lead Statement */}
                <h1 className="font-['Bodoni_Moda'] text-[40px] md:text-[56px] lg:text-[72px] leading-[1.08] tracking-[-0.03em] text-[#1a1c1b] mb-6 font-normal">
                  La solución inteligente de <span className="text-[#bc0421] italic">traducción simultánea</span> para eventos bilingües.
                </h1>

                <p className="text-[18px] text-[#5f5e5e] max-w-xl mb-8 leading-relaxed font-normal">
                  Elimina las cabinas costosas y los auriculares propensos a fallas. Con LingoLive proyectas subtítulos fluidos en pantalla gigante mientras cada asistente sigue el debate en su propio celular en tiempo real.
                </p>
              </div>

              {/* Call to Action Cluster & Technical Metadata */}
              <div className="pt-4 flex flex-col gap-6">
                <div className="flex flex-wrap items-center gap-4">
                  <button 
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center justify-center bg-[#bc0421] text-[#ffffff] text-[12px] font-semibold uppercase tracking-[0.08em] px-8 py-3.5 rounded-full hover:bg-[#ab2e32] transition-transform active:scale-95 shadow-md"
                  >
                    Pedir Demostración
                  </button>
                  <button 
                    onClick={() => scrollToSection('demo')}
                    className="inline-flex items-center gap-2 bg-[#eeeeec] hover:bg-[#e8e8e6] text-[#1a1c1b] text-[12px] font-semibold uppercase tracking-[0.08em] px-6 py-3.5 rounded-full transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#bc0421]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                    Probar Simulador
                  </button>
                </div>

                {/* Editorial Micro-links */}
                <div className="flex items-center gap-4 pt-2 text-[#5c403e] text-[10px] tracking-[0.12em] uppercase font-bold">
                  <a href="#solucion" className="hover:text-[#bc0421] transition-colors text-[#bc0421]">Stage Mode</a>
                  <span className="text-[#e2e3e1]">/</span>
                  <a href="#demo" onClick={() => scrollToSection('demo')} className="hover:text-[#bc0421] transition-colors">BYOD Móvil</a>
                  <span className="text-[#e2e3e1]">/</span>
                  <a href="#comparativa" onClick={() => scrollToSection('comparativa')} className="hover:text-[#bc0421] transition-colors">-70% vs Cabinas</a>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Portrait in Architectural Backdrop */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-0">
              <div className="w-full h-full min-h-[460px] lg:min-h-[580px] bg-[#f4f4f2] rounded-xl overflow-hidden relative shadow-lg group border border-[#e5e3e1]">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000" 
                  alt="Keynote Speaker in architectural auditorium"
                  className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 filter grayscale contrast-125"
                  referrerPolicy="no-referrer"
                />
                
                {/* Live Telemetry Floating Plaque on Portrait */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#f9f9f7]/95 backdrop-blur-md p-4 rounded-lg shadow-sm flex items-center justify-between border border-[#e5e3e1]">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#bc0421] animate-ping"></span>
                    <div>
                      <span className="text-[10px] tracking-[0.12em] uppercase text-[#1a1c1b] font-bold block">Live Audio Feed</span>
                      <span className="text-[13px] text-[#5f5e5e]">Sala Plenaria #1 • 4K Stage Sync</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[12px] font-semibold tracking-[0.08em] text-[#bc0421]">142 ms</span>
                    <span className="text-[10px] tracking-[0.12em] text-[#5f5e5e] block uppercase font-bold">Latencia media</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Editorial Key Metrics Bar */}
          <div className="mt-16 pt-8 grid grid-cols-2 lg:grid-cols-4 gap-6 bg-[#ffffff] p-6 lg:p-8 rounded-xl shadow-sm border border-[#e5e3e1]">
            <div className="flex flex-col">
              <span className="font-['Bodoni_Moda'] text-[40px] lg:text-[48px] text-[#1a1c1b] font-normal leading-none mb-1">
                &lt;200<span className="text-[#bc0421] text-[20px] font-semibold">ms</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.12em] text-[#5f5e5e] font-bold">Latencia Ultra Baja</span>
              <span className="text-[13px] text-[#5c403e] mt-1">Streaming WSS ininterrumpido</span>
            </div>
            <div className="flex flex-col">
              <span className="font-['Bodoni_Moda'] text-[40px] lg:text-[48px] text-[#1a1c1b] font-normal leading-none mb-1">
                0<span className="text-[#bc0421] text-[20px] font-semibold">Apps</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.12em] text-[#5f5e5e] font-bold">Acceso Directo BYOD</span>
              <span className="text-[13px] text-[#5c403e] mt-1">Escaneo con cámara nativa</span>
            </div>
            <div className="flex flex-col">
              <span className="font-['Bodoni_Moda'] text-[40px] lg:text-[48px] text-[#1a1c1b] font-normal leading-none mb-1">
                100<span className="text-[#bc0421] text-[20px] font-semibold">%</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.12em] text-[#5f5e5e] font-bold">Cifrado Corporativo</span>
              <span className="text-[13px] text-[#5c403e] mt-1">Zero Data Retention a medida</span>
            </div>
            <div className="flex flex-col">
              <span className="font-['Bodoni_Moda'] text-[40px] lg:text-[48px] text-[#1a1c1b] font-normal leading-none mb-1">
                1<span className="text-[#bc0421] text-[20px] font-semibold">Click</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.12em] text-[#5f5e5e] font-bold">Minutas &amp; Actas</span>
              <span className="text-[13px] text-[#5c403e] mt-1">Descarga inmediata post-sesión</span>
            </div>
          </div>
        </section>

        {/* SECTION 2: LIVE DUAL-STREAM SIMULATOR */}
        <section id="demo" className="w-full px-6 md:px-16 py-20 bg-[#f4f4f2] border-y border-[#e5e3e1]">
          <div className="max-w-6xl mx-auto flex flex-col items-center text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#e2e3e1] px-4 py-1.5 rounded-full mb-4">
              <span className="w-2 h-2 rounded-full bg-[#bc0421]"></span>
              <span className="text-[10px] uppercase tracking-[0.12em] text-[#1a1c1b] font-bold">Simulador Interactivo en Tiempo Real</span>
            </div>
            <h2 className="font-['Bodoni_Moda'] text-[32px] md:text-[48px] text-[#1a1c1b] font-normal">
              Experimente la precisión simultánea de <span className="italic text-[#bc0421]">LingoLive</span>
            </h2>
            <p className="text-[15px] text-[#5f5e5e] max-w-2xl mt-2 leading-relaxed">
              Seleccione un idioma emisor para comprobar cómo el motor traduce con fidelidad fonética para la pantalla del estrado y los teléfonos del auditorio en paralelo.
            </p>

            {/* Language Toggle Trigger */}
            <div className="flex items-center gap-2 mt-6 p-1.5 bg-[#ffffff] rounded-full shadow-sm border border-[#e5e3e1]">
              <button 
                onClick={() => handleRunSimulation('es')}
                className={`px-5 py-2 rounded-full text-[12px] font-semibold uppercase tracking-[0.08em] transition-all ${
                  activeLang === 'es' && isPlaying 
                    ? 'bg-[#bc0421] text-[#ffffff] shadow-sm' 
                    : 'text-[#5f5e5e] hover:text-[#1a1c1b]'
                }`}
              >
                🇪🇸 Orador en Español
              </button>
              <button 
                onClick={() => handleRunSimulation('en')}
                className={`px-5 py-2 rounded-full text-[12px] font-semibold uppercase tracking-[0.08em] transition-all ${
                  activeLang === 'en' && isPlaying 
                    ? 'bg-[#bc0421] text-[#ffffff] shadow-sm' 
                    : 'text-[#5f5e5e] hover:text-[#1a1c1b]'
                }`}
              >
                🇺🇸 Speaker in English
              </button>
              <button 
                onClick={handleResetSimulation}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#5f5e5e] hover:text-[#1a1c1b]"
                title="Reiniciar o Pausar"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              </button>
            </div>
          </div>

          {/* Simulator Deck Grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Stage View Monitor (Col 8) */}
            <div className="lg:col-span-8 bg-[#ffffff] p-8 rounded-xl shadow-sm border border-[#e5e3e1] flex flex-col justify-between min-h-[460px]">
              <div>
                {/* Console Header */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#eeeeec]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#bc0421] text-[20px]">tv</span>
                    <span className="text-[10px] uppercase tracking-[0.12em] font-bold text-[#1a1c1b]">Stage Output // Proyector Principal</span>
                    <span className="bg-[#bc0421]/10 text-[#bc0421] text-[10px] px-2 py-0.5 rounded-full font-bold">4K Ultra-Sync</span>
                  </div>
                  
                  {/* Audio Bar Wave Visualizer */}
                  <div className="flex items-center gap-1 h-5">
                    <span className={`w-1 bg-[#bc0421] rounded-full h-3 ${isPlaying ? 'animate-pulse' : 'opacity-40'}`}></span>
                    <span className={`w-1 bg-[#bc0421] rounded-full h-5 ${isPlaying ? 'animate-pulse' : 'opacity-40'}`}></span>
                    <span className={`w-1 bg-[#bc0421] rounded-full h-4 ${isPlaying ? 'animate-pulse' : 'opacity-40'}`}></span>
                    <span className={`w-1 bg-[#bc0421] rounded-full h-6 ${isPlaying ? 'animate-pulse' : 'opacity-40'}`}></span>
                    <span className={`w-1 bg-[#bc0421] rounded-full h-2 ${isPlaying ? 'animate-pulse' : 'opacity-40'}`}></span>
                  </div>
                </div>

                {/* Original Transcript Block */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#5f5e5e] flex items-center gap-1.5 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5f5e5e]"></span> Transcripción Fonética en Vivo
                    </span>
                    <span className="text-[11px] text-[#5f5e5e] font-mono">Audio Line XLR Stereo</span>
                  </div>
                  <div className="bg-[#f4f4f2] p-4 rounded-lg min-h-[72px] flex items-center border border-[#e5e3e1]">
                    <p className="text-[15px] text-[#5f5e5e] leading-relaxed italic">
                      "{currentItem.orig}"
                    </p>
                  </div>
                </div>

                {/* High-Contrast Live Subtitling Feed */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#bc0421] font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#bc0421] animate-ping"></span> Subtitulado Bilingüe Proyectado
                    </span>
                    <span className="text-[10px] tracking-[0.12em] text-[#bc0421] uppercase font-bold">Latencia: {jitterLatency}ms</span>
                  </div>
                  <div className="bg-[#2f3130] p-6 rounded-lg min-h-[110px] flex items-center shadow-inner">
                    <p className="font-['Bodoni_Moda'] text-[24px] text-[#f1f1ef] font-normal leading-snug">
                      "{currentItem.trans}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Telemetry Bottom Bar */}
              <div className="pt-6 mt-6 border-t border-[#eeeeec] flex flex-wrap items-center justify-between text-[#5f5e5e] text-[10px] uppercase tracking-[0.12em]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#bc0421] text-[16px]">verified</span>
                  <span>Algoritmo Semántico Cuántico: Nominal</span>
                </div>
                <span className="text-[#1a1c1b] font-bold">Buffer 0.02s</span>
              </div>
            </div>

            {/* Mobile BYOD Mockup (Col 4) */}
            <div className="lg:col-span-4 bg-[#ffffff] p-6 rounded-xl shadow-sm border border-[#e5e3e1] flex flex-col justify-between min-h-[460px]">
              <div>
                {/* Mobile Shell Top */}
                <div className="bg-[#e8e8e6] p-3 rounded-lg flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#bc0421]"></span>
                    <span className="text-[11px] font-bold text-[#1a1c1b] uppercase">LingoLive Web-Attendee</span>
                  </div>
                  <span className="text-[10px] bg-[#ffffff] px-2 py-0.5 rounded text-[#5f5e5e] font-mono border border-[#e5e3e1]">Sala #704</span>
                </div>

                {/* Attendee Selection */}
                <div className="p-3 bg-[#f9f9f7] rounded-lg mb-4 flex items-center justify-between border border-[#e5e3e1]">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-[#5f5e5e]">Canal de Escucha:</span>
                  <span className="text-[10px] uppercase tracking-[0.08em] bg-[#bc0421] text-[#ffffff] px-2.5 py-0.5 rounded-full font-bold">
                    {payload.dst}
                  </span>
                </div>

                {/* Mobile Live Feed Card */}
                <div className="p-4 bg-[#f4f4f2] rounded-lg min-h-[140px] flex flex-col justify-between mb-4 border border-[#e5e3e1]">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#bc0421] font-bold block mb-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">headphones</span> Auricular Personal Activo
                    </span>
                    <p className="text-[15px] text-[#1a1c1b] font-medium leading-relaxed">
                      "{currentItem.trans}"
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 text-[#5f5e5e] text-[11px] uppercase font-mono">
                    <span>Modo TTS Neural HD</span>
                    <span className="text-[#bc0421] font-bold">Sincronizado</span>
                  </div>
                </div>

                {/* QR Access Mock */}
                <div className="p-3 bg-[#f9f9f7] rounded-lg flex items-center gap-3 border border-[#e5e3e1]">
                  <div className="w-12 h-12 bg-[#1a1c1b] rounded p-1 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full text-[#f9f9f7]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm-2 10h8v8H2v-8zm2 2v4h4v-4H4zm10-14h8v8h-8V2zm2 2v4h4V4h-4zm2 10h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2zm0-4h2v2h-2v-2zm-2 2h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2z"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.08em] font-bold text-[#1a1c1b] block">QR Dinámico de Sala</span>
                    <span className="text-[12px] text-[#5f5e5e] leading-snug block">Los invitados se suman en 3 segundos sin instalar aplicaciones.</span>
                  </div>
                </div>
              </div>

              {/* Export Trigger in Simulator */}
              <button 
                onClick={handleDownloadLog}
                className="w-full mt-4 bg-[#eeeeec] hover:bg-[#e8e8e6] text-[#1a1c1b] text-[11px] font-semibold uppercase tracking-[0.08em] py-3 rounded-lg transition-colors flex items-center justify-center gap-2 border border-[#e5e3e1]"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Descargar Acta de Muestra (TXT)
              </button>
            </div>

          </div>
        </section>

        {/* SECTION 3: EDITORIAL PILLARS / CHARACTERISTICS GRID */}
        <section id="caracteristicas" className="w-full px-6 md:px-16 py-24 max-w-7xl mx-auto">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="max-w-2xl">
              <span className="text-[10px] uppercase tracking-[0.12em] text-[#bc0421] font-bold block mb-2">Capacidades del Sistema</span>
              <h2 className="font-['Bodoni_Moda'] text-[36px] md:text-[48px] text-[#1a1c1b] font-normal leading-tight">
                Diseñado exclusivamente para la dinámica de <span className="italic text-[#bc0421]">reuniones bilingües</span>
              </h2>
            </div>
            <p className="text-[15px] text-[#5f5e5e] max-w-sm mt-4 md:mt-0 leading-relaxed">
              La conjunción de software web ligero y modelos fonéticos simultáneos erradica el retraso y el costo operacional.
            </p>
          </div>

          {/* 6 Asymmetric Architectural Feature Cards */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-[#ffffff] p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group border border-[#e5e3e1]">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#bc0421]/10 text-[#bc0421] flex items-center justify-center mb-6 group-hover:bg-[#bc0421] group-hover:text-[#ffffff] transition-colors">
                  <span className="material-symbols-outlined text-[24px]">present_to_all</span>
                </div>
                <h3 className="font-['Bodoni_Moda'] text-[24px] text-[#1a1c1b] mb-3 font-normal">Proyección en Escenario</h3>
                <p className="text-[15px] text-[#5f5e5e] leading-relaxed">
                  Ideal para auditorios y videowalls. Proyecta subtítulos en alto contraste, ajustables en tamaño de fuente y con modo bilingüe simultáneo para que toda la sala siga el hilo sin perderse.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#eeeeec]">
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#bc0421] font-bold">Stage Mode 4K</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#ffffff] p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group border border-[#e5e3e1]">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#bc0421]/10 text-[#bc0421] flex items-center justify-center mb-6 group-hover:bg-[#bc0421] group-hover:text-[#ffffff] transition-colors">
                  <span className="material-symbols-outlined text-[24px]">smartphone</span>
                </div>
                <h3 className="font-['Bodoni_Moda'] text-[24px] text-[#1a1c1b] mb-3 font-normal">Utilización Celular (BYOD)</h3>
                <p className="text-[15px] text-[#5f5e5e] leading-relaxed">
                  Cero fricción de adopción. Los asistentes solo escanean un código QR y acceden a una web ultra ligera. Cada usuario elige si desea leer los subtítulos o escuchar la traducción con sus auriculares.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#eeeeec]">
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#bc0421] font-bold">Zero Downloads</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#ffffff] p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group border border-[#e5e3e1]">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#bc0421]/10 text-[#bc0421] flex items-center justify-center mb-6 group-hover:bg-[#bc0421] group-hover:text-[#ffffff] transition-colors">
                  <span className="material-symbols-outlined text-[24px]">bolt</span>
                </div>
                <h3 className="font-['Bodoni_Moda'] text-[24px] text-[#1a1c1b] mb-3 font-normal">Ultra Baja Latencia (&lt;200ms)</h3>
                <p className="text-[15px] text-[#5f5e5e] leading-relaxed">
                  Streaming bidireccional continuo por WebSockets. El motor comprende el contexto fonético y sintáctico mientras la persona habla, reduciendo el desfase a un nivel prácticamente imperceptible.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#eeeeec]">
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#bc0421] font-bold">Real-Time WSS Pipeline</span>
              </div>
            </div>

            {/* Card 4 */}
            <div id="seguridad" className="bg-[#ffffff] p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group border border-[#e5e3e1]">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#bc0421]/10 text-[#bc0421] flex items-center justify-center mb-6 group-hover:bg-[#bc0421] group-hover:text-[#ffffff] transition-colors">
                  <span className="material-symbols-outlined text-[24px]">shield_lock</span>
                </div>
                <h3 className="font-['Bodoni_Moda'] text-[24px] text-[#1a1c1b] mb-3 font-normal">Entorno Seguro &amp; Privacidad</h3>
                <p className="text-[15px] text-[#5f5e5e] leading-relaxed">
                  Cifrado TLS/WSS de extremo a extremo, tokens efímeros de acceso para reuniones directivas y políticas de <em>Zero Data Retention</em> configurable para no almacenar audios confidenciales.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#eeeeec]">
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#bc0421] font-bold">SOC2 / Zero Retention</span>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-[#ffffff] p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group border border-[#e5e3e1]">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#bc0421]/10 text-[#bc0421] flex items-center justify-center mb-6 group-hover:bg-[#bc0421] group-hover:text-[#ffffff] transition-colors">
                  <span className="material-symbols-outlined text-[24px]">summarize</span>
                </div>
                <h3 className="font-['Bodoni_Moda'] text-[24px] text-[#1a1c1b] mb-3 font-normal">Minutas &amp; Actas en 1-Click</h3>
                <p className="text-[15px] text-[#5f5e5e] leading-relaxed">
                  Al terminar la reunión, descarga de inmediato la transcripción original con marcas de tiempo, las traducciones y un resumen ejecutivo estructurado con los puntos clave y acuerdos adoptados.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#eeeeec]">
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#bc0421] font-bold">Instant Executive Summary</span>
              </div>
            </div>

            {/* Card 6 */}
            <div className="bg-[#ffffff] p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group border border-[#e5e3e1]">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#bc0421]/10 text-[#bc0421] flex items-center justify-center mb-6 group-hover:bg-[#bc0421] group-hover:text-[#ffffff] transition-colors">
                  <span className="material-symbols-outlined text-[24px]">forum</span>
                </div>
                <h3 className="font-['Bodoni_Moda'] text-[24px] text-[#1a1c1b] mb-3 font-normal">Q&amp;A Bilingüe en Doble Vía</h3>
                <p className="text-[15px] text-[#5f5e5e] leading-relaxed">
                  Los asistentes pueden plantear preguntas en su lengua materna desde su teléfono móvil o micrófono de sala, y el expositor las lee o escucha traducidas al instante. Diálogo natural y fluido.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#eeeeec]">
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#bc0421] font-bold">Bidirectional Stream</span>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 4: STEP-BY-STEP DEPLOYMENT FLOW */}
        <section className="w-full px-6 md:px-16 py-24 bg-[#f4f4f2] border-y border-[#e5e3e1]">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center max-w-2xl mx-auto">
              <span className="text-[10px] uppercase tracking-[0.12em] text-[#bc0421] font-bold">Despliegue Rápido</span>
              <h2 className="font-['Bodoni_Moda'] text-[36px] md:text-[48px] text-[#1a1c1b] font-normal mt-1">
                Listo para usar en <span className="italic text-[#bc0421]">3 sencillos pasos</span>
              </h2>
              <p className="text-[15px] text-[#5f5e5e] mt-2">Sin técnicos dedicados, sin fletes de cabinas físicas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-[#ffffff] p-8 rounded-xl shadow-sm flex flex-col justify-between border border-[#e5e3e1]">
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#bc0421] text-[#ffffff] flex items-center justify-center mb-6 font-['Bodoni_Moda'] text-[24px] italic">
                    1
                  </div>
                  <h4 className="font-['Bodoni_Moda'] text-[24px] text-[#1a1c1b] font-normal mb-3">Conecta el audio</h4>
                  <p className="text-[15px] text-[#5f5e5e] leading-relaxed">
                    Enlaza la consola de audio de tu evento o el micrófono del expositor a través de nuestra interfaz web o app de transmisión dedicada.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#eeeeec]">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-[#5f5e5e] font-bold">Paso 01 // Input Setup</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-[#ffffff] p-8 rounded-xl shadow-sm flex flex-col justify-between border border-[#e5e3e1]">
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#bc0421] text-[#ffffff] flex items-center justify-center mb-6 font-['Bodoni_Moda'] text-[24px] italic">
                    2
                  </div>
                  <h4 className="font-['Bodoni_Moda'] text-[24px] text-[#1a1c1b] font-normal mb-3">Proyecta y comparte el QR</h4>
                  <p className="text-[15px] text-[#5f5e5e] leading-relaxed">
                    Abre la vista de escenario en la pantalla grande del salón y proyecta el código QR para que la audiencia ingrese directamente desde sus teléfonos.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#eeeeec]">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-[#5f5e5e] font-bold">Paso 02 // Room Display</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-[#ffffff] p-8 rounded-xl shadow-sm flex flex-col justify-between border border-[#e5e3e1]">
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#bc0421] text-[#ffffff] flex items-center justify-center mb-6 font-['Bodoni_Moda'] text-[24px] italic">
                    3
                  </div>
                  <h4 className="font-['Bodoni_Moda'] text-[24px] text-[#1a1c1b] font-normal mb-3">Habla y descarga minutas</h4>
                  <p className="text-[15px] text-[#5f5e5e] leading-relaxed">
                    LingoLive traduce con latencia mínima. Al finalizar, exporta el acta completa y la minuta ejecutiva en formato digital seguro.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#eeeeec]">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-[#5f5e5e] font-bold">Paso 03 // Output &amp; Logs</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: EDITORIAL COMPARATIVE TABLE */}
        <section id="comparativa" className="w-full px-6 md:px-16 py-24 max-w-7xl mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] uppercase tracking-[0.12em] text-[#bc0421] font-bold">Eficiencia &amp; Logística</span>
              <h2 className="font-['Bodoni_Moda'] text-[36px] md:text-[48px] text-[#1a1c1b] font-normal mt-1">
                LingoLive vs <span className="italic text-[#bc0421]">Cabinas Tradicionales</span>
              </h2>
              <p className="text-[15px] text-[#5f5e5e] mt-2">
                Por qué directores de eventos y líderes corporativos eligen nuestra infraestructura lingüística.
              </p>
            </div>

            {/* Clean Architectural Comparison Board */}
            <div className="bg-[#ffffff] rounded-xl shadow-sm overflow-hidden border border-[#e5e3e1]">
              <div className="grid grid-cols-12 bg-[#eeeeec] p-4 text-[12px] uppercase tracking-[0.08em] text-[#5f5e5e] font-bold">
                <div className="col-span-4 sm:col-span-3">Criterio</div>
                <div className="col-span-4 sm:col-span-5 text-[#bc0421] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#bc0421]"></span> LingoLive System
                </div>
                <div className="col-span-4 sm:col-span-4 text-[#5f5e5e]">Cabinas de Intérprete</div>
              </div>

              <div className="divide-y divide-[#eeeeec]">
                {/* Row 1 */}
                <div className="grid grid-cols-12 p-4 sm:p-6 items-center hover:bg-[#f4f4f2] transition-colors">
                  <div className="col-span-4 sm:col-span-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#1a1c1b]">Hardware</div>
                  <div className="col-span-4 sm:col-span-5 text-[15px] text-[#1a1c1b] font-semibold pr-2">
                    Cero hardware. Celulares (BYOD) y proyector del salón.
                  </div>
                  <div className="col-span-4 sm:col-span-4 text-[13px] text-[#5f5e5e]">
                    Cabinas pesadas, receptores RF, pilas y auriculares propensos a pérdidas.
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-12 p-4 sm:p-6 items-center hover:bg-[#f4f4f2] transition-colors">
                  <div className="col-span-4 sm:col-span-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#1a1c1b]">Setup Time</div>
                  <div className="col-span-4 sm:col-span-5 text-[15px] text-[#bc0421] font-bold pr-2">
                    &lt; 5 minutos (Acceso web inmediato).
                  </div>
                  <div className="col-span-4 sm:col-span-4 text-[13px] text-[#5f5e5e]">
                    4 a 6 horas de montaje técnico y verificación de radiofrecuencias.
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-12 p-4 sm:p-6 items-center hover:bg-[#f4f4f2] transition-colors">
                  <div className="col-span-4 sm:col-span-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#1a1c1b]">Ahorro Costos</div>
                  <div className="col-span-4 sm:col-span-5 text-[15px] text-[#1a1c1b] font-semibold pr-2">
                    Hasta un 70% de reducción del presupuesto por evento.
                  </div>
                  <div className="col-span-4 sm:col-span-4 text-[13px] text-[#5f5e5e]">
                    Costos exorbitantes por traslado, viáticos y múltiples intérpretes en turnos.
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-12 p-4 sm:p-6 items-center hover:bg-[#f4f4f2] transition-colors">
                  <div className="col-span-4 sm:col-span-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#1a1c1b]">Minutas Post-Evento</div>
                  <div className="col-span-4 sm:col-span-5 text-[15px] text-[#1a1c1b] font-semibold pr-2">
                    Automáticas en 1 clic (Transcripción original, traducción y acuerdos).
                  </div>
                  <div className="col-span-4 sm:col-span-4 text-[13px] text-[#5f5e5e]">
                    No incluido. Requiere contratar desgrabación y transcripción manual adicional.
                  </div>
                </div>

                {/* Row 5 */}
                <div className="grid grid-cols-12 p-4 sm:p-6 items-center hover:bg-[#f4f4f2] transition-colors">
                  <div className="col-span-4 sm:col-span-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#1a1c1b]">Seguridad</div>
                  <div className="col-span-4 sm:col-span-5 text-[15px] text-[#bc0421] font-bold pr-2">
                    Salas efímeras con token criptográfico temporal y Zero Retention.
                  </div>
                  <div className="col-span-4 sm:col-span-4 text-[13px] text-[#5f5e5e]">
                    Posible interceptación por canales analógicos de radiofrecuencia abierta.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: CONCLUDING CALL TO ACTION */}
        <section className="w-full px-6 md:px-16 py-24 bg-[#f4f4f2] border-t border-[#e5e3e1]">
          <div className="max-w-4xl mx-auto bg-[#ffffff] p-8 md:p-16 rounded-xl shadow-md text-center flex flex-col items-center border border-[#e5e3e1]">
            <div className="w-14 h-14 rounded-full bg-[#bc0421] flex items-center justify-center mb-6 shadow-sm">
              <span className="font-['Bodoni_Moda'] text-[24px] text-[#ffffff] italic font-normal select-none">Ll</span>
            </div>
            
            <span className="text-[10px] uppercase tracking-[0.12em] text-[#bc0421] font-bold mb-2">
              Cumbres, Directorios &amp; Conferencias
            </span>
            
            <h2 className="font-['Bodoni_Moda'] text-[36px] md:text-[48px] text-[#1a1c1b] font-normal max-w-2xl leading-tight mb-4">
              Haz que tu próxima conferencia hable <span className="italic text-[#bc0421]">todos los idiomas</span> sin barreras.
            </h2>
            
            <p className="text-[18px] text-[#5f5e5e] max-w-xl mb-8 leading-relaxed">
              Ofrece una experiencia de interpretación simultánea inclusiva, elegante y con latencia imperceptible. Agenda una demostración técnica guiada para tu organización.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button 
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center justify-center bg-[#bc0421] text-[#ffffff] text-[12px] font-semibold uppercase tracking-[0.08em] px-8 py-3.5 rounded-full hover:bg-[#ab2e32] transition-transform active:scale-95 shadow-md"
              >
                Solicitar Demostración Guiada
              </button>
              <button 
                onClick={() => scrollToSection('demo')}
                className="inline-flex items-center justify-center bg-[#eeeeec] hover:bg-[#e8e8e6] text-[#1a1c1b] text-[12px] font-semibold uppercase tracking-[0.08em] px-6 py-3.5 rounded-full transition-colors border border-[#e5e3e1]"
              >
                Probar Simulador
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 pt-8 border-t border-[#eeeeec] flex flex-wrap items-center justify-center gap-6 text-[#5f5e5e] text-[10px] uppercase tracking-[0.12em] font-bold">
              <span>Garantía de Latencia &lt; 200ms</span>
              <span className="text-[#e2e3e1]">•</span>
              <span>Soporte In-Situ &amp; Remoto</span>
              <span className="text-[#e2e3e1]">•</span>
              <span>Compliance Corporativo</span>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#f4f4f2] border-t border-[#e5e3e1]">
        <div className="w-full px-6 md:px-16 py-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#bc0421] flex items-center justify-center">
                  <span className="font-['Bodoni_Moda'] text-[16px] text-[#ffffff] italic leading-none">Ll</span>
                </div>
                <span className="font-['Bodoni_Moda'] text-[20px] text-[#1a1c1b]">LingoLive</span>
              </div>
              <p className="text-[15px] text-[#5c403e] max-w-md leading-relaxed">
                Infraestructura lingüística simultánea de alta costura para conferencias de estado, corporaciones multinacionales y cumbres editoriales globales.
              </p>
            </div>

            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div className="flex flex-col gap-4">
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#5c403e] font-bold">Plataforma</span>
                <nav className="flex flex-col gap-2">
                  <button onClick={() => scrollToSection('solucion')} className="text-left text-[13px] text-[#5f5e5e] hover:text-[#1a1c1b] transition-colors">Solución</button>
                  <button onClick={() => scrollToSection('demo')} className="text-left text-[13px] text-[#5f5e5e] hover:text-[#1a1c1b] transition-colors">Simulador en Vivo</button>
                  <button onClick={() => scrollToSection('caracteristicas')} className="text-left text-[13px] text-[#5f5e5e] hover:text-[#1a1c1b] transition-colors">Características</button>
                </nav>
              </div>

              <div className="flex flex-col gap-4">
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#5c403e] font-bold">Institucional</span>
                <nav className="flex flex-col gap-2">
                  <button onClick={() => scrollToSection('comparativa')} className="text-left text-[13px] text-[#5f5e5e] hover:text-[#1a1c1b] transition-colors">Comparativa vs Cabinas</button>
                  <button onClick={() => scrollToSection('seguridad')} className="text-left text-[13px] text-[#5f5e5e] hover:text-[#1a1c1b] transition-colors">Seguridad y Cumplimiento</button>
                  <button onClick={() => setModalOpen(true)} className="text-left text-[13px] text-[#5f5e5e] hover:text-[#1a1c1b] transition-colors">Agendar Sesión</button>
                </nav>
              </div>

              <div className="flex flex-col gap-4">
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#5c403e] font-bold">Protocolo</span>
                <span className="text-[13px] text-[#5f5e5e]">Latencia &lt; 280ms</span>
                <span className="text-[13px] text-[#5f5e5e]">Cifrado E2E Cuántico</span>
                <span className="text-[13px] text-[#5f5e5e]">ISO 27001 / SOC2 Type II</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[#e5e3e1]">
            <span className="text-[10px] uppercase tracking-[0.12em] text-[#5c403e]">© 2025 LingoLive Systems Corp. Todos los derechos reservados.</span>
            <div className="flex items-center gap-6">
              <a href="#" className="text-[10px] uppercase tracking-[0.12em] text-[#5c403e] hover:text-[#1a1c1b] transition-colors">Privacidad</a>
              <a href="#" className="text-[10px] uppercase tracking-[0.12em] text-[#5c403e] hover:text-[#1a1c1b] transition-colors">Términos de Servicio</a>
              <a href="#" className="text-[10px] uppercase tracking-[0.12em] text-[#5c403e] hover:text-[#1a1c1b] transition-colors">Aviso Legal</a>
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL: AGENDAR DEMO INTERACTIVA */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1c1b]/40 backdrop-blur-sm transition-opacity">
          <div className="bg-[#ffffff] p-8 md:p-10 rounded-xl shadow-xl max-w-lg w-full relative border border-[#e5e3e1]">
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[#5f5e5e] hover:text-[#1a1c1b] p-1 rounded-full"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#bc0421] flex items-center justify-center">
                <span className="font-['Bodoni_Moda'] text-[18px] text-[#ffffff] italic font-normal">Ll</span>
              </div>
              <div>
                <h3 className="font-['Bodoni_Moda'] text-[24px] text-[#1a1c1b] font-normal">Agendar Demostración</h3>
                <p className="text-[13px] text-[#5f5e5e]">Coordinaremos una sesión en vivo adaptada a su evento.</p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.12em] text-[#5f5e5e] mb-1 font-bold">Nombre y Apellido</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#f9f9f7] p-3 rounded font-['Space_Grotesk'] text-[15px] text-[#1a1c1b] focus:outline-none focus:ring-1 focus:ring-[#bc0421] border border-[#e5e3e1]"
                  placeholder="Ej. Carlos Mendoza" 
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.12em] text-[#5f5e5e] mb-1 font-bold">Correo Electrónico Corporativo</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#f9f9f7] p-3 rounded font-['Space_Grotesk'] text-[15px] text-[#1a1c1b] focus:outline-none focus:ring-1 focus:ring-[#bc0421] border border-[#e5e3e1]"
                  placeholder="carlos@empresa.com" 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.12em] text-[#5f5e5e] mb-1 font-bold">Tipo de Evento</label>
                  <select 
                    value={formData.eventType}
                    onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full bg-[#f9f9f7] p-3 rounded font-['Space_Grotesk'] text-[13px] text-[#1a1c1b] focus:outline-none focus:ring-1 focus:ring-[#bc0421] border border-[#e5e3e1]"
                  >
                    <option>Conferencia Internacional</option>
                    <option>Reunión de Directorio</option>
                    <option>Workshop / Capacitación</option>
                    <option>Cumbre Híbrida</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.12em] text-[#5f5e5e] mb-1 font-bold">Audiencia Estimada</label>
                  <select 
                    value={formData.audience}
                    onChange={e => setFormData({ ...formData, audience: e.target.value })}
                    className="w-full bg-[#f9f9f7] p-3 rounded font-['Space_Grotesk'] text-[13px] text-[#1a1c1b] focus:outline-none focus:ring-1 focus:ring-[#bc0421] border border-[#e5e3e1]"
                  >
                    <option>10 - 50 personas</option>
                    <option>50 - 250 personas</option>
                    <option>250 - 1.000 personas</option>
                    <option>+1.000 asistentes</option>
                  </select>
                </div>
              </div>
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-[#bc0421] text-[#ffffff] text-[12px] font-semibold uppercase tracking-[0.08em] py-3.5 rounded-full hover:bg-[#ab2e32] transition-colors shadow-md"
                >
                  Confirmar y Solicitar Enlace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#ffffff] p-4 rounded-xl shadow-xl flex items-center gap-3 border border-[#e5e3e1] animate-bounce">
          <div className="w-8 h-8 rounded-full bg-[#bc0421] text-[#ffffff] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">done</span>
          </div>
          <div>
            <h5 className="text-[12px] uppercase tracking-[0.08em] text-[#1a1c1b] font-bold">{toast.title}</h5>
            <p className="text-[13px] text-[#5f5e5e]">{toast.message}</p>
          </div>
        </div>
      )}

    </div>
  );
}
