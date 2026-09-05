import { HANDOFF_KEY, validateProject } from './cut-handoff-model.js';
const root = document.querySelector('[data-cut-handoff]');
if (root) {
  const button = root.querySelector('[data-send-cut-list]');
  const status = root.querySelector('[data-handoff-status]');
  const trackOpen = () => window.WCTConversion?.track('example_open', { scenario: root.dataset.scenario });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', trackOpen, { once: true }); else trackOpen();
  button.addEventListener('click', () => {
    try {
      const project = validateProject(JSON.parse(root.querySelector('[data-handoff-payload]').textContent));
      // sessionStorage keeps the handoff local to this tab; calculator draft uses a different key.
      sessionStorage.setItem(HANDOFF_KEY, JSON.stringify(project));
      window.location.assign('/plywood-cut-calculator/#import-cut-list');
    } catch {
      status.textContent = 'This browser could not transfer the list. Your existing calculator draft is unchanged. Use the visible parts table or CSV to enter the parts manually.';
      const link = document.createElement('a'); link.href = '/plywood-cut-calculator/'; link.textContent = ' Open the calculator'; status.append(link);
    }
  });
}
