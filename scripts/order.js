const azureRegions = [
    "Australia Central - Canberra", "Australia East - New South Wales", "Australia Southeast - Victoria",
    "Brazil South - Sao Paulo State", "Canada Central - Toronto, Ontario", "Canada East - Quebec City, Quebec",
    "Central India - Pune", "Central US - Iowa", "East Asia - Hong Kong",
    "East US - Virginia", "East US 2 - Virginia", "France Central - Paris",
    "Germany West Central - Frankfurt", "Israel Central - Jerusalem", "Italy North - Milan",
    "Japan East - Tokyo", "Japan West - Osaka", "Korea Central - Seoul",
    "Korea South - Busan", "Mexico Central - Mexico City", "North Central US - Illinois",
    "North Europe - Ireland", "Norway East - Oslo", "Poland Central - Warsaw",
    "Qatar Central - Doha", "South Africa North - Johannesburg", "South Central US - Texas",
    "Southeast Asia - Singapore", "Spain Central - Madrid",
    "Sweden Central - Stockholm", "Switzerland North - Zurich", "UAE North - Dubai",
    "UK South - London", "UK West - Cardiff", "West Central US - Iowa",
    "West Europe - Netherlands", "West India - Mumbai", "West US - California",
    "West US 2 - Washington", "West US 3 - Arizona"
];

const regionsDiv = document.getElementById('regions');
const selectedRegionsUl = document.getElementById('selectedRegions');
const startTransferBtn = document.getElementById('startTransferBtn');
let selectedRegions = [];

// Dynamically display region buttons
azureRegions.forEach((region, index) => {
    let button = document.createElement('button');
    button.innerText = region;
    button.setAttribute('id', `region-${index}`);
    button.onclick = function() {
        toggleRegion(region, button);
    };
    regionsDiv.appendChild(button);
});

// Function to toggle region selection
function toggleRegion(region, button) {
    const regionIndex = selectedRegions.indexOf(region);
    if (regionIndex === -1) {
        // Add region to the selected regions if not already selected
        selectedRegions.push(region);
        button.classList.add('deselected'); // Visually disable the button
    } else {
        // Remove region if it's already selected
        selectedRegions.splice(regionIndex, 1);
        button.classList.remove('deselected'); // Re-enable the button
    }

    // Update the display
    updateSelectedRegions();
}

// Function to update the selected regions display with order numbers
function updateSelectedRegions() {
    selectedRegionsUl.innerHTML = ""; // Clear current list
    selectedRegions.forEach((region, index) => {
        let li = document.createElement('li');
        li.innerText = `${index + 1}. ${region}`; // Display order number
        selectedRegionsUl.appendChild(li);
    });
}

// Function to show the modal (pop-up window)
function prepForLaunch() {
    if (selectedRegions.length === 0) {
        alert('Please select at least one region.');
        return;
    }

    // Show the modal by setting its visibility to visible
    document.getElementById('modalOverlay').style.visibility = 'visible';
}

// Function to start the file transfer
async function startTransfer() {
    const file = document.getElementById('fileInput').files[0];
    if (!file) {
        alert('Please select a file.');
        return;
    }

    // Disable the "Start Transfer" button to prevent multiple clicks
    startTransferBtn.disabled = true;
    startTransferBtn.innerText = 'Transferring...';

    // Convert the file to a Base64-encoded string
    const reader = new FileReader();
    reader.onloadend = async function() {
        try {
            const base64File = reader.result.split(',')[1]; // Get only the Base64 part

            // Create a JSON object to send the file and regions
            const requestBody = {
                fileName: file.name,
                fileData: base64File,
                regions: selectedRegions
            };

            // Make an HTTP POST request to your Azure Function
            const response = await fetch('https://cloud-chasers-function-app.azurewebsites.net/api/HttpTrigger1?code=287i66JKetVQdwEjj3hldlr1dN7j5vtjwkgw82pZgGxJAzFuoVW8gw%3D%3D', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result && result.message) {
                // Store result in local storage
                localStorage.setItem('transferResult', JSON.stringify(result));

                // Change the button to "View Results"
                startTransferBtn.innerText = 'View Results';
                startTransferBtn.disabled = false;
                startTransferBtn.onclick = function() {
                    window.location.href = '../pages/results.html';
                };
            } else {
                throw new Error('Invalid response format from Azure Function');
            }
        } catch (error) {
            console.error('Error transferring file:', error);
            document.getElementById('result').innerHTML = `
                An error occurred during the transfer.<br>
                Error message: ${error.message || error}<br>
                Please check the console for more details.
            `;

            // Re-enable the button if there's an error
            startTransferBtn.disabled = false;
            startTransferBtn.innerText = 'Start Transfer';
        }
    };

    reader.readAsDataURL(file); // Trigger the file reading process
}

// Optional: Function to close the modal if you want to add a close button
function closeModal() {
    document.getElementById('modalOverlay').style.visibility = 'hidden';
}
