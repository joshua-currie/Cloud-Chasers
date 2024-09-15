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

// Load file data from localStorage (from file.html)
let createdFileData = JSON.parse(localStorage.getItem('createdFile'));
if (!createdFileData) {
    alert("No file data found. Please create a file first.");
    window.location.href = '../pages/file.html'; // Redirect if no file is found
}

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
    const { name, contents } = createdFileData;

    // Convert the file contents to a Base64-encoded string
    const blob = new Blob([contents], { type: 'text/plain' });
    const reader = new FileReader();
    reader.onloadend = async function() {
        const base64File = reader.result.split(',')[1]; // Get only the Base64 part

        const requestBody = {
            fileName: name,
            fileData: base64File,
            regions: selectedRegions
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

                // Make sure result is correctly stored in localStorage
                localStorage.setItem('transferResult', JSON.stringify(result));

                // Change button to "View Results"
                startTransferBtn.innerText = 'View Results';
                startTransferBtn.disabled = false;
                startTransferBtn.onclick = function() {
                    window.location.href = '../pages/results.html';
                };
            } else {
                throw new Error('File transfer failed.');
            }
        } catch (error) {
            console.error('Error during transfer:', error);
            document.getElementById('result').innerHTML = `
                An error occurred during the transfer.<br>
                Error message: ${error.message || error}<br>
                Please check the console for more details.
            `;

            startTransferBtn.disabled = false;
            startTransferBtn.innerText = 'Start Transfer';
        }
    };

    reader.readAsDataURL(blob); // Read the file as Base64 for the transfer
}

// Animation steps
const animations = [
    { label: 'Preparing route...', url: '../animations/map-animation.json' },
    { label: 'Creating file...', url: '../animations/file-animation.json' },
    { label: 'Integrating timer...', url: '../animations/timer-animation.json' }
];

// Function to show the modal and start animations
function prepForLaunch() {
    if (selectedRegions.length === 0) {
        alert('Please select at least one region.');
        return;
    }

    // Show the modal by setting its visibility to visible
    document.getElementById('modalOverlay').style.visibility = 'visible';

    // Start playing the animations in sequence
    playAnimations();
}

// Function to play Lottie animations in sequence
function playAnimations() {
    const animationLabel = document.getElementById('animationLabel');
    const animationContainer = document.getElementById('animationContainer');
    
    let currentAnimation = 0;

    // Function to play a single animation and move to the next one
    function playNextAnimation() {
        if (currentAnimation >= animations.length) {
            // After all animations, show the ready text and launch button
            animationLabel.innerText = "Ready whenever you are";
            animationContainer.innerHTML = ''; // Clear the animation container
            document.getElementById('launchTransferBtn').classList.remove('hidden');
            return;
        }

        // Set the label for the current animation
        animationLabel.innerText = animations[currentAnimation].label;

        // Clear the previous animation
        animationContainer.innerHTML = '';

        // Load the current animation in the container
        lottie.loadAnimation({
            container: animationContainer,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: animations[currentAnimation].url
        }).addEventListener('complete', function() {
            // Move to the next animation after the current one completes
            currentAnimation++;
            playNextAnimation();
        });
    }

    // Start the first animation
    playNextAnimation();
}
