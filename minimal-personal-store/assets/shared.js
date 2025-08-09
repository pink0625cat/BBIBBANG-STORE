
const fmt = new Intl.NumberFormat('ko-KR', { style:'currency', currency:'KRW' });
function saveCart(cart){ localStorage.setItem('cart', JSON.stringify(cart)); }
function loadCart(){ return JSON.parse(localStorage.getItem('cart')||'[]'); }
function addToCart(item){
  const cart = loadCart();
  const idx = cart.findIndex(i => i.id===item.id && i.size===item.size);
  if(idx>=0){ cart[idx].qty += item.qty; } else { cart.push(item); }
  saveCart(cart); updateCartCount(); alert('장바구니에 담았습니다.');
}
function updateCartCount(){
  const cart = loadCart();
  const n = cart.reduce((s,i)=>s+i.qty,0);
  const el = document.getElementById('cart-count');
  if(el){ el.textContent = n; el.style.display = n>0 ? 'inline-flex' : 'none'; }
}
async function fetchProducts(){
  const res = await fetch('./data/products.json');
  return res.json();
}
window.addEventListener('DOMContentLoaded', updateCartCount);
