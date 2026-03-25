/**
 * One-time script to fetch NASDAQ Composite monthly close from FRED API.
 * Normalizes to index 100 at Jan 1995 and outputs JSON for the data file.
 *
 * Usage:
 *   FRED_API_KEY=your_key npx tsx scripts/fetch-nasdaq-fred.ts
 *
 * Get a free FRED API key at: https://fred.stlouisfed.org/docs/api/api_key.html
 */

const FRED_API_KEY = process.env.FRED_API_KEY;
const SERIES_ID = "NASDAQCOM"; // NASDAQ Composite Index
const START_DATE = "1995-01-01";
const END_DATE = "2003-12-31";

interface FredObservation {
  date: string;
  value: string;
}

interface FredResponse {
  observations: FredObservation[];
}

async function main() {
  if (!FRED_API_KEY) {
    console.error("Error: Set FRED_API_KEY environment variable.");
    console.error(
      "Get a free key at: https://fred.stlouisfed.org/docs/api/api_key.html"
    );
    process.exit(1);
  }

  const url = new URL("https://api.stlouisfed.org/fred/series/observations");
  url.searchParams.set("series_id", SERIES_ID);
  url.searchParams.set("api_key", FRED_API_KEY);
  url.searchParams.set("file_type", "json");
  url.searchParams.set("observation_start", START_DATE);
  url.searchParams.set("observation_end", END_DATE);
  url.searchParams.set("frequency", "a"); // annual
  url.searchParams.set("aggregation_method", "avg"); // annual average

  console.log("Fetching NASDAQ data from FRED...");

  const res = await fetch(url.toString());
  if (!res.ok) {
    console.error(`FRED API error: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const data: FredResponse = await res.json();
  const observations = data.observations.filter((o) => o.value !== ".");

  if (observations.length === 0) {
    console.error("No observations returned.");
    process.exit(1);
  }

  const baseValue = parseFloat(observations[0].value);
  console.log(`Base value (${observations[0].date}): ${baseValue}`);

  const normalized = observations.map((obs, i) => ({
    year: i,
    date: obs.date,
    raw: parseFloat(obs.value),
    indexed: Math.round((parseFloat(obs.value) / baseValue) * 100),
  }));

  console.log("\n--- Normalized NASDAQ (indexed to 100) ---\n");
  console.log(JSON.stringify(normalized, null, 2));

  console.log("\n--- For ai-investment-data.ts ---\n");
  console.log("// NASDAQ values (paste into CYCLE_DATA):");
  for (const point of normalized) {
    console.log(`// Year ${point.year} (${point.date}): ${point.indexed}`);
  }
}

main().catch(console.error);
