// Function to load and parse CSV data
function loadCSVData(callback) {
    Papa.parse("Types of cancer mortality.csv", {
        download: true,
        header: true,
        complete: function(results) {
            callback(results.data);
        }
    });
}

// Function to process CSV data and update charts
function processData(data, year) {
    let womenData = [];
    let menData = [];
    let commonLabels = [];

    data.forEach(row => {
        if (row.Year === year) {
            if (row.Gender === 'Female') {
                commonLabels.push(row.Type);
                womenData.push(parseInt(row.Count));
            } else if (row.Gender === 'Male') {
                menData.push(parseInt(row.Count));
            }
        }
    });

    updateCharts(commonLabels, womenData, menData);
    updateLegend(commonLabels);
}

// Function to update charts
function updateCharts(labels, womenData, menData) {
    womenChart.data.labels = labels;
    womenChart.data.datasets[0].data = womenData;
    womenChart.update();

    menChart.data.labels = labels;
    menChart.data.datasets[0].data = menData;
    menChart.update();
}

// Function to update common legend
function updateLegend(labels) {
    const legendContainer = document.getElementById('commonLegend');
    legendContainer.innerHTML = '';

    labels.forEach((label, index) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'common-legend-item';
        legendItem.onclick = () => toggleVisibility(index);

        const colorBox = document.createElement('span');
        colorBox.style.backgroundColor = womenChart.data.datasets[0].backgroundColor[index];

        const labelText = document.createTextNode(label);

        legendItem.appendChild(colorBox);
        legendItem.appendChild(labelText);
        legendContainer.appendChild(legendItem);
    });
}

// Function to toggle visibility of data points
function toggleVisibility(index) {
    const visibility = womenChart.getDatasetMeta(0).data[index].hidden === null ? !womenChart.data.datasets[0].hidden : null;

    womenChart.getDatasetMeta(0).data[index].hidden = visibility;
    menChart.getDatasetMeta(0).data[index].hidden = visibility;

    womenChart.update();
    menChart.update();
}

// Load and initialize charts with default year data
loadCSVData(function(data) {
    processData(data, '2017'); // Initialize with 2017 data by default
});

// Event listener to update charts based on year
document.querySelectorAll('.year-buttons button').forEach(button => {
    button.addEventListener('click', function() {
        let year = this.innerText;
        loadCSVData(function(data) {
            processData(data, year);
        });
    });
});

// Chart.js initialization
const ctxWomen = document.getElementById('womenChart').getContext('2d');
const ctxMen = document.getElementById('menChart').getContext('2d');

let womenChart = new Chart(ctxWomen, {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            label: 'Women',
            data: [],
            backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850', '#f39c12', '#d35400', '#1abc9c', '#2ecc71', '#95a5a6']
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false
            }
        },
        title: {
            display: true,
            text: 'Cancer Types in Women'
        }
    }
});

let menChart = new Chart(ctxMen, {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            label: 'Men',
            data: [],
            backgroundColor: ['#8e5ea2', '#3e95cd', '#3cba9f', '#e8c3b9', '#c45850', '#f39c12', '#d35400', '#1abc9c', '#2ecc71', '#95a5a6']
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false
            }
        },
        title: {
            display: true,
            text: 'Cancer Types in Men'
        }
    }
});
