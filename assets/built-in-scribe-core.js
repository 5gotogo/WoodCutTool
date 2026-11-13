export const maxStations = 24;
export const maxDimension = 100000;
export const emptyStation = () => ({ position: null, gap: null });
export const blankSurvey = () => ({
  version: 1, unit: "mm", name: "", datum: "", length: null, blank: null, trim: null, uncertainty: null,
  stations: Array.from({ length: 3 }, emptyStation)
});

export function exampleSurvey() {
  return {
    ...blankSurvey(),
    name: "Alcove desk · right filler", datum: "Top of filler, measured down in the finished face plane",
    length: 720, blank: 48, trim: 4, uncertainty: 1,
    stations: [[0, 33], [180, 36], [310, 45], [540, 41], [720, 34]]
      .map(([position, gap]) => ({ position, gap }))
  };
}

const dimension = value => value === null || (Number.isFinite(value) && value >= 0 && value <= maxDimension);
const near = (a, b) => Math.abs(a - b) < 1e-7;
const clean = value => Number(value.toFixed(9));

export function validSurvey(survey) {
  return survey?.version === 1 && ["mm", "in"].includes(survey.unit) &&
    typeof survey.name === "string" && survey.name.length <= 100 &&
    typeof survey.datum === "string" && survey.datum.length <= 200 &&
    ["length", "blank", "trim", "uncertainty"].every(key => dimension(survey[key])) &&
    Array.isArray(survey.stations) && survey.stations.length >= 2 && survey.stations.length <= maxStations &&
    survey.stations.every(row => row && dimension(row.position) && dimension(row.gap));
}

export function assessSurvey({ length, blank, trim, uncertainty, stations }) {
  const active = stations.filter(row => row.position !== null || row.gap !== null);
  if (length === null || length <= 0) return { status: "pending", message: "Enter a positive filler length." };
  if (active.some(row => row.position === null || row.gap === null)) {
    return { status: "pending", message: "Complete both fields for each started station." };
  }
  const readings = [...active].sort((a, b) => a.position - b.position);
  if (readings.some(row => row.position > length && !near(row.position, length))) {
    return { status: "pending", message: "Every station must lie within the filler length." };
  }
  if (readings.some((row, i) => i > 0 && near(row.position, readings[i - 1].position))) {
    return { status: "pending", message: "Give every station a distinct position." };
  }
  if (readings.length < 2 || !near(readings[0].position, 0) || !near(readings.at(-1).position, length)) {
    return { status: "pending", message: "Include one reading at zero and one at the full filler length." };
  }
  const min = Math.min(...readings.map(row => row.gap));
  const max = Math.max(...readings.map(row => row.gap));
  const stats = { readings, min, max, range: clean(max - min) };
  if (blank === null || blank <= 0 || trim === null || uncertainty === null) {
    return { ...stats, status: "pending", message: "Enter a positive blank width, a trimming allowance and a measurement allowance. Enter zero where applicable." };
  }
  const required = clean(max + trim + uncertainty);
  const reserve = clean(blank - required);
  return { ...stats, required, reserve, status: reserve >= 0 ? "covered" : "short",
    message: reserve >= 0 ? "Blank covers the recorded stations and allowances." : "Blank is too narrow for the recorded stations and allowances." };
}

export const unitScale = unit => unit === "in" ? 25.4 : 1;
export const display = (value, unit) => value === null ? "" :
  String(Number((value / unitScale(unit)).toPrecision(13)));

export function surveyCsv(survey) {
  const result = assessSurvey(survey);
  if (result.reserve === undefined) return "";
  const { unit } = survey;
  const number = value => display(value, unit);
  const rows = [["Filler", "Datum", "Unit", "Length", "Position from datum", "Measured gap", "Blank width",
    "Trimming allowance", "Measurement allowance", "Required blank at station", "Reserve at station"]];
  for (const { position, gap } of result.readings) {
    const required = clean(gap + survey.trim + survey.uncertainty);
    rows.push([survey.name, survey.datum, unit, ...[survey.length, position, gap, survey.blank, survey.trim,
      survey.uncertainty, required, clean(survey.blank - required)].map(number)]);
  }
  return rows.map(row => row.map((value, i) => {
    const safe = i < 2 && /^[\s\uFEFF]*[=+\-@\t\r\n]/.test(value) ? "'" + value : value;
    return '"' + String(safe).replaceAll('"', '""') + '"';
  }).join(",")).join("\r\n") + "\r\n";
}
