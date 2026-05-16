
document.addEventListener('DOMContentLoaded', function() {
      
    
const panelMeta = {
  dashboard:   { title: 'Dashboard',      sub: 'Welcome back, Admin' },
  members:     { title: 'Members',         sub: 'Manage member accounts' },
  trainers:    { title: 'Trainers',        sub: 'Manage trainer accounts' },
  schedule:    { title: 'Schedule',        sub: 'Set and manage class schedules' },
  memberships: { title: 'Memberships',     sub: 'View membership plans' },
  
};
 
const panelBtns = {
  members:  () => <button class="btn btn-primary" onclick="openMemberModal()"><i class="fa-solid fa-plus"></i> Add Member</button>,
  trainers: () => <button class="btn btn-primary" onclick="openTrainerModal()"><i class="fa-solid fa-plus"></i> Add Trainer</button>,
  schedule: () => <button class="btn btn-primary" onclick="openClassModal()"><i class="fa-solid fa-plus"></i> Add Class</button>,
};
 
function showPanel(id, el) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('pageTitle').textContent = panelMeta[id].title;
  document.getElementById('pageSubtitle').textContent = panelMeta[id].sub;
  document.getElementById('topbarActions').innerHTML = panelBtns[id] ? panelBtns[id]() : '';
}
 

const COLORS = [
  'linear-gradient(135deg,#2563eb,#7c3aed)',
  'linear-gradient(135deg,#059669,#2563eb)',
  'linear-gradient(135deg,#d97706,#dc2626)',
  'linear-gradient(135deg,#7c3aed,#ec4899)',
  'linear-gradient(135deg,#0891b2,#2563eb)',
  'linear-gradient(135deg,#dc2626,#d97706)',
];
let ci = 3;
const nextColor = () => { ci = (ci+1) % COLORS.length; return COLORS[ci]; };
 
function initials(name) { return name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2); }
 
function userCell(name, email, color) {
  const ini = initials(name);
  return <div class="user-cell"><div class="u-av" style="background:${color}">${ini}</div><div><div class="u-name">${name}</div><div class="u-email">${email}</div></div></div>;
}
 
function statusBadge(s) {
  const map = { Active:'badge-green', Pending:'badge-amber', Expired:'badge-red', 'On Leave':'badge-amber', Inactive:'badge-gray' };
  return <span class="badge ${map[s]||'badge-gray'}">${s}</span>;
}
 
function updateCount(id, tbody, singular, plural) {
  const c = document.getElementById(tbody).rows.length;
  document.getElementById(id).textContent = '${c} ${c===1?singular:plural}';
}
 
function filterTable(tbodyId, q) {
  const rows = document.getElementById(tbodyId).rows;
  q = q.toLowerCase();
  for (let r of rows) r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
}
 
function delRow(btn, countId, singular, pluralSuffix='s') {
  if (!confirm('Remove this ${singular}?')) return;
  const row = btn.closest('tr');
  row.style.transition='opacity .3s'; row.style.opacity='0';
  setTimeout(()=>{ row.remove(); refreshCount(countId, singular, pluralSuffix); toast('${singular.charAt(0).toUpperCase()+singular.slice(1)} removed.', 'red'); },300);
}
 
function refreshCount(countId, singular, pluralSuffix='s') {
  const tbodyMap = { memberCount:'membersTbody', trainerCount:'trainersTbody', classCount:'classesTbody' };
  const tbody = document.getElementById(tbodyMap[countId]);
  if (!tbody) return;
  const c = tbody.rows.length;
  document.getElementById(countId).textContent = '${c} ${c===1?singular:plural}';
}
 

let editMemberRow=null, editTrainerRow=null, editClassRow=null;
 
function openMemberModal(edit=false) {
  if (!edit) {
    editMemberRow=null;
    document.getElementById('memberModalTitle').textContent='Add Member';
    ['mFN','mLN','mEmail','mPhone'].forEach(i=>document.getElementById(i).value='');
    document.getElementById('mPlan').value='Basic';
    document.getElementById('mStatus').value='Active';
  }
  document.getElementById('memberModal').classList.add('open');
}
 
