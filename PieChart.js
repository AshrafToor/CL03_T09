// Function to load and parse CSV data using D3
function loadCSVData(callback) {
    d3.csv("Data/Types_of_cancer_mortality.csv").then(data => {
        callback(data);
    });
}

// Function to process CSV data and update charts
function processData(data, year) {
    let womenData = [];
    let menData = [];
    let allLabels = new Set();

    data.forEach(row => {
        if (row.Year === year) {
            allLabels.add(row.Type);
            if (row.Gender === 'Female') {
                womenData.push({ label: row.Type, value: parseInt(row.Count), gender: 'Women' });
            } else if (row.Gender === 'Male') {
                menData.push({ label: row.Type, value: parseInt(row.Count), gender: 'Men' });
            }
        }
    });

    const commonLabels = Array.from(allLabels).sort();
    womenData = sortDataByLabels(womenData, commonLabels);
    menData = sortDataByLabels(menData, commonLabels);

    updateCharts(commonLabels, womenData, menData);
    updateLegend(commonLabels);
}

function sortDataByLabels(data, labels) {
    return labels.map(label => data.find(d => d.label === label) || { label, value: 0 });
}

// Custom color palette based on the provided colors
const customColorPalette = {
    "Lung": "#1f77b4",         // blue
    "Breast": "#ff69b4",       // pink
    "Colorectal": "#2ca02c",   // green
    "Pancreas": "#d3d3d3",     // ash
    "Ovary": "#ff7f0e",        // orange
    "Leukemia": "#d62728",     // red
    "Liver": "#ffdd57",        // yellow
    "Bladder": "#87ceeb",      // light blue
    "Melanoma of skin": "#8b4513",  // brown
    "Prostate": "#90ee90",     // light green
    "Stomach": "#dda0dd"       // light purple
};

// Store the visibility state of each cancer type
let visibilityState = {};

// Function to update charts
function updateCharts(labels, womenData, menData) {
    createPieChart('#womenChartContainer', womenData, labels, 'Women');
    createPieChart('#menChartContainer', menData, labels, 'Men');
}

// Function to create pie chart using D3
function createPieChart(container, data, labels, gender) {
    const width = 350, height = 350, radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal()
        .domain(labels)
        .range(labels.map(label => customColorPalette[label] || "#cccccc"));

    d3.select(container).select("svg").remove();

    const svg = d3.select(container).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3.pie().value(d => d.value).sort(null);  // Ensure order is consistent
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const totalValue = data.reduce((acc, d) => acc + d.value, 0);

    const arcs = svg.selectAll("arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.label))
        .each(function(d) { this._current = d; })  // Store the initial angles
        .on("mouseover", function(event, d) {
            d3.select(this).style("opacity", 0.7);
            const percentage = ((d.data.value / totalValue) * 100).toFixed(2);
            tooltip.style("visibility", "visible")
                .html(`<strong>${d.data.label}</strong><br>
                       <span style="color:${color(d.data.label)};">&#9632;</span> 
                       ${gender}: ${d3.format(",")(d.data.value)} 
                       (${percentage}%)`);
        })
        .on("mousemove", function(event) {
            tooltip.style("top", (event.pageY - 40) + "px")
                .style("left", (event.pageX + 20) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).style("opacity", 1);
            tooltip.style("visibility", "hidden");
        });

    // Transition animation
    arcs.selectAll("path")
        .transition()
        .duration(1000)
        .attrTween("d", function(d) {
            const interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                return arc(interpolate(t));
            };
        });
}

// Function to update common legend
function updateLegend(labels) {
    const legendContainer = document.getElementById('commonLegend');
    legendContainer.innerHTML = '';

    const color = d3.scaleOrdinal()
        .domain(labels)
        .range(labels.map(label => customColorPalette[label] || "#cccccc"));

    labels.forEach((label, index) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'common-legend-item';
        legendItem.onclick = () => toggleVisibility(label);

        const colorBox = document.createElement('span');
        colorBox.style.backgroundColor = color(label);
        colorBox.style.cursor = 'pointer';

        const labelText = document.createTextNode(label);

        legendItem.appendChild(colorBox);
        legendItem.appendChild(labelText);
        legendContainer.appendChild(legendItem);

        // Initialize visibility state
        if (visibilityState[label] === undefined) {
            visibilityState[label] = true;
        }

        // Set initial visibility state
        if (!visibilityState[label]) {
            colorBox.style.opacity = 0.5;
        }
    });
}

// Toggle visibility of the slices corresponding to the clicked legend item
function toggleVisibility(label) {
    visibilityState[label] = !visibilityState[label];

    // Update legend opacity
    const legendItems = document.querySelectorAll('.common-legend-item');
    legendItems.forEach(item => {
        if (item.textContent === label) {
            const colorBox = item.querySelector('span');
            colorBox.style.opacity = visibilityState[label] ? 1 : 0.5;
        }
    });

    // Reload data and filter out hidden types
    loadCSVData(function(data) {
        const year = document.querySelector('.year-buttons button.active')?.innerText || '2017';
        let filteredData = data.filter(d => visibilityState[d.Type]);
        let womenData = [];
        let menData = [];
        let allLabels = new Set();

        filteredData.forEach(row => {
            if (row.Year === year) {
                allLabels.add(row.Type);
                if (row.Gender === 'Female') {
                    womenData.push({ label: row.Type, value: parseInt(row.Count), gender: 'Women' });
                } else if (row.Gender === 'Male') {
                    menData.push({ label: row.Type, value: parseInt(row.Count), gender: 'Men' });
                }
            }
        });

        const commonLabels = Array.from(allLabels).sort();
        womenData = sortDataByLabels(womenData, commonLabels);
        menData = sortDataByLabels(menData, commonLabels);

        updateCharts(commonLabels, womenData, menData);
    });
}

// Create a tooltip
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "rgba(0, 0, 0, 0.7)")
    .style("color", "#fff")
    .style("border", "none")
    .style("padding", "10px")
    .style("border-radius", "5px")
    .style("box-shadow", "0 0 10px rgba(0, 0, 0, 0.5)")
    .style("font-family", "Arial, sans-serif")
    .style("font-size", "14px");

// Load and initialize charts with default year data
loadCSVData(function(data) {
    processData(data, '2017'); // Initialize with 2017 data by default
    document.querySelector('.year-buttons button').classList.add('active');
});

// Event listener to update charts based on year
document.querySelectorAll('.year-buttons button').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.year-buttons button').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        let year = this.innerText;
        loadCSVData(function(data) {
            let filteredData = data.filter(d => visibilityState[d.Type]);
            processData(filteredData, year);
        });
    });
});
