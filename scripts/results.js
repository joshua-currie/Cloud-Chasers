// Retrieve result data from local storage
const resultDiv = document.getElementById('result');
const result = JSON.parse(localStorage.getItem('transferResult'));
const createdFileData = JSON.parse(localStorage.getItem('createdFile')); // Retrieve file details from localStorage

if (result && result.message) {
    // Display the transfer result
    resultDiv.innerHTML = result.message;
} else {
    resultDiv.innerHTML = "No transfer data found.";
}

// Function to download the file from local storage
function downloadFile() {
    const fileContents = createdFileData.contents;
    const fileName = createdFileData.name;

    if (!fileContents || !fileName) {
        alert('No file available for download.');
        return;
    }

    // Create a Blob from the file contents
    const blob = new Blob([fileContents], { type: 'text/plain' });

    // Create an object URL for the blob
    const url = URL.createObjectURL(blob);

    // Create an anchor element and trigger a download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; // Use the stored file name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Release the object URL after the download
    URL.revokeObjectURL(url);
}