function openTrainerModal(edit=false) {
  if (!edit) {
    editTrainerRow=null;
    document.getElementById('trainerModalTitle').textContent='Add Trainer';
    ['tFN','tLN','tEmail','tSpec','tClasses'].forEach(i=>document.getElementById(i).value='');
    document.getElementById('tStatus').value='Active';
  }
  document.getElementById('trainerModal').classList.add('open');
}
 
function openClassModal(edit=false) {
  if (!edit) {
    editClassRow=null;
    document.getElementById('classModalTitle').textContent='Add Class';
    ['cName','cTime','cCap'].forEach(i=>document.getElementById(i).value='');
    ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(d=>document.getElementById('d'+d).checked=false);
  }
  document.getElementById('classModal').classList.add('open');
}
 
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
 

document.querySelectorAll('.modal-overlay').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('open');}));
 

function saveMember() {
  const fn=document.getElementById('mFN').value.trim();
  const ln=document.getElementById('mLN').value.trim();
  const email=document.getElementById('mEmail').value.trim();
  const phone=document.getElementById('mPhone').value.trim();
  const plan=document.getElementById('mPlan').value;
  const status=document.getElementById('mStatus').value;
  if(!fn||!ln||!email){toast('Fill in first name, last name, and email.','amber');return;}
  const name=fn+' '+ln;
 
  if (editMemberRow) {
    editMemberRow.cells[0].innerHTML=userCell(name,email,editMemberRow._col);
    editMemberRow.cells[1].textContent=phone||'—';
    editMemberRow.cells[2].textContent=plan;
    editMemberRow.cells[4].innerHTML=statusBadge(status);
    toast('Member updated!');
  } else {
    const col=nextColor();
    const tbody=document.getElementById('membersTbody');
    const tr=document.createElement('tr');
    tr._col=col;
    tr.innerHTML=`
      <td>${userCell(name,email,col)}</td>
      <td>${phone||'—'}</td><td>${plan}</td>
      <td>${new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</td>
      <td>${statusBadge(status)}</td>
      <td><div class="action-btns">
        <button class="btn btn-outline btn-sm" onclick="editMember(this)"><i class="fa-solid fa-pen"></i></button>
        <button class="btn btn-danger btn-sm" onclick="delRow(this,'memberCount','member')"><i class="fa-solid fa-trash"></i></button>
      </div></td>`;
    tbody.appendChild(tr);
    refreshCount('memberCount','member');
    toast('Member added!');
  }
  closeModal('memberModal');
}
 
function editMember(btn) {
  const row=btn.closest('tr');
  editMemberRow=row;
  editMemberRow._col=row.querySelector('.u-av').style.background;
  const parts=row.querySelector('.u-name').textContent.split(' ');
  document.getElementById('mFN').value=parts[0]||'';
  document.getElementById('mLN').value=parts.slice(1).join(' ')||'';
  document.getElementById('mEmail').value=row.querySelector('.u-email').textContent;
  const phone=row.cells[1].textContent.trim();
  document.getElementById('mPhone').value=phone==='—'?'':phone;
  document.getElementById('mPlan').value=row.cells[2].textContent.trim();
  document.getElementById('mStatus').value=row.cells[4].querySelector('.badge').textContent.trim();
  document.getElementById('memberModalTitle').textContent='Edit Member';
  window.openMemberModal(true);
}
 

function saveTrainer() {
  const fn=document.getElementById('tFN').value.trim();
  const ln=document.getElementById('tLN').value.trim();
  const email=document.getElementById('tEmail').value.trim();
  const spec=document.getElementById('tSpec').value.trim();
  const classes=document.getElementById('tClasses').value.trim()||'—';
  const status=document.getElementById('tStatus').value;
  if(!fn||!ln||!email){toast('Fill in name and email.','amber');return;}
  const name=fn+' '+ln;
 
  if (editTrainerRow) {
    editTrainerRow.cells[0].innerHTML=userCell(name,email,editTrainerRow._col);
    editTrainerRow.cells[1].textContent=spec||'—';
    editTrainerRow.cells[2].textContent=classes;
    editTrainerRow.cells[3].innerHTML=statusBadge(status);
    toast('Trainer updated!');
  } else {
    const col=nextColor();
    const tbody=document.getElementById('trainersTbody');
    const tr=document.createElement('tr');
    tr._col=col;
    tr.innerHTML=`
      <td>${userCell(name,email,col)}</td>
      <td>${spec||'—'}</td><td>${classes}</td>
      <td>${statusBadge(status)}</td>
      <td><div class="action-btns">
        <button class="btn btn-outline btn-sm" onclick="editTrainer(this)"><i class="fa-solid fa-pen"></i></button>
        <button class="btn btn-danger btn-sm" onclick="delRow(this,'trainerCount','trainer')"><i class="fa-solid fa-trash"></i></button>
      </div></td>`;
    tbody.appendChild(tr);
    refreshCount('trainerCount','trainer');
    toast('Trainer added!');
  }
  closeModal('trainerModal');
}
 
