
const data2017 = {
    women: {
        labels: ['Lung', 'Breast', 'Colorectal', 'Pancreas', 'Ovary', 'Leukemia', 'Liver', 'Bladder', 'Melanoma of skin', 'Others'],
        data: [204403, 170534, 132933, 91506, 56714, 47541, 30947, 25947, 24927, 17504]
    },
    men: {
        labels: ['Lung', 'Colorectal', 'Prostate', 'Pancreas', 'Leukemia', 'Liver', 'Stomach', 'Bladder', 'Melanoma of skin', 'Others'],
        data: [365315, 157450, 140707, 94046, 66191, 52750, 43714, 36287, 31698, 25137]
    }
};

const data2019 = {
    women: {
        labels: ['Lung', 'Breast', 'Colorectal', 'Pancreas', 'Ovary', 'Leukemia', 'Liver', 'Bladder', 'Melanoma of skin', 'Others'],
        data: [209028, 177600, 135681, 96276, 57932, 49741, 32947, 27947, 26927, 19504]
    },
    men: {
        labels: ['Lung', 'Colorectal', 'Prostate', 'Pancreas', 'Leukemia', 'Liver', 'Stomach', 'Bladder', 'Melanoma of skin', 'Others'],
        data: [361652, 160728, 143707, 99960, 67191, 54750, 44714, 38287, 32698, 26137]
    }
};

const data2021 = {
    women: {
        labels: ['Lung', 'Breast', 'Colorectal', 'Pancreas', 'Ovary', 'Leukemia', 'Liver', 'Bladder', 'Melanoma of skin', 'Others'],
        data: [206180, 180191, 135439, 101054, 57437, 50541, 31947, 26947, 25927, 18504]
    },
    men: {
        labels: ['Lung', 'Colorectal', 'Prostate', 'Pancreas', 'Leukemia', 'Liver', 'Stomach', 'Bladder', 'Melanoma of skin', 'Others'],
        data: [350174, 162817, 142707, 152422, 68191, 52750, 43714, 36287, 31698, 25137]
    }
};

const ctxWomen = document.getElementById('womenChart').getContext('2d');
const ctxMen = document.getElementById('menChart').getContext('2d');

let womenChart = new Chart(ctxWomen, {
    type: 'pie',
    data: {
        labels: data2017.women.labels,
        datasets: [{
            label: 'Women',
            data: data2017.women.data,
            backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850', '#f39c12', '#d35400', '#1abc9c', '#2ecc71', '#95a5a6']
        }]
    },
    options: {
        title: {
            display: true,
            text: 'Cancer Types in Women'
        }
    }
});

let menChart = new Chart(ctxMen, {
    type: 'pie',
    data: {
        labels: data2017.men.labels,
        datasets: [{
            label: 'Men',
            data: data2017.men.data,
            backgroundColor: ['#8e5ea2', '#3e95cd', '#3cba9f', '#e8c3b9', '#c45850', '#f39c12', '#d35400', '#1abc9c', '#2ecc71', '#95a5a6']
        }]
    },
    options: {
        title: {
            display: true,
            text: 'Cancer Types in Men'
        }
    }
});

function updateCharts(year) {
    let data = year === '2019' ? data2019 : year === '2021' ? data2021 : data2017;

    womenChart.data.labels = data.women.labels;
    womenChart.data.datasets[0].data = data.women.data;
    womenChart.update();

    menChart.data.labels = data.men.labels;
    menChart.data.datasets[0].data = data.men.data;
    menChart.update();
}
