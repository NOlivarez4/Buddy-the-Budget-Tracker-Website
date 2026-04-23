// Base URL for all API requests
const API_URL = 'http://localhost:5959/api'

// ===== PROTECT THE PAGE =====
const token = localStorage.getItem('token')

if (!token) {
  window.location.href = 'index.html'
  throw new Error('No token')
}

// ===== AUTH HEADER HELPER =====
function authHeader() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

// ===== LOGOUT =====
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token')
  window.location.href = 'index.html'
})

// ===== GET ALL PRODUCTS =====
async function getProducts() {
  const res = await fetch(`${API_URL}/pricing`, {
    method: 'GET',
    headers: authHeader()
  })

  const products = await res.json()
  console.log('all products:', products)

  if (!res.ok) {
    document.getElementById('productsList').textContent = products.message || 'Failed to load products'
    return
  }

  renderProducts(products)
}

// ===== RENDER PRODUCTS TO THE PAGE =====
function renderProducts(products) {
  const container = document.getElementById('productsList')

  container.innerHTML = ''

  if (products.length === 0) {
    container.textContent = 'No products yet. Add one above!'
    return
  }

  products.forEach(product => {
    const div = document.createElement('div')
    div.innerHTML = `
      <p><strong>ID:</strong> ${product._id}</p>
      <p><strong>Membership:</strong> ${product.membership_name}</p>
      <p><strong>Price:</strong> ${product.membership_price_text}</p>
      <p><strong>Description:</strong> ${product.description}</p>
      <p><strong>Image:</strong> ${product.image}</p>
      <p><strong>Active:</strong> ${product.active}</p>
      <p><strong>Duration:</strong> ${product.duration}</p>
      <button onclick="startEdit(
        '${product._id}',
        '${product.membership_name.replace(/'/g, "\\'")}',
        '${product.membership_price_text.replace(/'/g, "\\'")}',
        '${product.description.replace(/'/g, "\\'")}',
        '${product.image.replace(/'/g, "\\'")}',
        '${product.active}',
        '${product.duration}'
      )">Edit</button>
      <button onclick="deleteProduct('${product._id}')">Delete</button>
      <hr>
    `
    container.appendChild(div)
  })
}

// ===== CREATE A PRODUCT =====
document.getElementById('createProductForm').addEventListener('submit', async (e) => {
  e.preventDefault()

  const id = Number(document.getElementById('id').value)
  const membership_name = document.getElementById('membership_name').value
  const membership_price_text = document.getElementById('membership_price_text').value
  const description = document.getElementById('description').value
  const image = document.getElementById('image').value
  const active = document.getElementById('active').value === 'true'
  const duration = Number(document.getElementById('duration').value)

  const res = await fetch(`${API_URL}/pricing`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({
      id,
      membership_name,
      membership_price_text,
      description,
      image,
      active,
      duration
    })
  })

  const data = await res.json()
  console.log('created product:', data)

  if (!res.ok) {
    document.getElementById('createMsg').style.color = 'red'
    document.getElementById('createMsg').textContent = data.message || 'Failed to create product'
    return
  }

  document.getElementById('createMsg').style.color = 'green'
  document.getElementById('createMsg').textContent = 'Product created!'
  document.getElementById('createProductForm').reset()
  await getProducts()
})

// ===== DELETE A PRODUCT =====
async function deleteProduct(id) {
  const confirmed = confirm('Are you sure you want to delete this product?')
  if (!confirmed) return

  const res = await fetch(`${API_URL}/pricing/${id}`, {
    method: 'DELETE',
    headers: authHeader()
  })

  const data = await res.json()

  if (!res.ok) {
    alert(data.message || 'Failed to delete product')
    return
  }

  getProducts()
}

// ===== SHOW EDIT FORM =====
function startEdit(id, membership_name, membership_price_text, description, image, active, duration) {
  document.getElementById('editSection').style.display = 'block'
  document.getElementById('editProductId').value = id
  document.getElementById('editMembershipName').value = membership_name
  document.getElementById('editMembershipPriceText').value = membership_price_text
  document.getElementById('editDescription').value = description
  document.getElementById('editImage').value = image
  document.getElementById('editActive').value = active
  document.getElementById('editDuration').value = duration
  document.getElementById('editMsg').textContent = ''
  document.getElementById('editSection').scrollIntoView()
}

// ===== CANCEL EDIT =====
document.getElementById('cancelEditBtn').addEventListener('click', () => {
  document.getElementById('editSection').style.display = 'none'
})

// ===== SAVE EDIT =====
document.getElementById('saveEditBtn').addEventListener('click', async () => {
  const id = document.getElementById('editProductId').value
  const membership_name = document.getElementById('editMembershipName').value
  const membership_price_text = document.getElementById('editMembershipPriceText').value
  const description = document.getElementById('editDescription').value
  const image = document.getElementById('editImage').value
  const active = document.getElementById('editActive').value === 'true'
  const duration = Number(document.getElementById('editDuration').value)

  const res = await fetch(`${API_URL}/pricing/${id}`, {
    method: 'PUT',
    headers: authHeader(),
    body: JSON.stringify({
      membership_name,
      membership_price_text,
      description,
      image,
      active,
      duration
    })
  })

  const data = await res.json()

  if (!res.ok) {
    document.getElementById('editMsg').style.color = 'red'
    document.getElementById('editMsg').textContent = data.message || 'Failed to update product'
    return
  }

  document.getElementById('editMsg').style.color = 'green'
  document.getElementById('editMsg').textContent = 'Product updated!'
  document.getElementById('editSection').style.display = 'none'
  getProducts()
})

// ===== LOAD PRODUCTS ON PAGE LOAD =====
getProducts()