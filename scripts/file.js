let createdFile = null; // Store the created file globally

// Function to create a text file based on user input
function createFile() {
    const fileName = document.getElementById('fileName').value.trim();
    const fileContents = document.getElementById('fileContents').value.trim();

    if (!fileName || !fileContents) {
        alert('Please fill out both the file name and contents.');
        return;
    }

    // Convert file content to a Blob object
    const blob = new Blob([fileContents], { type: 'text/plain' });

    // Check if the file size exceeds 1KB
    if (blob.size > 1024) {
        alert('File contents exceed 1KB. Please reduce the file size.');
        return;
    }

    // Store the file in localStorage to pass it to the order.html page
    localStorage.setItem('createdFile', JSON.stringify({ name: `${fileName}.txt`, contents: fileContents }));

    // Redirect to the order page after file creation
    window.location.href = '../pages/order.html';
}
