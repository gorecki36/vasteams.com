/**
 * One-time script to fetch bottleneck indicator data from FRED.
 * No API key needed — uses FRED's CSV download endpoint.
 *
 * Usage: npx tsx scripts/fetch-bottleneck-data.ts
 *
 * Series:
 *   PCOPPUSDM   — Global copper price ($/metric ton), monthly
 *   PURANUSDM   — Global uranium price ($/lb), monthly
 *   APU000072610 — US avg electricity price ($/kWh), monthly
 */

interface DataPoint {
  date: string;
  value: number;
}

async function fetchFredCsv(
  seriesId: string,
  startDate: string,
  endDate: string
): Promise<DataPoint[]> {
  const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${seriesId}&cosd=${startDate}&coed=${endDate}&fq=Monthly`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`FRED error for ${seriesId}: ${res.status}`);

  const text = await res.text();
  const lines = text.trim().split("\n").slice(1); // skip header

  return lines
    .map((line) => {
      const [date, val] = line.split(",");
      const value = parseFloat(val);
      return { date, value };
    })
    .filter((d) => !isNaN(d.value));
}

function sampleQuarterly(data: DataPoint[]): DataPoint[] {
  // Take Jan, Apr, Jul, Oct of each year
  const quarterMonths = ["01", "04", "07", "10"];
  return data.filter((d) => {
    const month = d.date.split("-")[1];
    return quarterMonths.includes(month);
  });
}

async function main() {
  const START = "2020-01-01";
  const END = "2026-12-01";

  console.log("Fetching FRED data...\n");

  const [copper, uranium, electricity] = await Promise.all([
    fetchFredCsv("PCOPPUSDM", START, END),
    fetchFredCsv("PURANUSDM", START, END),
    fetchFredCsv("APU000072610", START, END),
  ]);

  // Also get the latest value (most recent month)
  const latestCopper = copper[copper.length - 1];
  const latestUranium = uranium[uranium.length - 1];
  const latestElectricity = electricity[electricity.length - 1];

  console.log("Latest values:");
  console.log(`  Copper: $${latestCopper.value.toFixed(0)}/mt (${latestCopper.date})`);
  console.log(`  Uranium: $${latestUranium.value.toFixed(2)}/lb (${latestUranium.date})`);
  console.log(`  Electricity: $${latestElectricity.value.toFixed(3)}/kWh (${latestElectricity.date})`);

  // Sample quarterly for sparklines
  const copperQ = sampleQuarterly(copper);
  const uraniumQ = sampleQuarterly(uranium);
  const electricityQ = sampleQuarterly(electricity);

  // Round values for cleaner output
  const copperSparkline = copperQ.map((d) => Math.round(d.value));
  const uraniumSparkline = uraniumQ.map((d) => parseFloat(d.value.toFixed(1)));
  const electricitySparkline = electricityQ.map((d) =>
    parseFloat((d.value * 100).toFixed(1)) // convert to cents for readability
  );

  console.log("\n--- For ai-investment-data.ts ---\n");

  console.log("// Copper price $/mt (quarterly, FRED PCOPPUSDM)");
  console.log(`// Range: ${copperQ[0].date} to ${copperQ[copperQ.length - 1].date}`);
  console.log(`sparkline: [${copperSparkline.join(", ")}],`);

  console.log("\n// Uranium price $/lb (quarterly, FRED PURANUSDM)");
  console.log(`// Range: ${uraniumQ[0].date} to ${uraniumQ[uraniumQ.length - 1].date}`);
  console.log(`sparkline: [${uraniumSparkline.join(", ")}],`);

  console.log("\n// US electricity price cents/kWh (quarterly, FRED APU000072610)");
  console.log(`// Range: ${electricityQ[0].date} to ${electricityQ[electricityQ.length - 1].date}`);
  console.log(`sparkline: [${electricitySparkline.join(", ")}],`);

  // Also output the full monthly data for reference
  console.log("\n--- Full monthly copper (for reference) ---");
  console.log(
    copper
      .slice(-12)
      .map((d) => `${d.date}: $${d.value.toFixed(0)}`)
      .join("\n")
  );
}

main().catch(console.error);
