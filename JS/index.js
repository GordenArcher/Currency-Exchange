const hours = document.querySelector('.hours')
const minutes = document.querySelector('.minutes')
const seconds = document.querySelector('.seconds')
const ampm = document.querySelector('.ampm')


function handleHours() {
    const getHours = new Date().getHours()
    hours.textContent = getHours

    if (hours <= 0 && hours <= 12){
        ampm.textContent = 'AM'
    }else{
        ampm.textContent = 'PM'
    }
    
}

handleHours()

function handleMinutes() {

    const getMinutes = new Date().getMinutes()

    if (getMinutes == 0){
        handleHours()
    }

    if (getMinutes >= 0 && getMinutes <= 9){
        minutes.textContent = `0${getMinutes}`
    }else{
        minutes.textContent = getMinutes
    }
    

}

handleMinutes()

function handleSeconds() {
    const getSeconds = new Date().getSeconds()

    if (getSeconds == 0){
        handleMinutes()
    }

    if (getSeconds >= 0 && getSeconds <= 9){
        seconds.textContent = `0${getSeconds}`
    }else{
        seconds.textContent = getSeconds
    }

    setTimeout((handleSeconds), 1000);

}

handleSeconds()


const convert = document.getElementById('convert');
const number_entered = document.getElementById('number_entered');
const select_currency_from = document.getElementById('select_currency_from');
const select_currency_to = document.getElementById('select_currency_to');
const display = document.getElementById('display');
const select_from = document.querySelector('.selected_fom')
const select_to = document.querySelector('.selected_to')
const validating = document.getElementById('validating')


select_currency_from.addEventListener('change', function() {
    let selectedOption = select_currency_from.options[select_currency_from.selectedIndex];
    
    select_from.innerHTML = selectedOption.textContent;
})

select_currency_to.addEventListener('change', function() {
    let selectedOption = select_currency_to.options[select_currency_to.selectedIndex];
    
    select_to.innerHTML = selectedOption.textContent;
})

convert.addEventListener('click', (event) => {
    event.preventDefault();

    convertCurrency()
    
});

function convertCurrency() {
    const fromCurrency = select_currency_from.value;
    const toCurrency = select_currency_to.value;
    const amount = parseFloat(number_entered.value);

    if (isNaN(amount)) {
        display.value = '';
        return;
    }

    fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_uhgFzszHJzYxUJG6l6RhRnWtzxixYLFHnIhAzkkS`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            const rates = data.data;
            const conversionRate = rates[toCurrency];

            if (conversionRate) {
                if (amount < 0) {
                    validating.innerHTML = 'Enter a positive number';
                    setTimeout(() => {
                        validating.innerHTML = '';
                    }, 4000);
                    display.value = '';
                } else {
                    const convertedAmount = amount * conversionRate;
                    display.value = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
                    updateChart(fromCurrency, toCurrency, amount, convertedAmount);

                    History(fromCurrency, toCurrency, amount, convertedAmount);
                }
            } else {
                validating.textContent = `Conversion rate not available for ${toCurrency}`;
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            validating.textContent = `Failed to fetch exchange rates`
        });
}


function updateChart(fromCurrency, toCurrency, amount) {
    const graph = document.getElementById('exchangeChart').getContext('2d');

    fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_uhgFzszHJzYxUJG6l6RhRnWtzxixYLFHnIhAzkkS`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const rates = data.data;
            const labels = Object.keys(rates);
            const conversionRates = Object.values(rates);

            const fromIndex = labels.indexOf(fromCurrency);
            const toIndex = labels.indexOf(toCurrency);

            if (fromIndex === -1 || toIndex === -1) {
                throw new Error('Currency not found in API response');
            }

            const exchangeRates = conversionRates.map(rate => (amount * rate).toFixed(2));

            const chartData = {
                labels: labels,
                datasets: [{
                    label: `${amount} ${fromCurrency} to ${toCurrency}`,
                    data: exchangeRates,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            };

            const chartOptions = {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            };

            const exchangeChart = graph.data ? graph : new Chart(graph, {
                type: 'line',
                data: chartData,
                options: chartOptions
            });

            exchangeChart.data = chartData;
            exchangeChart.options = chartOptions;
            exchangeChart.update();
        })
        .catch(error => {
            console.error('Error fetching data for chart:', error);
        });
}


let NumberRow = 0;

function History(fromCurrency, toCurrency, amount, convertedAmount) {
    NumberRow++;

    const tableBody = document.getElementById('table_data_display');

    const newRow = document.createElement('tr');

    const tdNumber = document.createElement('td');
    tdNumber.textContent = NumberRow;
    newRow.appendChild(tdNumber);

    const tdFromCurrency = document.createElement('td');
    tdFromCurrency.textContent = fromCurrency;
    newRow.appendChild(tdFromCurrency);

    const tdToCurrency = document.createElement('td');
    tdToCurrency.textContent = toCurrency;
    newRow.appendChild(tdToCurrency);

    const tdAmount = document.createElement('td');
    tdAmount.textContent = amount;
    newRow.appendChild(tdAmount);

    const tdConvertedAmount = document.createElement('td');
    tdConvertedAmount.textContent = convertedAmount.toFixed(2);
    newRow.appendChild(tdConvertedAmount);

    tableBody.appendChild(newRow);
}

const handleHistoryActive = () => {
    let history = document.querySelector('.history')

    history.classList.toggle('active')
}