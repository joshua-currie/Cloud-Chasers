// Retrieve result data from local storage
const resultDiv = document.getElementById('result');
const result = JSON.parse(localStorage.getItem('transferResult'));

if (result && result.message) {
    resultDiv.innerHTML = result.message;
} else {
    resultDiv.innerHTML = "No transfer data found.";
}

// Function to download the file from local storage
function downloadFile() {
    const fileData = localStorage.getItem('createdFile');
    if (!fileData) {
        alert('No file available for download.');
        return;
    }

    const a = document.createElement('a');
    a.href = fileData;
    a.download = localStorage.getItem('createdFileName') || 'download.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
