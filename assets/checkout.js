
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

// ❶ EmailJS ID 세팅
const CUSTOMER_TEMPLATE_ID = 'template_customer'; // 고객용 템플릿
const OWNER_TEMPLATE_ID    = 'template_owner';    // 사장님용 템플릿
const SERVICE_ID           = 'bbangibbi';         // 서비스 ID

// ❷ 공통 주문 데이터(JSON 직렬화)
const orderJson = JSON.stringify(order, null, 2);

// ❸ 고객용 + 사장님용 동시에 발송
await Promise.all([
  // 고객용 영수증 메일
  emailjs.send(SERVICE_ID, CUSTOMER_TEMPLATE_ID, {
    email: order.email,            // 고객용 {{email}}
    name: order.name,               // {{name}}
    order_json: orderJson,          // {{order_json}}
    total_krw: order.total           // {{total_krw}}
  }),

  // 사장님용 주문 알림 메일
  emailjs.send(SERVICE_ID, OWNER_TEMPLATE_ID, {
    to_email: cfg.to_email,         // 사장님용 {{to_email}}
    customer_email: order.email,    // {{customer_email}}
    name: order.name,               // {{name}}
    phone: order.phone,             // {{phone}}
    address: order.address,         // {{address}}
    note: order.note || '',         // {{note}}
    order_json: orderJson,          // {{order_json}}
    total_krw: order.total           // {{total_krw}}
  })
]);

alert('주문이 접수되었습니다. (고객/사장님 모두 이메일 발송 완료)');
localStorage.removeItem('cart'); updateCartCount();
location.href = 'index.html';

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
