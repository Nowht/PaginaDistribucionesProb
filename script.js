// Calcula log(n sobre k) para evitar desbordamientos al calcular combinaciones grandes.
export function logCombinaciones(n, k) {
    if (k < 0 || k > n) return Number.NEGATIVE_INFINITY;

    const limite = Math.min(k, n - k);
    let resultado = 0;

    for (let i = 1; i <= limite; i++) {
        resultado += Math.log(n - limite + i) - Math.log(i);
    }

    return resultado;
}

function validarCondicion(condicion, condicionesValidas) {
    if (!condicionesValidas.includes(condicion)) {
        throw new Error("La condición seleccionada no es válida.");
    }
}

// Calcula la probabilidad puntual P(X = x) de una distribución binomial.
function probabilidadPuntualBinomial(n, p, x) {
    if (p === 0) return x === 0 ? 1 : 0;
    if (p === 1) return x === n ? 1 : 0;

    const logProbabilidad =
        logCombinaciones(n, x) +
        x * Math.log(p) +
        (n - x) * Math.log1p(-p);

    return Math.exp(logProbabilidad);
}

/**
 * Calcula una probabilidad binomial y sus medidas descriptivas.
 *
 * @param {number} n Número entero de ensayos, mayor o igual que cero.
 * @param {number} p Probabilidad de éxito entre cero y uno.
 * @param {number} x Número entero de éxitos entre cero y n.
 * @param {string} condicion '=', '<=', '<', '>=' o '>'.
 * @returns {{probabilidad: number, porcentaje: string, media: string, varianza: string, desviacionEstandar: string}}
 */
export function calcularBinomial(n, p, x, condicion) {
    if (!Number.isInteger(n) || n < 0) {
        throw new Error("El número de ensayos (n) debe ser un entero no negativo.");
    }
    if (!Number.isFinite(p) || p < 0 || p > 1) {
        throw new Error("La probabilidad de éxito (p) debe estar entre 0 y 1.");
    }
    if (!Number.isInteger(x) || x < 0 || x > n) {
        throw new Error("El valor de x debe ser un entero entre 0 y n.");
    }

    validarCondicion(condicion, ["=", "<=", "<", ">=", ">"]);

    let probabilidadTotal = 0;

    switch (condicion) {
        case "=":
            probabilidadTotal = probabilidadPuntualBinomial(n, p, x);
            break;
        case "<=":
            for (let i = 0; i <= x; i++) {
                probabilidadTotal += probabilidadPuntualBinomial(n, p, i);
            }
            break;
        case "<":
            // P(X < x) incluye todos los valores desde cero hasta x - 1.
            for (let i = 0; i < x; i++) {
                probabilidadTotal += probabilidadPuntualBinomial(n, p, i);
            }
            break;
        case ">=":
            for (let i = x; i <= n; i++) {
                probabilidadTotal += probabilidadPuntualBinomial(n, p, i);
            }
            break;
        case ">":
            for (let i = x + 1; i <= n; i++) {
                probabilidadTotal += probabilidadPuntualBinomial(n, p, i);
            }
            break;
    }

    const media = n * p;
    const varianza = n * p * (1 - p);

    return {
        probabilidad: probabilidadTotal,
        porcentaje: `${(probabilidadTotal * 100).toFixed(4)}%`,
        media: media.toFixed(4),
        varianza: varianza.toFixed(4),
        desviacionEstandar: Math.sqrt(varianza).toFixed(4)
    };
}

/**
 * Calcula probabilidades y medidas descriptivas de una distribución hipergeométrica.
 *
 * @param {number} N Tamaño entero de la población, mayor que cero.
 * @param {number} K Número entero de éxitos en la población.
 * @param {number} n Tamaño entero de la muestra.
 * @param {number} x Número entero de éxitos buscados.
 * @param {string} condicion '=', '<=', '<', '>=' o '>'.
 * @returns {{probabilidad: string, media: number, varianza: number}}
 */
export function calcularHipergeometrica(N, K, n, x, condicion) {
    if (
        !Number.isInteger(N) ||
        !Number.isInteger(K) ||
        !Number.isInteger(n) ||
        !Number.isInteger(x) ||
        N <= 0 ||
        K < 0 ||
        K > N ||
        n < 0 ||
        n > N ||
        x < 0 ||
        x > n
    ) {
        throw new Error("Los parámetros hipergeométricos deben ser enteros válidos.");
    }

    validarCondicion(condicion, ["=", "<=", "<", ">=", ">"]);

    const minimo = Math.max(0, n - (N - K));
    const maximo = Math.min(n, K);
    const logTotal = logCombinaciones(N, n);
    const probabilidadPuntual = (k) => Math.exp(
        logCombinaciones(K, k) +
        logCombinaciones(N - K, n - k) -
        logTotal
    );
    let probabilidadTotal = 0;

    switch (condicion) {
        case "=":
            if (x >= minimo && x <= maximo) {
                probabilidadTotal = probabilidadPuntual(x);
            }
            break;
        case "<=":
            for (let i = minimo; i <= Math.min(x, maximo); i++) {
                probabilidadTotal += probabilidadPuntual(i);
            }
            break;
        case "<":
            for (let i = minimo; i < Math.min(x, maximo + 1); i++) {
                probabilidadTotal += probabilidadPuntual(i);
            }
            break;
        case ">=":
            for (let i = Math.max(x, minimo); i <= maximo; i++) {
                probabilidadTotal += probabilidadPuntual(i);
            }
            break;
        case ">":
            for (let i = Math.max(x + 1, minimo); i <= maximo; i++) {
                probabilidadTotal += probabilidadPuntual(i);
            }
            break;
    }

    const proporcionExitos = K / N;
    const media = n * proporcionExitos;
    // Para una población de un elemento, la varianza siempre es cero.
    const varianza = N === 1
        ? 0
        : n * proporcionExitos * (1 - proporcionExitos) * ((N - n) / (N - 1));

    return {
        probabilidad: probabilidadTotal.toFixed(4),
        media,
        varianza
    };
}

// Aproximación de la función de error usada para calcular la CDF normal.
function erf(valor) {
    const signo = valor >= 0 ? 1 : -1;
    const x = Math.abs(valor);
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    const t = 1 / (1 + p * x);
    const aproximacion =
        1 -
        (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) *
        t *
        Math.exp(-x * x);

    return signo * aproximacion;
}

/**
 * Calcula la probabilidad normal para la media muestral.
 *
 * @param {number} mu Media poblacional.
 * @param {number} sigma Desviación estándar poblacional, mayor que cero.
 * @param {number} n Tamaño entero de la muestra, mayor que cero.
 * @param {number} x Valor límite.
 * @param {string} condicion '<=' o '>='.
 * @returns {{zCalculada: string, probabilidad: string}}
 */
export function calcularNormal(mu, sigma, n, x, condicion) {
    if (
        !Number.isFinite(mu) ||
        !Number.isFinite(sigma) ||
        !Number.isFinite(x) ||
        !Number.isInteger(n) ||
        sigma <= 0 ||
        n <= 0
    ) {
        throw new Error("La media y el límite deben ser válidos; sigma y n deben ser mayores a 0.");
    }

    validarCondicion(condicion, ["<=", ">="]);

    const errorEstandar = sigma / Math.sqrt(n);
    const z = (x - mu) / errorEstandar;
    const acumulada = 0.5 * (1 + erf(z / Math.sqrt(2)));
    const probabilidad = condicion === "<=" ? acumulada : 1 - acumulada;

    return {
        zCalculada: z.toFixed(4),
        probabilidad: probabilidad.toFixed(4)
    };
}
