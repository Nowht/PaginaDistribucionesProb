import { logCombinaciones } from "./script.js";


let migrafica = null

export function generarPuntosBinomial(n, p) {
    const labels = [];
    const data = [];

    const puntual = (n, x) => {
        if (p === 0) return x === 0 ? 1 : 0;
        if (p === 1) return x === n ? 1 : 0;
        const logProb = logCombinaciones(n, x) + x * Math.log(p) + (n - x) * Math.log1p(-p);
        return Math.exp(logProb);
    }

    for (let i = 0; i <= n; i++) {
        labels.push(i);
        data.push(puntual(n, i));
    }

    return { labels, data };
}

// 2. Puntos para la Hipergeométrica (Histograma de barras)
export function generarPuntosHipergeometrica(N, K, n) {
    const labels = [];
    const data = [];
    const minimo = Math.max(0, n - (N - K));
    const maximo = Math.min(n, K);
    const logTotal = logCombinaciones(N, n);

    for (let i = minimo; i <= maximo; i++) {
        labels.push(i);
        const logPuntual = logCombinaciones(K, i) + logCombinaciones(N - K, n - i) - logTotal;
        data.push(Math.exp(logPuntual));
    }

    return { labels, data };
}

// 3. Puntos para la Normal (Campana de Gauss - Curva suave)
export function generarPuntosNormal(mu, sigma, n) {
    const errorEstandar = sigma / Math.sqrt(n);
    const labels = [];
    const data = [];

    // Rango desde -4 desviaciones hasta +4 desviaciones estándar alrededor de la media
    const minVal = mu - 4 * errorEstandar;
    const maxVal = mu + 4 * errorEstandar;
    const pasos = 60; // Cantidad de puntos para suavizar la curva
    const delta = (maxVal - minVal) / pasos;

    for (let i = 0; i <= pasos; i++) {
        const x = minVal + (i * delta);
        labels.push(x);

        // Función de Densidad de Probabilidad (PDF) de la Normal
        const exponente = -0.5 * Math.pow((x - mu) / errorEstandar, 2);
        const pdf = (1 / (errorEstandar * Math.sqrt(2 * Math.PI))) * Math.exp(exponente);
        data.push(pdf);
    }

    return { labels, data };
}

export function renderizarGrafica(labeles, datos, tipoGrafica = 'bar', resaltado) {
    const ctx = document.getElementById('miGrafica').getContext('2d');

    if (migrafica) {
        migrafica.destroy();
    }

    const cumpleCondicion = (valor) => {
        switch (resaltado.condicion) {
            case '=': return valor === resaltado.x;
            case '<=': return valor <= resaltado.x;
            case '<': return valor < resaltado.x;
            case '>=': return valor >= resaltado.x;
            case '>': return valor > resaltado.x;
            default: return false;
        }
    };
    const colorBase = 'rgba(54, 162, 235, 0.2)';
    const colorResaltado = 'rgba(255, 159, 64, 0.8)';
    const datasets = tipoGrafica === 'line'
        ? [
            {
                label: 'Área de probabilidad',
                data: labeles.map((label, indice) =>
                    cumpleCondicion(Number(label)) ? datos[indice] : null
                ),
                backgroundColor: 'rgba(255, 159, 64, 0.35)',
                borderColor: 'transparent',
                pointRadius: 0,
                fill: 'origin'
            },
            {
                label: 'Densidad de probabilidad',
                data: datos,
                backgroundColor: colorBase,
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.25,
                fill: false
            }
        ]
        : [{
            label: 'Probabilidad puntual',
            data: datos,
            backgroundColor: labeles.map((label) =>
                cumpleCondicion(Number(label)) ? colorResaltado : colorBase
            ),
            borderColor: labeles.map((label) =>
                cumpleCondicion(Number(label)) ? 'rgba(230, 126, 34, 1)' : 'rgba(54, 162, 235, 1)'
            ),
            borderWidth: 1
        }];

    migrafica = new Chart(ctx, {
        type: tipoGrafica,
        data: {
            labels: labeles,
            datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                subtitle: {
                    display: true,
                    text: `Naranja: P(X ${resaltado.condicion} ${resaltado.x}) = ${Number(resaltado.probabilidad).toFixed(4)}`
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    ticks: {
                        color: 'rgba(0, 0, 0, 0.7)',
                        callback: tipoGrafica === 'line'
                            ? (valor) => Number(labeles[valor]).toFixed(2)
                            : undefined
                    }
                },
                y: { grid: { color: 'rgba(0, 0, 0, 0.1)' }, ticks: { color: 'rgba(0, 0, 0, 0.7)' } }
            }
        }
    });

}