const printFields = [
  ["lotId", "Lot ID"],
  ["sourceType", "Source type"],
  ["sourceReference", "Source reference"],
  ["observedDate", "Observation date"],
  ["quantity", "Quantity"],
  ["unit", "Unit"],
  ["flags", "Condition flags"],
  ["conditionNotes", "Condition and evidence"],
  ["disposition", "Disposition"],
  ["nextAction", "Next action and related lot IDs"],
  ["responsibleTeam", "Responsible team"],
];

const concerns = [
  "Metal or hardware",
  "Coating or prior treatment",
  "Decay or insect activity",
  "Unknown history",
];

export function recordMarkup() {
  return `<section class="urban-record" id="intake-record" aria-labelledby="intake-record-title">
  <div class="urban-record-screen">
    <h2 id="intake-record-title">Wood intake record</h2>
    <p>Use one record per lot. Record what you observed, where the evidence is kept, and who needs to review the lot next. Entries stay on this page until you download or print them.</p>
    <form class="urban-record-form" data-urban-record autocomplete="off">
      <fieldset class="urban-record-fields">
        <legend>Lot and origin</legend>
        <div class="urban-record-grid">
          <label>Lot ID<input name="lotId" required maxlength="64" pattern=".*\\S.*" placeholder="UW-014"></label>
          <label>Source type<select name="sourceType" required>
            <option value="">Choose a source</option>
            <option>Urban-tree logs</option>
            <option>Reclaimed building lumber</option>
            <option>Other recovered wood</option>
          </select></label>
          <label>Observation date<input type="date" name="observedDate" required></label>
          <label>Source reference<input name="sourceReference" maxlength="140" aria-describedby="urban-record-source-hint" placeholder="Municipal work order or salvage inventory ID"></label>
          <p class="urban-record-wide urban-record-hint" id="urban-record-source-hint">Use a work order or general location. Omit personal details and private addresses.</p>
          <label>Quantity<input name="quantity" type="number" min="0.001" step="any" required></label>
          <label>Unit<select name="unit" required>
            <option value="">Choose a unit</option>
            <option>logs</option>
            <option>boards</option>
            <option>pieces</option>
            <option>board feet</option>
            <option>cubic metres</option>
            <option>kilograms</option>
          </select></label>
        </div>
      </fieldset>
      <fieldset class="urban-record-fields">
        <legend>Condition and disposition</legend>
        <div class="urban-record-grid">
          <fieldset class="urban-record-wide urban-record-flags">
            <legend>Condition flags</legend>
            ${concerns.map((concern) => `<label><input type="checkbox" name="flags" value="${concern}"> ${concern}</label>`).join("\n            ")}
          </fieldset>
          <label class="urban-record-wide">Condition and evidence<textarea name="conditionNotes" rows="3" maxlength="500" placeholder="Species if known, observations, and photo or document references"></textarea></label>
          <label>Disposition<select name="disposition" required>
            <option value="">Choose a disposition</option>
            <option>Pending review</option>
            <option>Hold for follow-up</option>
            <option>Proceed to next intake step</option>
            <option>Split into separate lots</option>
            <option>Redirect to another outlet</option>
            <option>Decline this lot</option>
          </select></label>
          <label>Responsible team<input name="responsibleTeam" maxlength="80" placeholder="Receiving crew"></label>
          <label class="urban-record-wide">Next action and related lot IDs<textarea name="nextAction" rows="3" maxlength="500" placeholder="Where each lot goes and what needs follow-up"></textarea></label>
        </div>
      </fieldset>
      <p class="urban-record-hint">Use this record to hand off observations and decisions. Any grading, testing or clearance decision needs its own documentation.</p>
      <div class="urban-record-actions">
        <button type="button" data-record-download hidden>Download JSON</button>
        <button type="button" data-record-print-button hidden>Print record</button>
        <button type="button" data-record-sample hidden>Load example</button>
        <button type="reset">Clear record</button>
      </div>
      <p class="urban-record-status" role="status" data-record-status></p>
    </form>
  </div>
  <div class="urban-record-print">
    <h2>Wood intake record</h2>
    <p>Urban Wood Recovery · WoodCutTool</p>
    <dl>
      ${printFields.map(([field, label]) => `<div><dt>${label}</dt><dd data-record-print="${field}"></dd></div>`).join("\n      ")}
    </dl>
    <p>Use this record to hand off observations and decisions. Any grading, testing or clearance decision needs its own documentation.</p>
  </div>
</section>`;
}
