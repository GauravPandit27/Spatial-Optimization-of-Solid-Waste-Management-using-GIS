// --- Modals & Panels Logic ---
const modal = document.getElementById('summary-modal');
const analyticsPanel = document.getElementById('analytics-panel');
const historicalModal = document.getElementById('historical-modal');
const btnSummary = document.getElementById('btn-summary');
const btnAnalytics = document.getElementById('btn-analytics');
const btnHistorical = document.getElementById('btn-historical');

// Summary Modal
setTimeout(() => { modal.classList.remove('hidden'); }, 800); // Dramatic entrance
btnSummary.addEventListener('click', () => { modal.classList.remove('hidden'); });
document.getElementById('btn-close-modal').addEventListener('click', () => { modal.classList.add('hidden'); });
modal.addEventListener('click', (e) => { if(e.target === modal) modal.classList.add('hidden'); });

// Historical Stats Modal
btnHistorical.addEventListener('click', () => { historicalModal.classList.remove('hidden'); });
document.getElementById('btn-close-historical').addEventListener('click', () => { historicalModal.classList.add('hidden'); });
historicalModal.addEventListener('click', (e) => { if(e.target === historicalModal) historicalModal.classList.add('hidden'); });

// Analytics Panel
btnAnalytics.addEventListener('click', () => { analyticsPanel.classList.remove('hidden'); });
document.getElementById('btn-close-analytics').addEventListener('click', () => { analyticsPanel.classList.add('hidden'); });

// --- Map Initialization ---
const map = L.map('map', { zoomControl: false }).setView([25.4340, 81.8860], 14);
L.control.zoom({ position: 'bottomright' }).addTo(map);
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 }).addTo(map);

// --- Icons ---
const createNeonIcon = (id, color, size, text='') => {
    return L.divIcon({
        className: `custom-neon-icon bin-icon-${id} sensor-safe`, // Added classes for IoT manipulation
        html: `<div class="icon-inner" style="width: 100%; height: 100%; border-radius: ${text ? '4px' : '50%'}; border: 2px solid white; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 10px; font-weight: 900;">${text}</span></div>`,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
    });
};
const ghatIcon = L.divIcon({ className: 'custom-icon', html: `<div style="background-color: #00FF66; width: 100%; height: 100%; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 15px #00FF66, 0 0 30px #00FF66;"></div>`, iconSize: [18, 18], iconAnchor: [9, 9] });
const stationIcon = L.divIcon({ className: 'custom-icon', html: `<div style="background-color: #FACC15; width: 100%; height: 100%; border-radius: 4px; border: 2px solid white; box-shadow: 0 0 15px #FACC15; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 10px; font-weight: 900;">TS</span></div>`, iconSize: [28, 28], iconAnchor: [14, 14] });

// --- Data Objects ---
let iotBins = [
    { id: 1, coords: [25.4320, 81.8860], level: 10 },
    { id: 2, coords: [25.4285, 81.8845], level: 30 },
    { id: 3, coords: [25.4300, 81.8890], level: 5 },
    { id: 4, coords: [25.4270, 81.8875], level: 80 },
    { id: 5, coords: [25.4360, 81.8900], level: 20 },
    { id: 6, coords: [25.4380, 81.8820], level: 50 },
    { id: 7, coords: [25.4410, 81.8850], level: 15 },
    { id: 8, coords: [25.4240, 81.8890], level: 90 },
    { id: 9, coords: [25.4220, 81.8820], level: 40 }, // Southwest
    { id: 10, coords: [25.4340, 81.8780], level: 60 }, // West Central
    { id: 11, coords: [25.4420, 81.8780], level: 10 }, // Northwest
    { id: 12, coords: [25.4390, 81.8880], level: 75 }  // North East
];

const ghatsData = [
    { name: "Triveni Sangam Ghat", coords: [25.4284, 81.8856], intensity: 1.0 },
    { name: "Saraswati Ghat", coords: [25.4250, 81.8810], intensity: 0.7 },
    { name: "Sector 1 Camp", coords: [25.4340, 81.8840], intensity: 0.9 },
    { name: "Sector 2 Camp", coords: [25.4400, 81.8880], intensity: 0.8 }
];

const transferStation = [25.4370, 81.8780]; 

