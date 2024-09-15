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

    // Create a download link for the user to see the file details
    const fileInfoDiv = document.getElementById('fileInfo');
    fileInfoDiv.innerHTML = `File "${fileName}.txt" created with size ${blob.size} bytes.`;

    // Store the created file globally for the transfer process
    createdFile = new File([blob], `${fileName}.txt`, { type: 'text/plain' });

    // Show the "Start Transfer" button
    document.getElementById('startTransferBtn').classList.remove('hidden');
}

// Function to start the file transfer process
async function startTransfer() {
    if (!createdFile) {
        alert('No file created for transfer.');
        return;
    }

    // Convert the file to a Base64-encoded string
    const reader = new FileReader();
    reader.onloadend = async function() {
        const base64File = reader.result.split(',')[1]; // Get only the Base64 part

        // Create a JSON object to send the file and regions
        const requestBody = {
            fileName: createdFile.name,
            fileData: base64File,
            regions: selectedRegions // Use your selected regions here
        };

        try {
            const response = await fetch('https://cloud-chasers-function-app.azurewebsites.net/api/HttpTrigger1?code=287i66JKetVQdwEjj3hldlr1dN7j5vtjwkgw82pZgGxJAzFuoVW8gw%3D%3D', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const result = await response.json();
                localStorage.setItem('transferResult', JSON.stringify(result));
                localStorage.setItem('createdFile', reader.result); // Store the file in localStorage

                window.location.href = '../pages/results.html';
            } else {
                throw new Error('File transfer failed.');
            }
        } catch (error) {
            console.error('Error during transfer:', error);
        }
    };

    reader.readAsDataURL(createdFile); // Read the file as Base64 for the transfer
}
