
async function render(){
  const products = await fetchProducts();
  const grid = document.getElementById('grid');
  grid.innerHTML = products.map(p => card(p)).join('');
}
function card(p){
  return `<a class="card" href="product.html?id=${encodeURIComponent(p.id)}">
    <img src="${p.images[0]}" alt="${p.title}" onerror="this.src='https://via.placeholder.com/800x600?text=PRODUCT'">
    <div class="info">
      <div class="title">${p.title}</div>
      <div class="price">${fmt.format(p.price)}</div>
    </div>
  </a>`;
}
window.addEventListener('DOMContentLoaded', render);
