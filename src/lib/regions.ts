export type Trajectory = "A" | "B" | "C";

export interface Region {
  id: string;
  name: string;
  country: string;
  trajectory: Trajectory;
  description: string;
  modifiers: Record<string, number>; // additive adjustments (-30 to +30)
}

export const REGIONS: Region[] = [
  // Trajectory A — Wealthy nations, early adopters
  {
    id: "portland",
    name: "Portland",
    country: "USA",
    trajectory: "A",
    description: "Tech-forward Pacific Northwest — early pod adoption hub",
    modifiers: {
      digital_immersion: 15,
      corporate_power: -10,
    },
  },
  {
    id: "san_francisco",
    name: "San Francisco",
    country: "USA",
    trajectory: "A",
    description: "Ground zero for AI acceleration and corporate consolidation",
    modifiers: {
      ai_acceleration: 15,
      corporate_power: 10,
      digital_immersion: 20,
    },
  },
  {
    id: "new_york",
    name: "New York",
    country: "USA",
    trajectory: "A",
    description: "Financial and cultural capital — inequality amplifier",
    modifiers: {
      corporate_power: 15,
      digital_immersion: 5,
    },
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    trajectory: "A",
    description:
      "Extreme demographic collapse meets hyper-digitalization",
    modifiers: {
      demographic_collapse: -20,
      digital_immersion: 25,
      neural_interface: 10,
    },
  },
  {
    id: "seoul",
    name: "Seoul",
    country: "South Korea",
    trajectory: "A",
    description: "World's lowest fertility rate, highest digital immersion",
    modifiers: {
      demographic_collapse: -25,
      digital_immersion: 25,
      corporate_power: 10,
    },
  },
  {
    id: "london",
    name: "London",
    country: "UK",
    trajectory: "A",
    description: "Post-empire adaptation — regulation vs. innovation tension",
    modifiers: {
      corporate_power: -10,
      demographic_collapse: -5,
      digital_immersion: 10,
    },
  },
  {
    id: "berlin",
    name: "Berlin",
    country: "Germany",
    trajectory: "A",
    description: "Privacy-conscious Europe — slower adoption, stronger regulation",
    modifiers: {
      corporate_power: -15,
      neural_interface: -10,
      demographic_collapse: -10,
      digital_immersion: 10,
    },
  },
  {
    id: "stockholm",
    name: "Stockholm",
    country: "Sweden",
    trajectory: "A",
    description: "High trust, high tech — if reform is possible, it happens here",
    modifiers: {
      corporate_power: -10,
      digital_immersion: 10,
    },
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    trajectory: "A",
    description: "Petro-wealth funds aggressive AI and pod adoption",
    modifiers: {
      ai_acceleration: 25,
      corporate_power: 15,
      neural_interface: 10,
      demographic_collapse: -10,
    },
  },
  {
    id: "singapore",
    name: "Singapore",
    country: "Singapore",
    trajectory: "A",
    description: "City-state efficiency — early pod infrastructure at scale",
    modifiers: {
      ai_acceleration: 15,
      corporate_power: 10,
      demographic_collapse: -15,
      digital_immersion: 10,
    },
  },
  {
    id: "sydney",
    name: "Sydney",
    country: "Australia",
    trajectory: "A",
    description: "Climate vulnerability accelerates digital migration",
    modifiers: {
      climate_crisis: 10,
      digital_immersion: 5,
    },
  },

  // Trajectory B — Aspirational digitalization, rapid leapfrogging
  {
    id: "lagos",
    name: "Lagos",
    country: "Nigeria",
    trajectory: "B",
    description: "Africa's tech capital — youngest population, digital leapfrog",
    modifiers: {
      digital_immersion: 10,
      demographic_collapse: 30,
      neural_interface: -15,
      corporate_power: -10,
    },
  },
  {
    id: "nairobi",
    name: "Nairobi",
    country: "Kenya",
    trajectory: "B",
    description: "Mobile-first innovation hub — M-Pesa model scales to pods",
    modifiers: {
      digital_immersion: 15,
      demographic_collapse: 25,
      neural_interface: -10,
    },
  },
  {
    id: "mumbai",
    name: "Mumbai",
    country: "India",
    trajectory: "B",
    description: "Massive scale, young population — digital leapfrog meets religion",
    modifiers: {
      digital_immersion: 15,
      demographic_collapse: 15,
      corporate_power: 5,
      neural_interface: -5,
    },
  },
  {
    id: "bangalore",
    name: "Bangalore",
    country: "India",
    trajectory: "B",
    description: "India's tech hub — AI workforce epicenter",
    modifiers: {
      ai_acceleration: 15,
      digital_immersion: 20,
      demographic_collapse: 10,
    },
  },
  {
    id: "jakarta",
    name: "Jakarta",
    country: "Indonesia",
    trajectory: "B",
    description: "Sinking megacity — climate forces digital migration early",
    modifiers: {
      climate_crisis: 15,
      digital_immersion: 10,
      demographic_collapse: 10,
      neural_interface: -5,
    },
  },
  {
    id: "sao_paulo",
    name: "São Paulo",
    country: "Brazil",
    trajectory: "B",
    description: "Latin America's largest city — extreme inequality amplified",
    modifiers: {
      corporate_power: 15,
      digital_immersion: 15,
    },
  },
  {
    id: "mexico_city",
    name: "Mexico City",
    country: "Mexico",
    trajectory: "B",
    description: "Nearshoring boom meets water crisis",
    modifiers: {
      climate_crisis: 10,
      digital_immersion: 10,
    },
  },
  {
    id: "cairo",
    name: "Cairo",
    country: "Egypt",
    trajectory: "B",
    description: "Young population, authoritarian digitalization",
    modifiers: {
      demographic_collapse: 20,
      corporate_power: 10,
      digital_immersion: 5,
    },
  },

  // Trajectory C — Accelerated state-directed paths
  {
    id: "shanghai",
    name: "Shanghai",
    country: "China",
    trajectory: "C",
    description: "State-directed AI acceleration at unprecedented scale",
    modifiers: {
      ai_acceleration: 15,
      corporate_power: 20,
      demographic_collapse: -20,
      digital_immersion: 10,
    },
  },
  {
    id: "shenzhen",
    name: "Shenzhen",
    country: "China",
    trajectory: "C",
    description: "Hardware manufacturing hub — builds the physical pods",
    modifiers: {
      ai_acceleration: 10,
      neural_interface: 10,
      corporate_power: 15,
      demographic_collapse: -15,
    },
  },
  {
    id: "beijing",
    name: "Beijing",
    country: "China",
    trajectory: "C",
    description: "Political center — where pod policy gets written",
    modifiers: {
      ai_acceleration: 15,
      corporate_power: 20,
      demographic_collapse: -20,
      neural_interface: 10,
    },
  },
  {
    id: "moscow",
    name: "Moscow",
    country: "Russia",
    trajectory: "C",
    description: "Resource-rich, population-poor — digital isolation strategy",
    modifiers: {
      demographic_collapse: -15,
      corporate_power: 15,
      digital_immersion: -5,
      global_convergence: -15,
    },
  },
  {
    id: "riyadh",
    name: "Riyadh",
    country: "Saudi Arabia",
    trajectory: "C",
    description: "NEOM-style megaprojects — state-directed futurism",
    modifiers: {
      ai_acceleration: 20,
      neural_interface: 15,
      corporate_power: 15,
      demographic_collapse: -5,
    },
  },
  {
    id: "tehran",
    name: "Tehran",
    country: "Iran",
    trajectory: "C",
    description: "Sanctions drive alternative digital infrastructure",
    modifiers: {
      global_convergence: -20,
      digital_immersion: -5,
      demographic_collapse: -10,
    },
  },
];
