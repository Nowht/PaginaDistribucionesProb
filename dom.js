import { calcularBinomial } from './script.js'

const btn = document.getElementById('btnCalcular')

const ensayos = document.getElementById('n_ensayos')

btn.addEventListener('click', () => {
    try {
        const n = parseInt(ensayos.value)
        const p = parseFloat(document.getElementById('p_exito').value)
        const x = parseInt(document.getElementById('n_exito').value)
        const condicion = document.getElementById('condicionBinomial').value

        const res = calcularBinomial(n, p, x, condicion)


        document.getElementById('resultado').textContent = "Probabilidad: " + res.probabilidad

    } catch (error) {
        alert("Error: " + error.message)
    }

})