// Function to parse CSV data
async function getData() {
    const response = await fetch('data.csv');
    const data = await response.text();
    const rows = data.trim().split('\n').slice(1); // trim to remove any leading/trailing whitespace
    const causes = [];
    const women = [];
    const men = [];

    rows.forEach(row => {
        const cols = row.split(',');
        causes.push(cols[0]);
        women.push(parseFloat(cols[1].replace('%', ''))); // remove '%' and convert to number
        men.push(parseFloat(cols[2].replace('%', ''))); // remove '%' and convert to number
    });

    return { causes, women, men };
}

// Function to create pie chart
async function createPieChart(dataArray, labels, backgroundColors, title, container) {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = window.innerWidth / 2 - 20; // Adjusted for padding
    ctx.canvas.height = window.innerHeight / 2 - 20; // Adjusted for padding
    const chartContainer = document.createElement('div');
    chartContainer.style.width = `${window.innerWidth / 2 - 20}px`; // Adjusted for padding
    chartContainer.style.height = `${window.innerHeight / 2 - 20}px`; // Adjusted for padding
    chartContainer.style.margin = '10px'; // Added margin
    container.appendChild(chartContainer);
    const pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: dataArray,
                backgroundColor: backgroundColors,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: title
            },
            legend: {
                display: false
            }
        }
    });
    chartContainer.appendChild(ctx.canvas);
}

// Function to create the charts
async function createCharts() {
    const data = await getData();
    const container = document.createElement('div');
    container.style.display = 'flex'; // Display charts horizontally
    document.body.appendChild(container);
    createPieChart(data.women, data.causes, getColors(data.causes.length), 'Women', container);
    createPieChart(data.men, data.causes, getColors(data.causes.length), 'Men', container);
}

// Helper function to generate random colors
function getColors(numColors) {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        colors.push(`rgb(${r},${g},${b})`);
    }
    return colors;
}

createCharts();
