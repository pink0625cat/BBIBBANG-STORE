
let products = [];
function load(){
  products = JSON.parse(localStorage.getItem('owner_products')||'[]');
  render();
  const cfg = JSON.parse(localStorage.getItem('emailjs_config')||'{}');
  document.getElementById('service_id').value = cfg.service_id||'';
  document.getElementById('template_id').value = cfg.template_id||'';
  document.getElementById('public_key').value = cfg.public_key||'';
  document.getElementById('to_email').value = cfg.to_email||'';
}
function save(){ localStorage.setItem('owner_products', JSON.stringify(products)); syncToFile(); render(); }
async function syncToFile(){
  const blob = new Blob([JSON.stringify(products, null, 2)], {type:'application/json'});
  const a = document.getElementById('download');
  a.href = URL.createObjectURL(blob); a.download = 'products.json'; a.style.display='inline-block';
  document.getElementById('hint').textContent = '이 파일로 저장소의 data/products.json을 교체 업로드하세요.';
}
function render(){
  const tbody = document.getElementById('tbody');
  tbody.innerHTML = products.map((p,i)=>`<tr>
    <td>${p.id}</td><td>${p.title}</td><td>${p.price}</td>
    <td>${(p.sizes||[]).join(',')}</td>
    <td>${p.payment_link? '연결됨':'-'}</td>
    <td><button class="btn" onclick="edit(${i})">수정</button>
        <button class="btn" onclick="del(${i})">삭제</button></td>
  </tr>`).join('');
}
function add(){
  const id = Date.now();
  products.push({id, title:'', price:0, description:'', sizes:[], images:[], payment_link:''});
  save(); edit(products.length-1);
}
function edit(i){
  const p = products[i];
  document.getElementById('eid').value = i;
  document.getElementById('title').value = p.title||'';
  document.getElementById('price').value = p.price||0;
  document.getElementById('desc').value = p.description||'';
  document.getElementById('sizes').value = (p.sizes||[]).join(',');
  document.getElementById('images').value = (p.images||[]).join(',');
  document.getElementById('plink').value = p.payment_link||'';
}
function saveForm(e){
  e.preventDefault();
  const i = +document.getElementById('eid').value;
  products[i].title = document.getElementById('title').value.trim();
  products[i].price = parseInt(document.getElementById('price').value||'0',10);
  products[i].description = document.getElementById('desc').value.trim();
  products[i].sizes = document.getElementById('sizes').value.split(',').map(s=>s.trim()).filter(Boolean);
  products[i].images = document.getElementById('images').value.split(',').map(s=>s.trim()).filter(Boolean);
  products[i].payment_link = document.getElementById('plink').value.trim();
  save();
}
function del(i){ products.splice(i,1); save(); }
function exportJSON(){ syncToFile(); }
function importJSON(e){
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{ products = JSON.parse(reader.result); save(); };
  reader.readAsText(file);
}
function saveEmailCfg(e){
  e.preventDefault();
  const cfg = {
    service_id: document.getElementById('service_id').value.trim(),
    template_id: document.getElementById('template_id').value.trim(),
    public_key: document.getElementById('public_key').value.trim(),
    to_email: document.getElementById('to_email').value.trim()
  };
  localStorage.setItem('emailjs_config', JSON.stringify(cfg));
  alert('EmailJS 설정 저장됨.');
}
window.addEventListener('DOMContentLoaded', load);
