export function estimatePanel(input) {
  const keys = ['length','width','qty','stockLength','stockWidth','allowance','price','hours','rate'];
  for (const key of keys) if (!Number.isFinite(input[key]) || input[key] < 0) throw new Error('Enter a valid non-negative number for every field.');
  if (!['mm','in'].includes(input.unit)) throw new Error('Choose millimeters or inches.');
  if (['length','width','stockLength','stockWidth','qty'].some(k => input[k] <= 0) || !Number.isInteger(input.qty)) throw new Error('Dimensions must be positive and quantity must be a whole number.');
  if (input.qty > 10000 || input.allowance > 100) throw new Error('Use up to 10,000 parts and an allowance between 0 and 100%.');
  const scale = input.unit === 'mm' ? 0.001 : 0.0254;
  const net = input.length * input.width * input.qty * scale ** 2;
  const allowed = net * (1 + input.allowance / 100);
  const sheets = Math.ceil(Number((allowed / (input.stockLength * input.stockWidth * scale ** 2)).toPrecision(12)));
  const fits = input.length <= input.stockLength && input.width <= input.stockWidth;
  const rotated = input.rotate && input.width <= input.stockLength && input.length <= input.stockWidth;
  const material = sheets * input.price, labor = input.hours * input.rate;
  if (![net,allowed,sheets,material,labor,material+labor].every(Number.isFinite)) throw new Error('The estimate is too large. Reduce the input values.');
  return {net,allowed,sheets,material,labor,total:material+labor,fits:Boolean(fits || rotated)};
}
