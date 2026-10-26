import { calcularBinomial } from './script.js'

const btn = document.getElementById('btnCalcular')

const ensayos = document.getElementById('bin-n')

btn.addEventListener('click', () => {
    try {
        const n = parseInt(ensayos.value)
        const p = parseFloat(document.getElementById('bin-p').value)
        const x = parseInt(document.getElementById('bin-x').value)
        const condicion = document.getElementById('bin-cond').value

        const res = calcularBinomial(n, p, x, condicion)


        document.getElementById('resultado').textContent = "Probabilidad: " + res.probabilidad

    } catch (error) {
        alert("Error: " + error.message)
    }

})