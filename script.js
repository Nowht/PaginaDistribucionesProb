// Metodo para calcular el factorial
function factorial(n) {
    if (n < 0) return 0;
    if (n === 0 || n === 1) return 1;
    let resultado = 1;
    for (let i = 2; i <= n; i++) {
        resultado *= i;
    }
    return resultado;
}

// Metodo para calcular combinaciones
function combinaciones(n, x) {
  if (x < 0 || x > n) return 0;
  return factorial(n) / (factorial(x) * factorial(n - x));
}

// Metodo para calcular la probabilidad puntual P(X = x)
function probabilidadPuntualBinomial(n, p, x) {
  if (x < 0 || x > n) return 0;
  const comb = combinaciones(n, x);
  const exito = Math.pow(p, x);
  const fracaso = Math.pow(1 - p, n - x);
  return comb * exito * fracaso;
}

/**
 * Función Principal para calcular la probabilidad según la condición seleccionada.
 * 
 * @param {number} n - Número de ensayos (entero >= 0)
 * @param {number} p - Probabilidad de éxito (0 <= p <= 1)
 * @param {number} x - Número de éxitos deseados (0 <= x <= n)
 * @param {string} condicion - '=' | '<=' | '<' | '>=' | '>'
 * @returns {object} Objeto con resultado de probabilidad, media y varianza
 */
export function calcularBinomial(n ,p ,x , condicion){
    if(n < 0 || !Number.isInteger(n)){
        throw new Error("El numero de ensayos (n) debe de ser un entero positivo.")
    }
    if(p < 0 || p > 1){
        throw new Error("La probabilidad de exito (p) debe de estar entre 0 y 1.")
    }
    if(x < 0 || x > n || !Number.isInteger(x)){
        throw new Error("El valor de x debe ser un entero 0 y n.")
    }

    let probabilidadTotal = 0;

    switch(condicion){
        case "=":
            probabilidadTotal = probabilidadPuntualBinomial(n, p, x) 
            break
        case "<=":
            for(let i = 0; i <= x; i++){
                probabilidadTotal += probabilidadPuntualBinomial(n, p, i)
            }
            break
        case "<":
            for(let i = 1; i < x; i++){
                probabilidadTotal += probabilidadPuntualBinomial(n, p, i)
            }
            break
        case ">=":
            for(let i = x; i <= n; i++){
                probabilidadTotal += probabilidadPuntualBinomial(n, p, i)
            }
            break
        case ">":
            for(let i = x + 1; i <= n; i++){
                probabilidadTotal += probabilidadPuntualBinomial(n, p, i)
            }
            break
        default:
            throw new Error("Condicion invalida")
    }

    const media = n * p
    const varianza = n * p * (1-p)
    const desviacionEstandar = Math.sqrt(varianza)

    return{
        probabilidad: probabilidadTotal,
        porcentaje: (probabilidadTotal * 1000).toFixed(4) + "%",
        media: media.toFixed(4),
        varianza: varianza.toFixed(4),
        desviacionEstandar: desviacionEstandar.toFixed(4)

    }

}
