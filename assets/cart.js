
function renderCart(){
  const cart = loadCart();
  const tbody = document.getElementById('tbody');
  tbody.innerHTML = cart.map((i,idx)=>`
    <tr>
      <td><img src="${i.image||''}" alt="" style="width:64px;height:64px;object-fit:cover;border-radius:8px;border:1px solid var(--line)"></td>
      <td>${i.title}${i.size?` / ${i.size}`:''}</td>
      <td>${fmt.format(i.price)}</td>
      <td><input type="number" min="1" value="${i.qty}" data-idx="${idx}" style="width:64px" class="input qty"></td>
      <td>${fmt.format(i.price*i.qty)}</td>
      <td><button class="btn" data-remove="${idx}">삭제</button></td>
    </tr>`).join('');
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  document.getElementById('total').textContent = fmt.format(total);
  document.getElementById('checkoutBtn').disabled = cart.length===0;

  document.querySelectorAll('.qty').forEach(inp=>{
    inp.addEventListener('change', e=>{
      const cart = loadCart();
      const i = parseInt(e.target.dataset.idx,10);
      let v = parseInt(e.target.value,10); if(!v||v<1)v=1;
      cart[i].qty = v; saveCart(cart); renderCart(); updateCartCount();
    });
  });
  document.querySelectorAll('[data-remove]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const i = parseInt(e.target.dataset.remove,10);
      const cart = loadCart();
      cart.splice(i,1); saveCart(cart); renderCart(); updateCartCount();
    });
  });
}
window.addEventListener('DOMContentLoaded', renderCart);