function editTrainer(btn) {
  const row=btn.closest('tr');
  editTrainerRow=row;
  editTrainerRow._col=row.querySelector('.u-av').style.background;
  const parts=row.querySelector('.u-name').textContent.split(' ');
  document.getElementById('tFN').value=parts[0]||'';
  document.getElementById('tLN').value=parts.slice(1).join(' ')||'';
  document.getElementById('tEmail').value=row.querySelector('.u-email').textContent;
  document.getElementById('tSpec').value=row.cells[1].textContent.trim();
  document.getElementById('tClasses').value=row.cells[2].textContent.trim()==='—'?'':row.cells[2].textContent.trim();
  document.getElementById('tStatus').value=row.cells[3].querySelector('.badge').textContent.trim();
  document.getElementById('trainerModalTitle').textContent='Edit Trainer';
  openTrainerModal(true);
}
 

function saveClass() {
  const name=document.getElementById('cName').value.trim();
  const trainer=document.getElementById('cTrainer').value;
  const time24=document.getElementById('cTime').value;
  const cap=document.getElementById('cCap').value.trim()||'—';
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].filter(d=>document.getElementById('d'+d).checked);
  if(!name||!time24||days.length===0){toast('Fill class name, time, and at least one day.','amber');return;}
 
  const [h,m]=time24.split(':');
  const hr=parseInt(h);
  const disp=`${hr>12?hr-12:(hr===0?12:hr)}:${m} ${hr>=12?'PM':'AM'}`;
 
  if (editClassRow) {
    editClassRow.cells[0].innerHTML=`<b>${name}</b>`;
    editClassRow.cells[1].textContent=trainer;
    editClassRow.cells[2].textContent=days.join(', ');
    editClassRow.cells[3].textContent=disp;
    editClassRow.cells[4].innerHTML=`<span class="badge badge-blue">${cap} slots</span>`;
    toast('Class updated!');
  } else {
    const tbody=document.getElementById('classesTbody');
    const tr=document.createElement('tr');
    tr.innerHTML=`
      <td><b>${name}</b></td><td>${trainer}</td><td>${days.join(', ')}</td><td>${disp}</td>
      <td><span class="badge badge-blue">${cap} slots</span></td>
      <td><div class="action-btns">
        <button class="btn btn-outline btn-sm" onclick="editClass(this)"><i class="fa-solid fa-pen"></i></button>
        <button class="btn btn-danger btn-sm" onclick="delRow(this,'classCount','class','es')"><i class="fa-solid fa-trash"></i></button>
      </div></td>`;
    tbody.appendChild(tr);
    refreshCount('classCount','class','es');
    toast('Class added!');
  }
  closeModal('classModal');
}
 
function editClass(btn) {
  const row=btn.closest('tr');
  editClassRow=row;
  document.getElementById('cName').value=row.cells[0].querySelector('b').textContent;
  document.getElementById('cTrainer').value=row.cells[1].textContent;
  ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(d=>document.getElementById('d'+d).checked=row.cells[2].textContent.includes(d));
  document.getElementById('cCap').value=row.cells[4].textContent.replace(' slots','').trim();
  document.getElementById('classModalTitle').textContent='Edit Class';
  openClassModal(true);
}


let toastT;
function toast(msg, type='blue') {
  const t=document.getElementById('toast');
  const map={blue:'#2563eb',green:'#059669',amber:'#d97706',red:'#dc2626'};
  t.style.borderLeftColor=map[type]||'#2563eb';
  t.textContent=msg;
  t.classList.add('show');
  clearTimeout(toastT);
  toastT=setTimeout(()=>t.classList.remove('show'),3000);
}

});