/* =====================================================
   M4-S26 · Diagnóstico técnico-económico de integración IA
   Lógica de la aplicación
   No se almacenan datos en servidor: todo se procesa en el navegador.
   ===================================================== */

(function () {
  'use strict';

  // -------- Datos del caso (preconfigurados) --------
  const DATOS_CASO = {
    ticketsMensuales: 12000,
    consultasPorTicket: 2,
    tokensEntrada: 2500,
    tokensSalida: 600,
    tiempoActual: 12,
    tiempoEsperado: 8,
    costeHora: 22,
    usuariosSoporte: 35
  };

  // -------- Filas iniciales de la matriz comparativa --------
  const CRITERIOS_MATRIZ = [
    'Coste inicial',
    'Coste al escalar',
    'Facilidad de implantación',
    'Protección de datos',
    'Trazabilidad',
    'Latencia',
    'Dependencia del proveedor',
    'Control técnico'
  ];

  // -------- Filas iniciales del Mini-RAID --------
  const RAID_FILAS = [
    { tipo: 'Riesgo',      pregunta: '¿Qué podría salir mal?' },
    { tipo: 'Supuesto',    pregunta: '¿Qué estoy dando por cierto?' },
    { tipo: 'Incidencia',  pregunta: '¿Qué problema ya existe?' },
    { tipo: 'Dependencia', pregunta: '¿De qué sistema, persona o proveedor dependo?' }
  ];

  // ============================================================
  // FUNCIONES DE CÁLCULO (puras, fáciles de probar)
  // ============================================================
  function calcularConsultasMensuales(ticketsMensuales, consultasPorTicket) {
    return ticketsMensuales * consultasPorTicket;
  }

  function calcularTokensEntrada(consultasMensuales, tokensEntradaPorConsulta) {
    return consultasMensuales * tokensEntradaPorConsulta;
  }

  function calcularTokensSalida(consultasMensuales, tokensSalidaPorConsulta) {
    return consultasMensuales * tokensSalidaPorConsulta;
  }

  function calcularAhorroBruto(ticketsMensuales, tiempoActual, tiempoEsperado, costeHora) {
    const tiempoAhorradoPorTicket = tiempoActual - tiempoEsperado; // minutos
    const minutosAhorrados = ticketsMensuales * tiempoAhorradoPorTicket;
    const horasAhorradas = minutosAhorrados / 60;
    const ahorroBruto = horasAhorradas * costeHora;
    return {
      tiempoAhorradoPorTicket: tiempoAhorradoPorTicket,
      minutosAhorrados: minutosAhorrados,
      horasAhorradas: horasAhorradas,
      ahorroBruto: ahorroBruto
    };
  }

  // ============================================================
  // FORMATO
  // ============================================================
  const formatNum = (n, dec) => {
    if (typeof n !== 'number' || !isFinite(n)) return '—';
    return n.toLocaleString('es-ES', {
      minimumFractionDigits: dec || 0,
      maximumFractionDigits: dec || 0
    });
  };
  const formatEuro = (n) => {
    if (typeof n !== 'number' || !isFinite(n)) return '—';
    return n.toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2
    });
  };

  // ============================================================
  // VALIDACIÓN
  // ============================================================
  function leerYValidar() {
    const ids = ['ticketsMensuales', 'consultasPorTicket', 'tokensEntrada',
                 'tokensSalida', 'tiempoActual', 'tiempoEsperado', 'costeHora'];
    const errores = [];
    const datos = {};

    ids.forEach(id => {
      const el = document.getElementById(id);
      el.classList.remove('error');
      const v = el.value.trim();
      if (v === '') {
        errores.push(`El campo "${el.previousElementSibling.textContent}" está vacío.`);
        el.classList.add('error');
        return;
      }
      const num = Number(v);
      if (isNaN(num)) {
        errores.push(`El campo "${el.previousElementSibling.textContent}" no es un número válido.`);
        el.classList.add('error');
        return;
      }
      if (num < 0) {
        errores.push(`El campo "${el.previousElementSibling.textContent}" no puede ser negativo.`);
        el.classList.add('error');
        return;
      }
      datos[id] = num;
    });

    // Regla específica: tiempo esperado no debe superar tiempo actual
    if (datos.tiempoEsperado != null && datos.tiempoActual != null
        && datos.tiempoEsperado > datos.tiempoActual) {
      errores.push('El tiempo esperado con IA no puede ser mayor que el tiempo actual por ticket.');
      document.getElementById('tiempoEsperado').classList.add('error');
    }

    // Usuarios de soporte: opcional
    const us = document.getElementById('usuariosSoporte').value.trim();
    if (us !== '') {
      const n = Number(us);
      if (!isNaN(n) && n >= 0) datos.usuariosSoporte = n;
    }

    return { datos, errores };
  }

  function mostrarErrores(errores) {
    const cont = document.getElementById('mensajes-error');
    if (!errores.length) { cont.innerHTML = ''; return; }
    cont.innerHTML = '<strong>Revisa los siguientes puntos:</strong><ul>'
      + errores.map(e => `<li>${e}</li>`).join('') + '</ul>';
  }

  // ============================================================
  // RENDER DE RESULTADOS
  // ============================================================
  let ULTIMOS_RESULTADOS = null;

  function calcularYMostrar() {
    const { datos, errores } = leerYValidar();
    mostrarErrores(errores);
    if (errores.length) {
      document.getElementById('mensajes-error').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const consultas = calcularConsultasMensuales(datos.ticketsMensuales, datos.consultasPorTicket);
    const tokensIn  = calcularTokensEntrada(consultas, datos.tokensEntrada);
    const tokensOut = calcularTokensSalida(consultas, datos.tokensSalida);
    const ahorro    = calcularAhorroBruto(datos.ticketsMensuales, datos.tiempoActual,
                                          datos.tiempoEsperado, datos.costeHora);

    document.getElementById('rConsultas').textContent     = formatNum(consultas);
    document.getElementById('rTokensEntrada').textContent = formatNum(tokensIn);
    document.getElementById('rTokensSalida').textContent  = formatNum(tokensOut);
    document.getElementById('rTiempoTicket').textContent  = formatNum(ahorro.tiempoAhorradoPorTicket, 1) + ' min';
    document.getElementById('rMinutos').textContent       = formatNum(ahorro.minutosAhorrados) + ' min';
    document.getElementById('rHoras').textContent         = formatNum(ahorro.horasAhorradas, 1) + ' h';
    document.getElementById('rAhorro').textContent        = formatEuro(ahorro.ahorroBruto);

    ULTIMOS_RESULTADOS = {
      datos: datos,
      consultas: consultas,
      tokensIn: tokensIn,
      tokensOut: tokensOut,
      ahorro: ahorro
    };

    document.getElementById('resultados').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ============================================================
  // CARGA DE VALORES DEL CASO
  // ============================================================
  function cargarValoresCaso() {
    Object.keys(DATOS_CASO).forEach(k => {
      const el = document.getElementById(k);
      if (el) el.value = DATOS_CASO[k];
    });
    mostrarErrores([]);
  }

  function limpiarFormulario() {
    document.getElementById('form-datos').reset();
    document.querySelectorAll('#form-datos input').forEach(i => i.classList.remove('error'));
    mostrarErrores([]);
    ['rConsultas','rTokensEntrada','rTokensSalida','rTiempoTicket','rMinutos','rHoras','rAhorro']
      .forEach(id => { document.getElementById(id).textContent = '—'; });
    ULTIMOS_RESULTADOS = null;
  }

  // ============================================================
  // CONSTRUIR MATRIZ COMPARATIVA EDITABLE
  // ============================================================
  function construirMatriz() {
    const tbody = document.querySelector('#tabla-matriz tbody');
    tbody.innerHTML = '';
    CRITERIOS_MATRIZ.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${c}</td>
        <td contenteditable="true" data-col="apiExt"></td>
        <td contenteditable="true" data-col="cloud"></td>
        <td contenteditable="true" data-col="mejor"></td>
        <td contenteditable="true" data-col="motivo"></td>`;
      tbody.appendChild(tr);
    });
  }

  function leerMatriz() {
    const filas = [];
    document.querySelectorAll('#tabla-matriz tbody tr').forEach(tr => {
      const cels = tr.querySelectorAll('td');
      filas.push({
        criterio: cels[0].textContent.trim(),
        apiExt:   cels[1].textContent.trim(),
        cloud:    cels[2].textContent.trim(),
        mejor:    cels[3].textContent.trim(),
        motivo:   cels[4].textContent.trim()
      });
    });
    return filas;
  }

  // ============================================================
  // CONSTRUIR MINI-RAID EDITABLE
  // ============================================================
  function construirRAID() {
    const tbody = document.querySelector('#tabla-raid tbody');
    tbody.innerHTML = '';
    RAID_FILAS.forEach(f => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${f.tipo}</strong></td>
        <td>${f.pregunta}</td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>`;
      tbody.appendChild(tr);
    });
  }

  function leerRAID() {
    const filas = [];
    document.querySelectorAll('#tabla-raid tbody tr').forEach(tr => {
      const cels = tr.querySelectorAll('td');
      filas.push({
        tipo:      cels[0].textContent.trim(),
        elemento:  cels[2].textContent.trim(),
        impacto:   cels[3].textContent.trim(),
        accion:    cels[4].textContent.trim()
      });
    });
    return filas;
  }

  // ============================================================
  // GENERAR RESUMEN PARA ENTREGA
  // ============================================================
  function generarResumen() {
    const lineas = [];
    lineas.push('========================================================');
    lineas.push('M4-S26 · DIAGNÓSTICO TÉCNICO-ECONÓMICO DE INTEGRACIÓN IA');
    lineas.push('Resumen generado el ' + new Date().toLocaleString('es-ES'));
    lineas.push('========================================================');
    lineas.push('');
    lineas.push('1. DATOS DEL CASO');
    lineas.push('-----------------');

    if (ULTIMOS_RESULTADOS) {
      const d = ULTIMOS_RESULTADOS.datos;
      lineas.push('  · Tickets mensuales:            ' + formatNum(d.ticketsMensuales));
      lineas.push('  · Consultas IA por ticket:      ' + formatNum(d.consultasPorTicket));
      lineas.push('  · Tokens de entrada/consulta:   ' + formatNum(d.tokensEntrada));
      lineas.push('  · Tokens de salida/consulta:    ' + formatNum(d.tokensSalida));
      lineas.push('  · Tiempo actual por ticket:     ' + formatNum(d.tiempoActual, 1) + ' min');
      lineas.push('  · Tiempo esperado con IA:       ' + formatNum(d.tiempoEsperado, 1) + ' min');
      lineas.push('  · Coste hora soporte:           ' + formatEuro(d.costeHora));
      if (d.usuariosSoporte != null)
        lineas.push('  · Usuarios de soporte:          ' + formatNum(d.usuariosSoporte));
    } else {
      lineas.push('  (Sin datos calculados aún. Pulsa "Calcular".)');
    }

    lineas.push('');
    lineas.push('2. RESULTADOS CALCULADOS');
    lineas.push('-------------------------');
    if (ULTIMOS_RESULTADOS) {
      const r = ULTIMOS_RESULTADOS;
      lineas.push('  · Consultas mensuales:          ' + formatNum(r.consultas));
      lineas.push('  · Tokens de entrada al mes:     ' + formatNum(r.tokensIn));
      lineas.push('  · Tokens de salida al mes:      ' + formatNum(r.tokensOut));
      lineas.push('  · Tiempo ahorrado por ticket:   ' + formatNum(r.ahorro.tiempoAhorradoPorTicket, 1) + ' min');
      lineas.push('  · Minutos ahorrados al mes:     ' + formatNum(r.ahorro.minutosAhorrados));
      lineas.push('  · Horas ahorradas al mes:       ' + formatNum(r.ahorro.horasAhorradas, 1) + ' h');
      lineas.push('  · AHORRO HUMANO BRUTO:          ' + formatEuro(r.ahorro.ahorroBruto));
      lineas.push('    (BRUTO: no descuenta coste IA, revisión, mantenimiento ni formación.)');
    } else {
      lineas.push('  (Sin resultados.)');
    }

    lineas.push('');
    lineas.push('3. MATRIZ COMPARATIVA (API externa vs. Cloud gestionado)');
    lineas.push('---------------------------------------------------------');
    leerMatriz().forEach(f => {
      const linea = '  · ' + f.criterio.padEnd(28) +
        ' | A: ' + (f.apiExt || '—') +
        ' | B: ' + (f.cloud || '—') +
        ' | Mejor: ' + (f.mejor || '—') +
        (f.motivo ? ' | Motivo: ' + f.motivo : '');
      lineas.push(linea);
    });

    lineas.push('');
    lineas.push('4. MINI-RAID');
    lineas.push('-------------');
    leerRAID().forEach(f => {
      lineas.push('  · ' + f.tipo + ':');
      lineas.push('      Elemento: ' + (f.elemento || '—'));
      lineas.push('      Impacto:  ' + (f.impacto || '—'));
      lineas.push('      Acción:   ' + (f.accion || '—'));
    });

    lineas.push('');
    lineas.push('5. DECISIÓN FINAL');
    lineas.push('------------------');
    const recSel = document.getElementById('dRecomendacion');
    const recTxt = recSel.options[recSel.selectedIndex] ? recSel.options[recSel.selectedIndex].text : '—';
    lineas.push('  · Recomendación:    ' + (recSel.value ? recTxt : '—'));
    lineas.push('  · Motivo principal: ' + (document.getElementById('dMotivo').value.trim() || '—'));
    lineas.push('  · Riesgo principal: ' + (document.getElementById('dRiesgo').value.trim() || '—'));
    lineas.push('  · Control:          ' + (document.getElementById('dControl').value.trim() || '—'));
    lineas.push('  · Métrica de éxito: ' + (document.getElementById('dMetrica').value.trim() || '—'));
    lineas.push('  · Trade-off:        ' + (document.getElementById('dTradeoff').value.trim() || '—'));

    lineas.push('');
    lineas.push('--');
    lineas.push('Aviso: este análisis usa cifras académicas. No representa precios reales.');
    lineas.push('No se han usado datos personales reales.');

    document.getElementById('resumen-texto').value = lineas.join('\n');
  }

  // ============================================================
  // COPIAR / DESCARGAR RESUMEN
  // ============================================================
  function copiarResumen() {
    const ta = document.getElementById('resumen-texto');
    const aviso = document.getElementById('aviso-copia');
    if (!ta.value) {
      aviso.style.color = 'var(--color-error)';
      aviso.textContent = 'Primero pulsa "Generar resumen".';
      return;
    }
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(ta.value).then(() => {
        aviso.style.color = 'var(--color-ok)';
        aviso.textContent = '✓ Resumen copiado al portapapeles.';
      }).catch(() => {
        aviso.style.color = ok ? 'var(--color-ok)' : 'var(--color-error)';
        aviso.textContent = ok ? '✓ Resumen copiado.' : 'No se pudo copiar; selecciona el texto manualmente.';
      });
    } else {
      aviso.style.color = ok ? 'var(--color-ok)' : 'var(--color-error)';
      aviso.textContent = ok ? '✓ Resumen copiado.' : 'No se pudo copiar; selecciona el texto manualmente.';
    }
    setTimeout(() => { aviso.textContent = ''; }, 4000);
  }

  function descargarResumen() {
    const txt = document.getElementById('resumen-texto').value;
    if (!txt) {
      const aviso = document.getElementById('aviso-copia');
      aviso.style.color = 'var(--color-error)';
      aviso.textContent = 'Primero pulsa "Generar resumen".';
      setTimeout(() => { aviso.textContent = ''; }, 4000);
      return;
    }
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'M4-S26_resumen_analisis.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ============================================================
  // INICIALIZACIÓN
  // ============================================================
  document.addEventListener('DOMContentLoaded', function () {
    construirMatriz();
    construirRAID();

    document.getElementById('btn-cargar').addEventListener('click', cargarValoresCaso);
    document.getElementById('btn-calcular').addEventListener('click', calcularYMostrar);
    document.getElementById('btn-limpiar').addEventListener('click', limpiarFormulario);
    document.getElementById('btn-generar').addEventListener('click', generarResumen);
    document.getElementById('btn-copiar').addEventListener('click', copiarResumen);
    document.getElementById('btn-descargar').addEventListener('click', descargarResumen);

    // Permitir calcular pulsando Enter en el formulario
    document.getElementById('form-datos').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        e.preventDefault();
        calcularYMostrar();
      }
    });
  });

  // Exponer funciones puras para pruebas manuales en consola
  window.M4S26 = {
    calcularConsultasMensuales,
    calcularTokensEntrada,
    calcularTokensSalida,
    calcularAhorroBruto
  };

})();
