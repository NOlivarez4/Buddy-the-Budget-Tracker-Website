// Base URL for all API requests
// In production, change this to your live domain e.g. 'https://yoursite.com/api'
const API_URL = 'https://buddy-the-budget-tracker-website-2.onrender.com/api' // make sure to change this later

const registerForm = document.getElementById('registerForm')
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {

    e.preventDefault()

    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // tell the server we are sending JSON
        body: JSON.stringify({ name, email, password })  // convert JS object to a JSON string
      })

      const data = await res.json()

      if (!res.ok) {
        document.getElementById('errorMsg').textContent = data.message || 'Registration failed'
        return
      }

      document.getElementById('successMsg').textContent = 'Registered! Redirecting to login...'
      setTimeout(() => window.location.href = 'index.html', 1500)

    } catch (err) {
      document.getElementById('errorMsg').textContent = 'Could not connect to server'
    }
  })
}
const loginForm = document.getElementById('loginForm')
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        document.getElementById('errorMsg').textContent = data.message || 'Login failed'
        return
      }
      localStorage.setItem('token', data.token)

      window.location.href = 'dashboard.html'

    } catch (err) {
      document.getElementById('errorMsg').textContent = 'Could not connect to server'
    }
  })
}