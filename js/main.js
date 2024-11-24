import { getAthleteReports, addAthleteReport} from './firebase.js';
import { initBar } from './barchart.js';
import { initStatEntry } from './stat_entry.js';
import { calculateChartData } from './chart_data.js';
import { initRadar } from './radar.js';


/* Custom Events: 

- statFilled
Fired when a stat is filled in the form
Detail: { statName: string, statValue: number } 

- positionSelected
Fired when a position is selected in the form
Detail: { position: string } */


// Fetch data
const indivStatsResponse = await fetch('data/stats_2020_2024.json');
const indivStats = await indivStatsResponse.json();

const events = new EventTarget();

const statListEl = document.querySelector('#athlete-stats');
const positionDropdownEl = document.querySelector('#header');

const positions = Object.keys(indivStats);
const statNames = Object.keys(Object.values(indivStats)[0][0]);

// Handle stat entry
initStatEntry(statListEl, positionDropdownEl, statNames, positions, events);

// Calculate chart data
let chartData = calculateChartData(indivStats, events);

// Get chart elements
const strengthEl = document.querySelector('#strength-chart');
const powerEl = document.querySelector('#power-chart');
const speedEl = document.querySelector('#speed-chart');
const agilityEl = document.querySelector('#agility-chart');
const anthroEl = document.querySelector('#anthro-chart');
const radarEl = document.querySelector('#radar-chart');

addAthleteReport();

// Render charts
function updateCharts() {
    const { positionMedians, playerPercentiles, playerStats, playerStatsValues, categoryPercentiles } = chartData.getCalculatedData();

    initBar(strengthEl, positionMedians, playerStats, playerStatsValues, playerPercentiles);
    initBar(powerEl, positionMedians, playerStats, playerStatsValues, playerPercentiles);
    initBar(speedEl, positionMedians, playerStats, playerStatsValues, playerPercentiles);
    initBar(agilityEl, positionMedians, playerStats, playerStatsValues, playerPercentiles);
    initBar(anthroEl, positionMedians, playerStats, playerStatsValues, playerPercentiles);

    initRadar(radarEl, categoryPercentiles);
}

// Listen for changes in stat or position
events.addEventListener('statFilled', updateCharts);
events.addEventListener('positionSelected', updateCharts);

updateCharts();