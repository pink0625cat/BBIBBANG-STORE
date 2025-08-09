
async function render(){
  const products = await fetchProducts();
  const grid = document.getElementById('grid');
  if(!products.length){
    grid.innerHTML = `<div class="padded" style="grid-column:1/-1;color:#bdbdbd">아직 상품이 없습니다. <a href="owner.html" class="btn">관리자에서 상품 추가</a></div>`;
    return;
  }
  grid.innerHTML = products.map(p => card(p)).join('');
}
function card(p){
  return `<a class="card" href="product.html?id=${encodeURIComponent(p.id)}">
    <img class="thumb" src="${p.images?.[0]||''}" alt="${p.title}" onerror="this.src='https://via.placeholder.com/800x600?text=IMAGE'">
    <div class="info">
      <div class="title">${p.title}</div>
      <div class="price">${fmt.format(p.price)}</div>
    </div>
  </a>`;
}
window.addEventListener('DOMContentLoaded', render);
