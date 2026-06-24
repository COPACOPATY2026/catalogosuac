/**
 * accessibility.js — COPACO Catálogo de Servicios
 * Módulo de accesibilidad: contraste, tamaño de texto, navegación por teclado.
 * Compatible con WCAG 2.1 AA. ARIA roles declarados en index.html.
 */
(function () {
  'use strict';

  /* ── Preferencias persistentes (sessionStorage) ── */
  const PREFS_KEY = 'copaco_a11y';

  function loadPrefs() {
    try { return JSON.parse(sessionStorage.getItem(PREFS_KEY)) || {}; }
    catch (_) { return {}; }
  }
  function savePrefs(p) {
    try { sessionStorage.setItem(PREFS_KEY, JSON.stringify(p)); } catch (_) {}
  }

  /* ── Estado ── */
  const prefs = loadPrefs();
  let fontSize  = prefs.fontSize  || 1;   // escala relativa sobre :root
  let contrast  = prefs.contrast  || 'normal'; // 'normal' | 'high' | 'dark'

  /* ── Aplicar al cargar ── */
  applyFontSize();
  applyContrast();

  /* ── Escucha a los controles ── */
  document.addEventListener('DOMContentLoaded', function () {
    bindControls();
    trapFocusInPanel();
  });

  /* ─────────────────────────────────────────
     TAMAÑO DE TEXTO
  ───────────────────────────────────────── */
  function applyFontSize() {
    document.documentElement.style.setProperty('--a11y-scale', fontSize);
    // Actualiza estado visual de botones si el DOM ya existe
    const display = document.getElementById('a11y-font-display');
    if (display) {
      const pct = Math.round(fontSize * 100);
      display.textContent = pct + '%';
    }
  }

  function changeFontSize(delta) {
    fontSize = Math.min(1.5, Math.max(0.8, +(fontSize + delta).toFixed(2)));
    prefs.fontSize = fontSize;
    savePrefs(prefs);
    applyFontSize();
    announceToSR('Tamaño de texto: ' + Math.round(fontSize * 100) + '%');
  }

  /* ─────────────────────────────────────────
     CONTRASTE
  ───────────────────────────────────────── */
  const CONTRAST_MODES = ['normal', 'high', 'dark'];
  const CONTRAST_LABELS = { normal: 'Normal', high: 'Alto contraste', dark: 'Fondo oscuro' };

  function applyContrast() {
    CONTRAST_MODES.forEach(m => document.documentElement.classList.remove('contrast-' + m));
    document.documentElement.classList.add('contrast-' + contrast);
    const btn = document.getElementById('a11y-contrast-btn');
    if (btn) btn.setAttribute('aria-label', 'Contraste: ' + CONTRAST_LABELS[contrast] + ' — pulsa para cambiar');
  }

  function cycleContrast() {
    const idx = CONTRAST_MODES.indexOf(contrast);
    contrast = CONTRAST_MODES[(idx + 1) % CONTRAST_MODES.length];
    prefs.contrast = contrast;
    savePrefs(prefs);
    applyContrast();
    announceToSR('Contraste cambiado a: ' + CONTRAST_LABELS[contrast]);
  }

  /* ─────────────────────────────────────────
     LIVE REGION PARA SCREEN READERS
  ───────────────────────────────────────── */
  let srRegion;
  function announceToSR(msg) {
    if (!srRegion) {
      srRegion = document.createElement('div');
      srRegion.setAttribute('role', 'status');
      srRegion.setAttribute('aria-live', 'polite');
      srRegion.setAttribute('aria-atomic', 'true');
      srRegion.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;';
      document.body.appendChild(srRegion);
    }
    srRegion.textContent = '';
    setTimeout(function () { srRegion.textContent = msg; }, 50);
  }

  /* ─────────────────────────────────────────
     BIND CONTROLES
  ───────────────────────────────────────── */
  function bindControls() {
    const btnOpen    = document.getElementById('a11y-open-btn');
    const panel      = document.getElementById('a11y-panel');
    const btnClose   = document.getElementById('a11y-close-btn');
    const btnInc     = document.getElementById('a11y-font-inc');
    const btnDec     = document.getElementById('a11y-font-dec');
    const btnReset   = document.getElementById('a11y-font-reset');
    const btnContrast = document.getElementById('a11y-contrast-btn');

    if (btnOpen && panel) {
      btnOpen.addEventListener('click', function () { togglePanel(panel, btnOpen); });
      btnOpen.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePanel(panel, btnOpen); }
      });
    }
    if (btnClose && panel) {
      btnClose.addEventListener('click', function () { closePanel(panel, btnOpen); });
    }
    if (btnInc)  btnInc.addEventListener('click',  function () { changeFontSize(+0.1); });
    if (btnDec)  btnDec.addEventListener('click',  function () { changeFontSize(-0.1); });
    if (btnReset) btnReset.addEventListener('click', function () {
      fontSize = 1; prefs.fontSize = 1; savePrefs(prefs); applyFontSize();
      announceToSR('Tamaño de texto restablecido al 100%');
    });
    if (btnContrast) btnContrast.addEventListener('click', cycleContrast);

    // Cerrar con Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel && !panel.hidden) closePanel(panel, btnOpen);
    });
  }

  function togglePanel(panel, trigger) {
    if (panel.hidden) openPanel(panel, trigger);
    else closePanel(panel, trigger);
  }
  function openPanel(panel, trigger) {
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    // Foco al primer elemento interactivo dentro del panel
    const first = panel.querySelector('button,a,[tabindex]');
    if (first) setTimeout(function () { first.focus(); }, 50);
  }
  function closePanel(panel, trigger) {
    panel.hidden = true;
    if (trigger) { trigger.setAttribute('aria-expanded', 'false'); trigger.focus(); }
  }

  /* ─────────────────────────────────────────
     FOCUS TRAP DENTRO DEL PANEL
  ───────────────────────────────────────── */
  function trapFocusInPanel() {
    const panel = document.getElementById('a11y-panel');
    if (!panel) return;
    panel.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      const focusable = panel.querySelectorAll('button,a,[tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
})();
