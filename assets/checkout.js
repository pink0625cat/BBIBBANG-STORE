
function getEmailConfig(){
  return JSON.parse(localStorage.getItem('emailjs_config')||'{}');
}
function renderSummary(){
  const cart = loadCart();
  const tbody = document.getElementById('tbody');
  tbody.innerHTML = cart.map(i=>`
    <tr><td>${i.title}${i.size?` / ${i.size}`:''} × ${i.qty}</td>
    <td style="text-align:right">${fmt.format(i.price*i.qty)}</td></tr>`).join('');
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  document.getElementById('total').textContent = fmt.format(total);
}
async function submitOrder(e){
  e.preventDefault();
  const form = new FormData(e.target);
  const order = Object.fromEntries(form.entries());
  order.cart = loadCart();
  order.total = order.cart.reduce((s,i)=>s+i.price*i.qty,0);
  order.created_at = new Date().toISOString();

  const cfg = getEmailConfig();
  if(cfg.service_id && cfg.template_id && cfg.public_key){
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js';
    s.onload = async () => {
      emailjs.init(cfg.public_key);
      try{
        await emailjs.send(cfg.service_id, cfg.template_id, {
          to_email: cfg.to_email || order.email,
          from_name: order.name,
          note: order.note || '',
          address: order.address,
          phone: order.phone,
          order_json: JSON.stringify(order, null, 2),
          total_krw: order.total
        });
        alert('주문이 접수되었습니다. (이메일 발송 완료)');
        localStorage.removeItem('cart'); updateCartCount();
        location.href = 'index.html';
      }catch(err){
        console.error(err); alert('이메일 전송 실패: EmailJS 설정을 확인하세요.');
      }
    };
    document.body.appendChild(s);
  } else {
    const blob = new Blob([JSON.stringify(order,null,2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'order.json'; a.click();
    alert('데모 모드: 주문서(JSON)가 다운로드되었습니다.');
    localStorage.removeItem('cart'); updateCartCount();
    location.href = 'index.html';
  }
}
window.addEventListener('DOMContentLoaded', ()=>{
  renderSummary();
  document.getElementById('form').addEventListener('submit', submitOrder);
});
