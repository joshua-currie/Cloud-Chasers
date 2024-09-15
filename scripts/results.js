// Retrieve result data from local storage
const resultDiv = document.getElementById('result');
const result = JSON.parse(localStorage.getItem('transferResult'));

if (result && result.message) {
    // Ensure the result message is properly displayed
    resultDiv.innerHTML = result.message;
} else {
    resultDiv.innerHTML = "No transfer data found.";
}

// Function to download the file from local storage
function downloadFile() {
    const fileData = localStorage.getItem('createdFile');
    const createdFileData = JSON.parse(localStorage.getItem('createdFile')); // Get file name

    if (!fileData || !createdFileData) {
        alert('No file available for download.');
        return;
    }

    const a = document.createElement('a');
    a.href = fileData;
    a.download = createdFileData.name || 'download.txt'; // Use the stored file name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
