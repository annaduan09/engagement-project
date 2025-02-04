import { addAthleteReport } from './firebase.js';
import { initBar } from './barchart.js';
import { initStatEntry } from './stat_entry.js';
import { calculateChartData } from './chart_data.js';
import { initRadar } from './radar.js';
import {
  collectAthleteData,
  loadAthleteDropdown,
  setupAthleteSelectionListener,
} from './athlete_report.js';

// Fetch individual stats data
const indivStatsResponse = await fetch('data/stats_2020_2024.json');
const indivStats = await indivStatsResponse.json();

// Event target for custom events
const events = new EventTarget();

// Set up references to DOM elements
const statListEl = document.querySelector('#athlete-stats');
const positionDropdownEl = document.querySelector('#header');

// Extract positions and stat names
const positions = Object.keys(indivStats);
const statNames = Object.keys(Object.values(indivStats)[0][0]);

// Initialize stat entry
initStatEntry(statListEl, positionDropdownEl, statNames, positions, events);

// Calculate chart data
const chartData = calculateChartData(indivStats, events);

// Get chart elements
const chartElements = {
  strength: document.querySelector('#strength-chart'),
  power: document.querySelector('#power-chart'),
  speed: document.querySelector('#speed-chart'),
  agility: document.querySelector('#agility-chart'),
  anthro: document.querySelector('#anthropometrics-chart'),
  radar: document.querySelector('#radar-chart'),
};

// Render charts
function renderCharts() {
  const { positionMedians, playerPercentiles, playerStats, playerStatsValues, categoryPercentiles } =
    chartData.getCalculatedData();

  Object.values(chartElements).forEach((chartEl, index) => {
    if (index < 5) {
      initBar(chartEl, positionMedians, playerStats, playerStatsValues, playerPercentiles);
    } else {
      initRadar(chartElements.radar, categoryPercentiles);
    }
  });
}

// Initial render
renderCharts();

// Update charts on custom events
events.addEventListener('statFilled', renderCharts);
events.addEventListener('positionSelected', renderCharts);

// Save athlete report
document.getElementById('save-athlete').addEventListener('click', () => {
  const data = collectAthleteData();
  addAthleteReport(data);
});

// Load athletes
document.getElementById('load-athletes').addEventListener('click', loadAthleteDropdown);

// Enable athlete selection from dropdown
setupAthleteSelectionListener();

// Final stats

/* const finalStatsResponse = await fetch('data/bulk uploads/jr_day_2025.json');
const finalStats = await finalStatsResponse.json();

finalStats.Name.forEach((Name, index) => {
  const athlete = {}
  athlete.Name = finalStats.Name[index]
  athlete.Position = finalStats.Position[index]
  athlete.Status = finalStats.Status[index]
  athlete.Number = ""
  athlete.Height = finalStats.Height[index]
  athlete.Weight = finalStats.Weight[index]
  athlete.Wingspan = finalStats.Wingspan[index]
  athlete.Bench = ""
  athlete.Squat = ""
  athlete['225lb Bench'] = ""
  athlete['Vertical Jump'] = ""
  athlete['Broad Jump'] = ""
  athlete['Hang Clean'] = ""
  athlete['Power Clean'] = ""
  athlete['10Y Sprint'] = ""
  athlete['Flying 10'] = ""
  athlete['Pro Agility'] = ""
  athlete['L Drill'] = ""
  athlete['60Y Shuttle'] = ""
  athlete['Notes'] = ""

  addAthleteReport(athlete)
}); */