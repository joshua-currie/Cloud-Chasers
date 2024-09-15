// Retrieve result data from local storage
const resultDiv = document.getElementById('result');
const result = JSON.parse(localStorage.getItem('transferResult'));

if (result && result.message) {
    resultDiv.innerHTML = result.message;
} else {
    resultDiv.innerHTML = "No transfer data found.";
}
