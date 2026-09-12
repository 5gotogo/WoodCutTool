import { estimatePanel } from './estimating-model.js';
const form = document.querySelector('#panel-estimate-form');
if (form) {
 const result = document.querySelector('[data-estimate-result]');
 const error = document.querySelector('[data-estimate-error]');
 const next = document.querySelector('[data-estimate-next]');
 let unit = form.elements.unit.value;
 const format = n => n.toLocaleString('en-US', {maximumFractionDigits:2});
 form.addEventListener('input', () => { result.hidden = true; next.hidden = true; error.textContent = ''; });
 form.elements.unit.addEventListener('change', () => {
  const target = form.elements.unit.value, factor = target === unit ? 1 : target === 'in' ? 1/25.4 : 25.4;
  for (const key of ['length','width','stockLength','stockWidth']) { const field = form.elements.namedItem(key); if(field.value !== '') field.value = Number((Number(field.value)*factor).toFixed(8)); }
  unit = target;
  document.querySelectorAll('[data-unit-label]').forEach(el => el.textContent = unit);
  result.hidden = true; next.hidden = true;
 });
 form.addEventListener('submit', event => {
  event.preventDefault(); error.textContent = ''; result.hidden = true; next.hidden = true;
  try {
   const input = Object.fromEntries(new FormData(form));
   for (const key of ['length','width','qty','stockLength','stockWidth','allowance','price','hours','rate']) input[key] = input[key] === '' ? NaN : Number(input[key]);
   input.rotate = form.elements.rotate.checked;
   const r = estimatePanel(input);
   const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:input.currency}).format(n);
   result.replaceChildren();
   const heading = document.createElement('h3'); heading.textContent = r.fits ? 'Your panel allowance' : 'This part does not fit the selected sheet'; heading.tabIndex = -1; result.append(heading);
   const lines = [`Net panel area: ${format(r.net)} m²`, `Area with allowance: ${format(r.allowed)} m²`];
   if(r.fits) lines.push(`Area-based minimum: ${r.sheets} whole sheets`, `Sheet material: ${money(r.material)}`, `Labor allowance: ${money(r.labor)}`, `Partial cost subtotal: ${money(r.total)}`);
   for(const line of lines) { const p=document.createElement('p'); p.textContent=line; result.append(p); }
   const note=document.createElement('p'); note.textContent=r.fits ? 'Budget allowance only. Kerf, trim, grain and packing may require more sheets. Confirm a layout before ordering. Prices are your inputs; this is not a complete quote.' : 'Choose suitable stock or revise the part. No purchase count or cost is recommended for an impossible fit.'; result.append(note);
   result.hidden=false; next.hidden=false; heading.focus();
   window.WCTConversion?.track('calculator_complete',{calculator:'panel-estimate',result_class:r.fits?'estimate':'no-fit'});
  } catch(e) { error.textContent=e.message; error.focus(); }
 });
}
