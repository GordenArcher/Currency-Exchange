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

    const fromCurrency = select_currency_from.value;
    const toCurrency = select_currency_to.value;
    const amount = number_entered.value;

    console.log(amount)
    console.log(toCurrency)
    console.log(fromCurrency)

    fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_uhgFzszHJzYxUJG6l6RhRnWtzxixYLFHnIhAzkkS`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log('API Response:', data);
            const rates = data.data; 
            const conversionRate = rates[toCurrency]; 
            
            if (conversionRate) {
                const convertedAmount = amount * conversionRate;
                display.value = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
                updateChart(fromCurrency, toCurrency, amount, convertedAmount)
            } else {
                display.value = `Conversion rate not available for ${toCurrency}`;
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            display.value = `Failed to fetch exchange rates`;
        });
    
});


function updateChart(fromCurrency, toCurrency, amount, convertedAmount) {
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

            const exchangeChart = new Chart(graph, {
                type: 'line',
                data: chartData,
                options: chartOptions
            });
        })
        .catch(error => {
            console.error('Error fetching data for chart:', error);
        });
}
