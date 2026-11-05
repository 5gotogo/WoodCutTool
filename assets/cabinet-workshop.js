// Derived exclusively from the current cabinet model; no second project copy.
export function workshopPlan(model) {
  const c = model.config;
  const faceArea = model.parts.reduce((n,p)=>n+2*p.length*p.width/1e6,0);
  return {
    rows: model.groups.map(g=>[`${g.thickness} mm ${g.thickness===6?'back':'body'} sheet`,g.sheets.length,'sheets',`${c.sheetLength} × ${c.sheetWidth} mm; ${g.thickness===6?c.backPrice:c.price} USD each`]).concat([
      ['Front edge banding',Math.ceil(model.edge*1.15*10)/10,'m','15% allowance; choose width for actual panel thickness'],
      ['Finish',Math.ceil(faceArea*2/10*1.1*10)/10,'L','Both broad faces, 2 coats, assumed 10 m²/L/coat, 10% allowance; verify product coverage'],
      ['Shelf supports',c.shelves*c.bays*4,'pieces','4 per adjustable shelf; verify pin diameter, load rating and drilling pattern']
    ]),faceArea
  };
}
const esc = x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function shoppingCsv(model) {
  if(!model.valid) throw Error('Resolve design errors before exporting.');
  return [['Item','Quantity','Unit','Assumption'],...workshopPlan(model).rows].map(row=>row.map(x=>'"'+String(x).replaceAll('"','""')+'"').join(',')).join('\r\n');
}
export function workshopMarkup(model) {
  if(!model.valid) return '<p role="alert">Resolve the design errors above before preparing a shopping list or workshop pack.</p>';
  const plan=workshopPlan(model);
  return `<div class="cs-pack-summary"><strong>${model.parts.length} matched parts</strong><strong>${model.edge.toFixed(2)} m front edges</strong><strong>${plan.faceArea.toFixed(2)} m² broad faces</strong></div><h3>01 / Buy & prepare</h3><div class="cs-pack-table"><table><thead><tr><th>Item</th><th>Buy / allow</th><th>Planning assumption</th></tr></thead><tbody>${plan.rows.map(r=>`<tr><td>${esc(r[0])}</td><td>${r[1]} ${r[2]}</td><td>${esc(r[3])}</td></tr>`).join('')}</tbody></table></div><p>Sheet budget: USD ${model.cost.toFixed(2)}. Edging, finish, hardware, tax and delivery are additional. Finish estimate excludes narrow edges. Round quantities up to your supplier’s pack sizes.</p><h3>02 / Cut & edge</h3><p>Use the thickness-separated layouts above. Dimensions are panel cut sizes, before edging. Reconcile finished dimensions and edging thickness before cutting. Front edge is the edge facing the viewer in the assembled model.</p><div class="cs-pack-table"><table><thead><tr><th>Part ID / drawing label</th><th>Front edge to band</th></tr></thead><tbody>${model.parts.map(p=>`<tr><td>${esc(p.id)} / ${esc(p.label)}</td><td>${p.edge?`${p.edge.toFixed(1)} mm · one front edge`:'None assumed'}</td></tr>`).join('')}</tbody></table></div><h3>03 / Check, assemble & finish</h3><ul><li>Measure actual stock thickness and confirm the site dimensions before cutting.</li><li>Label every panel using the drawing label; check cut dimensions and square before assembly.</li><li>Dry-fit sides, bottom, top and dividers. Select suitable joints and fasteners for the actual material; fastener quantities are not included.</li><li>Verify shelf support locations and loads. Fit the overlay back where selected and check the cabinet is square.</li><li>Test edging and finish on scrap. Follow the product’s coverage, drying and recoating instructions.</li><li>Confirm wall anchors and anti-tip restraint for the installation before use.</li></ul><p><strong>Review before building:</strong> ${model.issues.length?model.issues.map(i=>esc(i.title)+': '+esc(i.detail)).join(' '):'Geometry checks passed. Joinery, loads and installation still require verification.'}</p>`;
}
