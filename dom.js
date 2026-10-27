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


        document.getElementById('r-1').textContent = res.probabilidad

    } catch (error) {
        alert("Error: " + error.message)
    }

})

const navLinks = document.querySelectorAll('#menu a')

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        const targetId = link.getAttribute('href').substring(1)

        document.querySelectorAll('.dist-form').forEach(form => {
            form.classList.add('d-none')
        })

        document.getElementById('titulo').textContent = targetId.at(0).toUpperCase() + targetId.slice(1)

        document.getElementById(`inputs-${targetId}`).classList.remove('d-none')
    })
})

const navLinksMobile = document.querySelectorAll('#menu-movil a')

navLinksMobile.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault()

        const targetId = link.getAttribute('href').substring(1)

        document.querySelectorAll('.dist-form').forEach(form => {
            form.classList.add('d-none')
        })

        document.getElementById('titulo').textContent = targetId.at(0).toUpperCase() + targetId.slice(1)

        document.getElementById(`inputs-${targetId}`).classList.remove('d-none')

    })
})