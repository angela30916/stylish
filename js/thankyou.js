// Get order id from url
let url = window.location.search
let searchParams = new URLSearchParams(url)
let num = searchParams.get('number')

// Render number to span#number
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('number').textContent = num
})
