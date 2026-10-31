import {
    calcularBinomial,
    calcularHipergeometrica,
    calcularNormal
} from "./script.js";

import { generarPuntosBinomial, generarPuntosHipergeometrica, generarPuntosNormal, renderizarGrafica } from "./grafica.js";

//Variables y funciones para manejar la interfaz de usuario
const botonCalcular = document.getElementById("btnCalcular");
const salidaProbabilidad = document.getElementById("r-1");
const nombresDistribuciones = {
    binomial: "Binomial",
    hipergeometrica: "Hipergeométrica",
    normal: "Normal"
};
let distribucionActual = "binomial";

// Función para mostrar la sección de la distribución seleccionada
function mostrarDistribucion(distribucion) {
    distribucionActual = distribucion;

    //Se ocultan todas las secciones de entrada y se muestra solo la correspondiente a la distribución seleccionada
    document.querySelectorAll(".dist-form").forEach((formulario) => {
        formulario.classList.toggle(
            "d-none",
            formulario.id !== `inputs-${distribucion}`
        );
    });

    document.getElementById("titulo").textContent =
        nombresDistribuciones[distribucion];
}

// Los menús de escritorio y móvil comparten el mismo comportamiento.
document.querySelectorAll("#menu a, #menu-movil a").forEach((enlace) => {
    enlace.addEventListener("click", (evento) => {
        evento.preventDefault();
        mostrarDistribucion(enlace.hash.slice(1));
    });
});

// lee el valor numérico de un input y lo devuelve como número
function leerNumero(id) {
    return document.getElementById(id).valueAsNumber;
}

// Muestra la probabilidad calculada en el elemento de salida
function mostrarProbabilidad(probabilidad) {
    salidaProbabilidad.textContent = Number(probabilidad).toFixed(4);
}

botonCalcular.addEventListener("click", () => {
    try {
        switch (distribucionActual) {
            case "binomial": {
                const x = leerNumero("bin-x");
                const condicion = document.getElementById("bin-cond").value;
                const resultado = calcularBinomial(
                    leerNumero("bin-n"),
                    leerNumero("bin-p"),
                    x,
                    condicion
                );

                mostrarProbabilidad(resultado.probabilidad);

                // 2. INVOCAR LA GENERACIÓN Y ACTUALIZACIÓN DE LA GRÁFICA
                const puntos = generarPuntosBinomial(
                    leerNumero("bin-n"),
                    leerNumero("bin-p")
                );
                renderizarGrafica(puntos.labels, puntos.data, 'bar', {
                    x,
                    condicion,
                    probabilidad: resultado.probabilidad
                });

                break;
            }
            case "hipergeometrica": {
                const x = leerNumero("hip-x");
                const condicion = document.getElementById("hip-cond").value;
                const resultado = calcularHipergeometrica(
                    leerNumero("hip-N"),
                    leerNumero("hip-K"),
                    leerNumero("hip-n"),
                    x,
                    condicion
                );

                mostrarProbabilidad(resultado.probabilidad);

                // Invocación de la generación y actualización de la gráfica para Hipergeométrica
                const puntosHiper = generarPuntosHipergeometrica(
                    leerNumero("hip-N"),
                    leerNumero("hip-K"),
                    leerNumero("hip-n")
                );
                renderizarGrafica(puntosHiper.labels, puntosHiper.data, 'bar', {
                    x,
                    condicion,
                    probabilidad: resultado.probabilidad
                });
                break;
            }
            case "normal": {
                const x = leerNumero("norm-x");
                const condicion = document.getElementById("norm-cond").value;
                const resultado = calcularNormal(
                    leerNumero("norm-mu"),
                    leerNumero("norm-sigma"),
                    leerNumero("norm-n"),
                    x,
                    condicion
                );

                mostrarProbabilidad(resultado.probabilidad);

                // Invocación de la generación y actualización de la gráfica para Normal
                const puntosNormal = generarPuntosNormal(
                    leerNumero("norm-mu"),
                    leerNumero("norm-sigma"),
                    leerNumero("norm-n")
                );
                renderizarGrafica(puntosNormal.labels, puntosNormal.data, 'line', {
                    x,
                    condicion,
                    probabilidad: resultado.probabilidad
                });
                break;
            }
            default:
                throw new Error("La distribución seleccionada no es válida.");
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});
