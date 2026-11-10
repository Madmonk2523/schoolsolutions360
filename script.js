(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  $('#year').textContent = new Date().getFullYear();
  const toggle = $('.nav-toggle'), nav = $('#navigation');
  const close = () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
  toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
  document.addEventListener('click', (e) => { if (!nav.contains(e.target) && !toggle.contains(e.target)) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  window.addEventListener('resize', () => { if (innerWidth > 850) close(); });
  window.addEventListener('pageshow', close);
  $('.print-button')?.addEventListener('click', () => window.print());
  const form = $('#quoteForm');
  if (!form) return;
  const status = $('#formStatus'), fileInput = $('#listFile'), area = $('#upload'), submit = $('.submit-button');
  let selectedFile = null, pending = false;
  const types = /\.(pdf|xlsx?|csv|docx?|txt|jpe?g|png)$/i;
  function selectFile(file) {
    $('.file-error').textContent = '';
    selectedFile = null;
    if (file && (!types.test(file.name) || file.size > 2 * 1024 * 1024 || !file.size)) {
      $('.file-error').textContent = 'Choose a supported, non-empty file no larger than 2 MB.';
      fileInput.value = '';
    } else selectedFile = file || null;
    $('.file-details').hidden = !selectedFile;
    $('#fileName').textContent = selectedFile ? `${selectedFile.name} (${Math.ceil(selectedFile.size / 1024)} KB)` : '';
  }
  fileInput.addEventListener('change', () => selectFile(fileInput.files[0]));
  $('#removeFile').addEventListener('click', () => { fileInput.value = ''; selectFile(null); fileInput.focus(); });
  ['dragenter', 'dragover'].forEach(name => area.addEventListener(name, e => { e.preventDefault(); area.classList.add('dragging'); }));
  ['dragleave', 'drop'].forEach(name => area.addEventListener(name, e => { e.preventDefault(); area.classList.remove('dragging'); }));
  area.addEventListener('drop', e => { fileInput.value = ''; selectFile(e.dataTransfer.files[0]); });
  const need = new URLSearchParams(location.search).get('need');
  if ([...form.elements.needs.options].some(o => o.value === need)) form.elements.needs.value = need;
  const labels = { name:'Name', organization:'Organization', email:'Email', phone:'Phone', needs:'Needs', quantity:'Quantity / student count', timeline:'Timeline', notes:'Notes' };
  function updateEmail() {
    const data = Object.fromEntries(Object.keys(labels).map(key => [key, form.elements[key].value.trim()]));
    const body = Object.entries(labels).map(([key, label]) => `${label}: ${data[key]}`).join('\n') + (selectedFile ? `\n\nPlease attach: ${selectedFile.name}` : '');
    $('#emailDraft').href = `mailto:quotes@schoolsolutions360.com?subject=${encodeURIComponent('Quote request: ' + (data.organization || 'School resources'))}&body=${encodeURIComponent(body)}`;
    return data;
  }
  form.addEventListener('input', updateEmail);
  fileInput.addEventListener('change', updateEmail);
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (pending || !form.reportValidity()) return;
    if ($('.file-error').textContent) { fileInput.focus(); return; }
    pending = true; submit.disabled = true; submit.textContent = 'Sending request…'; status.className = 'form-status'; status.textContent = 'Sending your request. Please keep this page open.';
    const payload = updateEmail();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      if (selectedFile) {
        const content = await new Promise((resolve,reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1]); reader.onerror = reject; reader.readAsDataURL(selectedFile); });
        payload.attachment = {filename:selectedFile.name, content};
      }
      const response = await fetch('/api/quote', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload), signal:controller.signal});
      const result = await response.json();
      if (!response.ok || !result.accepted) throw new Error(result.code === 'NOT_CONFIGURED' ? 'NOT_CONFIGURED' : 'DELIVERY_UNCONFIRMED');
      status.className = 'form-status success'; status.textContent = 'Your request was accepted for delivery. Our team will follow up using the contact details you provided.';
      $('#emailFallback').hidden = true;
      form.reset(); selectFile(null);
    } catch (err) {
      status.className = 'form-status error';
      status.textContent = err.message === 'NOT_CONFIGURED' ? 'Online submission is not connected yet. Nothing was sent. Your details are still here. Please email your request below.' : 'We could not confirm delivery. Your details are still here. You can email your request below; mention this attempt to help avoid duplicates.';
      updateEmail(); $('#emailFallback').hidden = false;
    } finally { clearTimeout(timeout); pending = false; submit.disabled = false; submit.innerHTML = 'Get my quote <span aria-hidden="true">↗</span>'; }
  });
})();
