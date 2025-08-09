
async function init(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const products = await fetchProducts();
  const p = products.find(x => String(x.id)===String(id));
  if(!p){ document.getElementById('title').textContent = '상품을 찾을 수 없습니다.'; return; }
  document.title = p.title + ' – Store';
  document.getElementById('title').textContent = p.title;
  document.getElementById('price').textContent = fmt.format(p.price);
  document.getElementById('desc').textContent = p.description||'';
  const img = document.getElementById('img'); img.src = p.images?.[0]||''; img.alt = p.title;
  const sizeSel = document.getElementById('size'); sizeSel.innerHTML = (p.sizes||[]).map(s=>`<option value="${s}">${s}</option>`).join('');

  document.getElementById('add').addEventListener('click', ()=>{
    const size = sizeSel.value || null;
    const qty = parseInt(document.getElementById('qty').value || '1',10);
    addToCart({ id:p.id, title:p.title, price:p.price, size, qty, image:p.images?.[0]||'' });
  });

  const stripeLink = p.payment_link || null;
  const payBtn = document.getElementById('paylink');
  if(stripeLink){ payBtn.href = stripeLink; payBtn.style.display='inline-block'; }
  else { payBtn.style.display='none'; }
}
window.addEventListener('DOMContentLoaded', init);
