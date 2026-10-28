import {
    calcularBinomial,
    calcularHipergeometrica,
    calcularNormal
} from "./script.js";

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
                const resultado = calcularBinomial(
                    leerNumero("bin-n"),
                    leerNumero("bin-p"),
                    leerNumero("bin-x"),
                    document.getElementById("bin-cond").value
                );

                mostrarProbabilidad(resultado.probabilidad);
                break;
            }
            case "hipergeometrica": {
                const resultado = calcularHipergeometrica(
                    leerNumero("hip-N"),
                    leerNumero("hip-K"),
                    leerNumero("hip-n"),
                    leerNumero("hip-x"),
                    document.getElementById("hip-cond").value
                );

                mostrarProbabilidad(resultado.probabilidad);
                break;
            }
            case "normal": {
                const resultado = calcularNormal(
                    leerNumero("norm-mu"),
                    leerNumero("norm-sigma"),
                    leerNumero("norm-n"),
                    leerNumero("norm-x"),
                    document.getElementById("norm-cond").value
                );

                mostrarProbabilidad(resultado.probabilidad);
                break;
            }
            default:
                throw new Error("La distribución seleccionada no es válida.");
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});
