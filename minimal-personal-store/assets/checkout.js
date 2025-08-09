
function renderSummary(){
  const cart = loadCart();
  const tbody = document.getElementById('tbody');
  tbody.innerHTML = cart.map(i=>`
    <tr>
      <td>${i.title}${i.size?` / ${i.size}`:''} × ${i.qty}</td>
      <td style="text-align:right">${fmt.format(i.price*i.qty)}</td>
    </tr>
  `).join('');
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  document.getElementById('total').textContent = fmt.format(total);
}
function submitOrder(e){
  e.preventDefault();
  const form = new FormData(e.target);
  const order = Object.fromEntries(form.entries());
  order.cart = loadCart();
  order.created_at = new Date().toISOString();
  // For static demo, just create a JSON file client-side and show it
  const blob = new Blob([JSON.stringify(order,null,2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'order.json';
  a.click();
  alert('주문 정보가 생성되었습니다. (데모용 JSON 파일)');
  localStorage.removeItem('cart'); updateCartCount();
  location.href = 'index.html';
}
window.addEventListener('DOMContentLoaded', ()=>{
  renderSummary();
  document.getElementById('form').addEventListener('submit', submitOrder);
});
