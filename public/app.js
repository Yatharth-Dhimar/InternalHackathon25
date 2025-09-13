// Frontend logic: demo auth (localStorage), dynamic forms and calling backend /api/suggest
const $ = id => document.getElementById(id);

// navigation
$('nav-login')?.addEventListener('click', ()=> openAuth('login'));
$('nav-register')?.addEventListener('click', ()=> openAuth('register'));
$('startRegister')?.addEventListener('click', ()=> openAuth('register'));
$('startLogin')?.addEventListener('click', ()=> openAuth('login'));

let currentAuthMode = 'register';
function openAuth(mode){ currentAuthMode = mode; $('authTitle').innerText = mode === 'register' ? 'Register' : 'Login';
  $('auth').classList.remove('hidden'); $('landing').classList.add('hidden'); $('dashboard').classList.add('hidden');
}

$('authCancel').addEventListener('click', ()=>{ $('auth').classList.add('hidden'); $('landing').classList.remove('hidden'); });

$('authForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = $('name').value.trim(); const email = $('email').value.trim(); const pass = $('password').value;
  if(currentAuthMode === 'register'){
    const user = {name,email,stage: $('eduStage').value};
    localStorage.setItem('ai_user', JSON.stringify(user));
    toast('Registered (demo).');
    openDashboard();
  } else {
    const stored = JSON.parse(localStorage.getItem('ai_user')||'null');
    if(stored && stored.email === email){
      toast('Login success (demo)'); openDashboard();
    } else {
      toast('No local user found — register first', true);
    }
  }
});

function openDashboard(){
  $('auth').classList.add('hidden'); $('landing').classList.add('hidden');
  $('dashboard').classList.remove('hidden'); $('result').classList?.add('hidden');
  const u = JSON.parse(localStorage.getItem('ai_user')||'{}');
  $('userBadge').innerText = u.name ? u.name : 'Guest';
  renderSaved();
}

$('logout').addEventListener('click', ()=>{ localStorage.removeItem('ai_user'); toast('Logged out'); $('dashboard').classList.add('hidden'); $('landing').classList.remove('hidden'); });

// flows
$('goScholarship').addEventListener('click', ()=> startFlow('scholarship'));
$('goCareer').addEventListener('click', ()=> startFlow('career'));
$('goJob').addEventListener('click', ()=> startFlow('job'));

$('flowBack').addEventListener('click', ()=>{ $('flow').classList.add('hidden'); $('dashboard').classList.remove('hidden'); });
$('resultBack').addEventListener('click', ()=>{ $('result').classList.add('hidden'); $('dashboard').classList.remove('hidden'); });
$('newQuery').addEventListener('click', ()=>{ $('result').classList.add('hidden'); startFlow(window._lastFlowType); });
$('saveResult').addEventListener('click', saveCurrentResult);

function startFlow(type){
  window._lastFlowType = type;
  $('dashboard').classList.add('hidden'); $('flow').classList.remove('hidden');
  $('flowTitle').innerText = type === 'scholarship' ? 'Scholarship Guidance' : type === 'career' ? 'Career & Stream Guidance' : 'Jobs & Skill Suggestions';
  const f = $('flowFields'); f.innerHTML = '';
  if(type === 'scholarship'){
    f.innerHTML = `
      <label>Current Class
        <select id="f_class"><option value="10">10th</option><option value="12">12th</option></select>
      </label>
      <label>Marks / Percentage<input id="f_marks" required></label>
      <label>Preferred Field<input id="f_field" placeholder="Science / Commerce / Arts"></label>
      <label>State / Category (optional)<input id="f_state" placeholder="e.g. Gujarat, General"></label>
    `;
  }
  if(type === 'career'){
    f.innerHTML = `
      <label>Examined Class
        <select id="f_class"><option value="10">10th</option><option value="12">12th</option></select>
      </label>
      <label>Favourite Subjects<input id="f_subjects" placeholder="e.g. Maths, Biology"></label>
      <label>Hobbies / Strengths<input id="f_strengths" placeholder="e.g. coding, drawing"></label>
    `;
  }
  if(type === 'job'){
    f.innerHTML = `
      <label>Degree<input id="f_degree" placeholder="e.g. B.Tech (CE)"></label>
      <label>Major Subjects<input id="f_major" placeholder="e.g. DS, OS"></label>
      <label>Interest Areas<input id="f_interest" placeholder="e.g. Web Dev, ML"></label>
    `;
  }
}

$('flowForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const type = window._lastFlowType;
  const payload = {};
  if(type === 'scholarship'){ payload.class = $('f_class').value; payload.marks = $('f_marks').value; payload.field = $('f_field').value; payload.state = $('f_state').value; }
  else if(type === 'career'){ payload.class = $('f_class').value; payload.subjects = $('f_subjects').value; payload.strengths = $('f_strengths').value; }
  else { payload.degree = $('f_degree').value; payload.major = $('f_major').value; payload.interest = $('f_interest').value; }

  $('submitFlow').disabled = true; $('submitFlow').innerText = 'Thinking...';
  try{
    const user = JSON.parse(localStorage.getItem('ai_user')||'{}');
    const res = await fetch('/api/suggest', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({type,payload,user,comment: $('userComment').value})
    });
    if(!res.ok) throw new Error('Server error');
    const data = await res.json();
    const text = data.text || 'No suggestion returned.';
    showResult(text);
  }catch(err){
    console.error(err);
    const fallback = localFallback(type,payload);
    showResult(fallback);
  }
  $('submitFlow').disabled = false; $('submitFlow').innerText = 'Get AI Suggestion';
});

function showResult(text){
  $('flow').classList.add('hidden'); $('result').classList.remove('hidden');
  $('resultContent').innerText = text;
  window._currentResult = {text,type:window._lastFlowType,date:new Date().toISOString()};
}

function saveCurrentResult(){
  const saved = JSON.parse(localStorage.getItem('saved_suggestions')||'[]');
  saved.unshift(window._currentResult);
  localStorage.setItem('saved_suggestions', JSON.stringify(saved));
  toast('Saved');
  renderSaved();
}

function renderSaved(){
  const list = JSON.parse(localStorage.getItem('saved_suggestions')||'[]');
  const container = $('savedList'); container.innerHTML = '';
  if(!list.length) { container.innerHTML = '<p class="muted">No saved suggestions yet.</p>'; return; }
  list.forEach((s)=>{
    const el = document.createElement('div'); el.className='mini-card'; el.style.marginBottom='8px';
    el.innerHTML = `<strong>${s.type}</strong><div class="muted small">${new Date(s.date).toLocaleString()}</div><pre style="white-space:pre-wrap;margin-top:8px">${s.text}</pre>`;
    container.appendChild(el);
  });
}

function toast(msg, isError){
  alert(msg);
}

function localFallback(type,payload){
  if(type === 'scholarship') return `Fallback suggestion: Based on class ${payload.class} and marks ${payload.marks}, check state and national scholarships. Document checklist: 10th/12th marksheet, income certificate, ID proof.`;
  if(type === 'career') return `Fallback career idea: With subjects ${payload.subjects}, consider streams aligned to them. Explore short-term courses to test interest.`;
  return `Fallback job tips: Build portfolio projects, internships, learn key skills related to ${payload.interest || 'your interest'}.`;
}

window.addEventListener('DOMContentLoaded', ()=>{
  const user = localStorage.getItem('ai_user'); if(user) openDashboard(); else { $('landing').classList.remove('hidden'); }
});