CREATE TABLE IF NOT EXISTS conversion_daily (
  date TEXT NOT NULL,
  route TEXT NOT NULL,
  scenario TEXT NOT NULL,
  event TEXT NOT NULL,
  device TEXT NOT NULL,
  placement TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0 CHECK(count >= 0),
  PRIMARY KEY (date, route, scenario, event, device, placement)
) WITHOUT ROWID;