// --- Layer Groups ---
const binsLayer = L.layerGroup();
const ghatsLayer = L.layerGroup();
const buffersLayer = L.layerGroup();
const route1Layer = L.layerGroup(); 
const route2Layer = L.layerGroup(); 
const gapsLayer = L.layerGroup();
const stationLayer = L.layerGroup();
const riverLayer = L.layerGroup();
const miniBinsLayer = L.layerGroup();

// Generate 400+ mini-bins scattered around the area
for(let i=0; i<450; i++) {
    const lat = 25.4200 + Math.random() * 0.0250;
    const lon = 81.8750 + Math.random() * 0.0200;
    // Keep them away from the river bank restricted area
    if(lon < 81.8900 || (lat > 25.4300 && lon < 81.8930)) {
        L.circleMarker([lat, lon], {
            radius: 2,
            color: '#00E5FF',
            weight: 1,
            fillColor: '#00E5FF',
            fillOpacity: 0.6
        }).bindPopup("<b style='color:#00E5FF'>Mini-Bin Node</b><br>Capacity: 60L").addTo(miniBinsLayer);
    }
}

// Populate Bins & Buffers
iotBins.forEach(bin => {
    bin.marker = L.marker(bin.coords, { icon: createNeonIcon(bin.id, '#00FF66', 16) })
                  .bindPopup(`<b style="color:#00E5FF;">Primary Hub ${bin.id}</b><br>Fill Level: <span class="bin-popup-${bin.id}">${bin.level}%</span><br>Feeds: ~600 Mini-bins`)
                  .addTo(binsLayer);
    
    // Increased catchment radius to 250m to cover all mini-bins
    L.circle(bin.coords, { color: '#00FF66', fillColor: '#00FF66', fillOpacity: 0.15, weight: 2, radius: 250, dashArray: '4, 4' }).addTo(buffersLayer);
});

ghatsData.forEach(ghat => { L.marker(ghat.coords, { icon: ghatIcon }).bindPopup(`<b style="color:#00FF66;">${ghat.name}</b>`).addTo(ghatsLayer); });
L.marker(transferStation, { icon: stationIcon }).addTo(stationLayer);

// --- Unserved Gaps ---
const gapIcon = L.divIcon({ className: 'custom-icon pulse-marker', html: `<div style="background-color: rgba(255,0,68,0.2); border: 3px solid #FF0044; width: 100%; height: 100%; border-radius: 50%;"></div>`, iconSize: [60, 60], iconAnchor: [30, 30] });
L.marker([25.4460, 81.8920], { icon: gapIcon }).bindPopup("<b style='color:#FF0044'>CRITICAL GAP DETECTED</b><br>High floating population zone lacking any Primary Hub within 250m radius.").addTo(gapsLayer);
L.marker([25.4200, 81.8940], { icon: gapIcon }).bindPopup("<b style='color:#FF0044'>CRITICAL GAP DETECTED</b><br>High floating population zone lacking any Primary Hub within 250m radius.").addTo(gapsLayer);

// --- Advanced Features ---

// 1. River Protection Polygon (150m No Dump Zone)
const riverBankCoords = [
    [25.4450, 81.8950], [25.4350, 81.8920], [25.4280, 81.8890], 
    [25.4200, 81.8870], [25.4200, 81.9000], [25.4450, 81.9000] // Creating a block on the eastern edge
];
L.polygon(riverBankCoords, {
    color: '#3B82F6', fillColor: '#3B82F6', fillOpacity: 0.3, weight: 3, dashArray: '10, 10'
}).bindPopup("<b style='color:#3B82F6'>Restricted River Zone (150m)</b><br>No bins allowed.").addTo(riverLayer);

// 2. Heatmap Generation
// Generate a bunch of random points around the ghats to simulate crowds
let heatPoints = [];
ghatsData.forEach(g => {
    for(let i=0; i<150 * g.intensity; i++) {
        heatPoints.push([g.coords[0] + (Math.random()-0.5)*0.005, g.coords[1] + (Math.random()-0.5)*0.005, g.intensity]);
    }
});
const heatmapLayer = L.heatLayer(heatPoints, { radius: 25, blur: 20, maxZoom: 16, gradient: {0.2: 'blue', 0.5: 'cyan', 0.7: 'lime', 0.9: 'yellow', 1.0: 'red'} });

