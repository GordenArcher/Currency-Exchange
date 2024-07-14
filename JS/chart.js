alert()

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