// 3. Logistics Routes (Updated to include all north hubs)
L.polyline([transferStation, iotBins[9].coords, iotBins[10].coords, iotBins[5].coords, iotBins[6].coords, iotBins[11].coords, iotBins[4].coords], { color: '#B026FF', weight: 5, className: 'animated-route-1' }).addTo(route1Layer);
L.polyline([transferStation, iotBins[8].coords, iotBins[0].coords, iotBins[2].coords, iotBins[3].coords, iotBins[1].coords, iotBins[7].coords], { color: '#FF8A00', weight: 5, className: 'animated-route-2' }).addTo(route2Layer);

// Initial State
map.addLayer(miniBinsLayer);
map.addLayer(binsLayer);
map.addLayer(ghatsLayer);

// --- UI Toggles ---
const toggleLayer = (id, layer) => {
    document.getElementById(id).addEventListener('change', (e) => {
        e.target.checked ? map.addLayer(layer) : map.removeLayer(layer);
    });
};

toggleLayer('toggle-minibins', miniBinsLayer);
toggleLayer('toggle-bins', binsLayer);
toggleLayer('toggle-ghats', ghatsLayer);
toggleLayer('toggle-buffer', buffersLayer);
toggleLayer('toggle-route1', route1Layer);
toggleLayer('toggle-route2', route2Layer);
toggleLayer('toggle-station', stationLayer);
toggleLayer('toggle-river', riverLayer);
toggleLayer('toggle-heatmap', heatmapLayer);
toggleLayer('toggle-gaps', gapsLayer);

// --- IoT Simulation Logic ---
let iotInterval;
document.getElementById('toggle-iot').addEventListener('change', (e) => {
    if(e.target.checked) {
        document.getElementById('waste-val').style.color = '#EC4899';
        iotInterval = setInterval(() => {
            let totalWaste = 0;
            iotBins.forEach(bin => {
                // Randomly increase fill level
                bin.level += Math.floor(Math.random() * 8);
                if(bin.level > 100) bin.level = 0; // Simulate truck emptying it
                totalWaste += (bin.level * 2.4); // Approx kg based on 240L
                
                // Update DOM Icon classes
                const iconElement = document.querySelector(`.bin-icon-${bin.id}`);
                const popupEl = document.querySelector(`.bin-popup-${bin.id}`);
                if(iconElement) {
                    iconElement.classList.remove('sensor-safe', 'sensor-warning', 'sensor-critical');
                    if(bin.level < 50) iconElement.classList.add('sensor-safe');
                    else if(bin.level < 85) iconElement.classList.add('sensor-warning');
                    else iconElement.classList.add('sensor-critical');
                }
                if(popupEl) popupEl.innerText = `${bin.level}%`;
            });
            document.getElementById('waste-val').innerText = Math.floor(totalWaste).toLocaleString();
        }, 1500); // Fast simulation
    } else {
        clearInterval(iotInterval);
        document.getElementById('waste-val').style.color = '#fff';
    }
});

// --- Analytics (Chart.js) ---
const ctxWaste = document.getElementById('wasteChart').getContext('2d');
new Chart(ctxWaste, {
    type: 'bar',
    data: {
        labels: ['Sector 1', 'Sector 2', 'Sector 3', 'Ghats'],
        datasets: [{
            label: 'Daily Waste (kg)',
            data: [1200, 1900, 800, 2500],
            backgroundColor: 'rgba(0, 229, 255, 0.6)',
            borderColor: '#00E5FF',
            borderWidth: 1,
            borderRadius: 4
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#fff' } }, title: { display: true, text: 'Waste Generation by Zone', color: '#fff' } },
        scales: { y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#839BB0' } }, x: { grid: { display: false }, ticks: { color: '#839BB0' } } }
    }
});

const ctxBudget = document.getElementById('budgetChart').getContext('2d');
new Chart(ctxBudget, {
    type: 'doughnut',
    data: {
        labels: ['Smart Bins (IoT)', 'Transfer Station', 'Logistics/Trucks', 'Maintenance'],
        datasets: [{
            data: [450000, 500000, 200000, 95000],
            backgroundColor: ['#00E5FF', '#B026FF', '#FF8A00', '#00FF66'],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        cutout: '70%',
        plugins: { legend: { position: 'bottom', labels: { color: '#fff', padding: 20 } }, title: { display: true, text: 'Bill of Quantities (BoQ) Budget Allocation', color: '#fff' } }
    }
});
