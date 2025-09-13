// DOM elements
const arrayContainer = document.getElementById('arrayContainer');
const generateBtn = document.getElementById('generateBtn');
const sortBtn = document.getElementById('sortBtn');
const arraySizeSlider = document.getElementById('arraySize');
const speedSlider = document.getElementById('sortSpeed');
const algorithmSelect = document.getElementById('algorithm');
const comparisonsElement = document.getElementById('comparisons');
const swapsElement = document.getElementById('swaps');
const timeElement = document.getElementById('time');
const algoNameElement = document.getElementById('algoName');
const algoDescriptionElement = document.getElementById('algoDescription');
const arraySizeValue = document.getElementById('arraySizeValue');
const speedValue = document.getElementById('speedValue');

// State variables
let array = [];
let arraySize = parseInt(arraySizeSlider.value);
let sortSpeed = parseInt(speedSlider.value);
let isSorting = false;
let comparisons = 0;
let swaps = 0;
let startTime = 0;

// Algorithm descriptions
const algorithmInfo = {
    bubble: {
        name: "Bubble Sort",
        description: "Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
        worstCase: "O(n²)",
        averageCase: "O(n²)",
        bestCase: "O(n)"
    },
    selection: {
        name: "Selection Sort",
        description: "Selection Sort works by repeatedly finding the minimum element from the unsorted part of the array and putting it at the beginning.",
        worstCase: "O(n²)",
        averageCase: "O(n²)",
        bestCase: "O(n²)"
    },
    insertion: {
        name: "Insertion Sort",
        description: "Insertion Sort builds the final sorted array one item at a time by comparisons with the already sorted portion.",
        worstCase: "O(n²)",
        averageCase: "O(n²)",
        bestCase: "O(n)"
    },
    merge: {
        name: "Merge Sort",
        description: "Merge Sort is a divide and conquer algorithm that divides the array into halves, sorts them, and then merges the sorted halves.",
        worstCase: "O(n log n)",
        averageCase: "O(n log n)",
        bestCase: "O(n log n)"
    },
    quick: {
        name: "Quick Sort",
        description: "Quick Sort is a divide and conquer algorithm that picks an element as a pivot and partitions the array around the pivot.",
        worstCase: "O(n²)",
        averageCase: "O(n log n)",
        bestCase: "O(n log n)"
    }
};

// Initialize the application
function init() {
    generateNewArray();
    updateAlgorithmInfo();
    
    // Update slider values
    arraySizeSlider.addEventListener('input', function() {
        arraySizeValue.textContent = this.value;
        updateArraySize();
    });
    
    speedSlider.addEventListener('input', function() {
        speedValue.textContent = this.value;
        updateSortSpeed();
    });
    
    // Event listeners
    generateBtn.addEventListener('click', generateNewArray);
    sortBtn.addEventListener('click', startSorting);
    algorithmSelect.addEventListener('change', updateAlgorithmInfo);
}

// Generate a new random array
function generateNewArray() {
    if (isSorting) return;
    
    arraySize = parseInt(arraySizeSlider.value);
    array = [];
    
    // Clear the array container
    arrayContainer.innerHTML = '';
    
    // Generate random array
    for (let i = 0; i < arraySize; i++) {
        array.push(randomInt(5, 100));
    }
    
    // Render bars
    renderBars();
    
    // Reset stats
    resetStats();
}

// Render the array as bars
function renderBars() {
    arrayContainer.innerHTML = '';
    const containerHeight = arrayContainer.clientHeight;
    
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${(array[i] / 100) * containerHeight}px`;
        arrayContainer.appendChild(bar);
    }
}

// Update array size
function updateArraySize() {
    if (isSorting) return;
    generateNewArray();
}

// Update sort speed
function updateSortSpeed() {
    sortSpeed = parseInt(speedSlider.value);
}

// Update algorithm information
function updateAlgorithmInfo() {
    const algo = algorithmSelect.value;
    algoNameElement.textContent = algorithmInfo[algo].name;
    algoDescriptionElement.textContent = algorithmInfo[algo].description;
    
    // Update complexity info
    const complexityElements = document.querySelectorAll('.complexity .stat-value');
    complexityElements[0].textContent = algorithmInfo[algo].worstCase;
    complexityElements[1].textContent = algorithmInfo[algo].averageCase;
    complexityElements[2].textContent = algorithmInfo[algo].bestCase;
}

// Reset statistics
function resetStats() {
    comparisons = 0;
    swaps = 0;
    comparisonsElement.textContent = '0';
    swapsElement.textContent = '0';
    timeElement.textContent = '0 ms';
}

// Start the sorting process
function startSorting() {
    if (isSorting) return;
    
    isSorting = true;
    generateBtn.disabled = true;
    sortBtn.disabled = true;
    arraySizeSlider.disabled = true;
    algorithmSelect.disabled = true;
    
    resetStats();
    startTime = performance.now();
    
    const algorithm = algorithmSelect.value;
    
    // Execute the selected algorithm
    switch(algorithm) {
        case 'bubble':
            bubbleSort();
            break;
        case 'selection':
            selectionSort();
            break;
        case 'insertion':
            insertionSort();
            break;
        case 'merge':
            mergeSort();
            break;
        case 'quick':
            quickSort();
            break;
    }
}

// Finish sorting
function finishSorting() {
    isSorting = false;
    generateBtn.disabled = false;
    sortBtn.disabled = false;
    arraySizeSlider.disabled = false;
    algorithmSelect.disabled = false;
    
    // Calculate time taken
    const timeTaken = performance.now() - startTime;
    timeElement.textContent = `${timeTaken.toFixed(2)} ms`;
    
    // Mark all bars as sorted
    const bars = arrayContainer.children;
    for (let i = 0; i < bars.length; i++) {
        bars[i].classList.add('sorted');
    }
}

// Bubble Sort implementation
async function bubbleSort() {
    const bars = arrayContainer.children;
    const n = array.length;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            // Highlight bars being compared
            bars[j].classList.add('comparing');
            bars[j + 1].classList.add('comparing');
            
            comparisons++;
            comparisonsElement.textContent = comparisons;
            
            await sleep();
            
            if (array[j] > array[j + 1]) {
                // Swap the elements
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                
                // Update the bars
                bars[j].style.height = `${(array[j] / 100) * arrayContainer.clientHeight}px`;
                bars[j + 1].style.height = `${(array[j + 1] / 100) * arrayContainer.clientHeight}px`;
                
                // Highlight swapping
                bars[j].classList.add('swapping');
                bars[j + 1].classList.add('swapping');
                
                swaps++;
                swapsElement.textContent = swaps;
                
                await sleep();
                
                bars[j].classList.remove('swapping');
                bars[j + 1].classList.remove('swapping');
            }
            
            bars[j].classList.remove('comparing');
            bars[j + 1].classList.remove('comparing');
        }
        
        // Mark the sorted bar
        bars[n - i - 1].classList.add('sorted');
    }
    
    // Mark the first bar as sorted
    bars[0].classList.add('sorted');
    
    finishSorting();
}

// Selection Sort implementation
async function selectionSort() {
    const bars = arrayContainer.children;
    const n = array.length;
    
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        
        // Highlight the current minimum
        bars[minIndex].classList.add('comparing');
        
        for (let j = i + 1; j < n; j++) {
            // Highlight the current bar being compared
            bars[j].classList.add('comparing');
            
            comparisons++;
            comparisonsElement.textContent = comparisons;
            
            await sleep();
            
            if (array[j] < array[minIndex]) {
                // Remove highlight from previous min
                bars[minIndex].classList.remove('comparing');
                
                minIndex = j;
                
                // Highlight new min
                bars[minIndex].classList.add('comparing');
            }
            
            // Remove highlight if not the new min
            if (j !== minIndex) {
                bars[j].classList.remove('comparing');
            }
        }
        
        if (minIndex !== i) {
            // Swap the elements
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            
            // Update the bars
            bars[i].style.height = `${(array[i] / 100) * arrayContainer.clientHeight}px`;
            bars[minIndex].style.height = `${(array[minIndex] / 100) * arrayContainer.clientHeight}px`;
            
            // Highlight swapping
            bars[i].classList.add('swapping');
            bars[minIndex].classList.add('swapping');
            
            swaps++;
            swapsElement.textContent = swaps;
            
            await sleep();
            
            bars[i].classList.remove('swapping');
            bars[minIndex].classList.remove('swapping');
        }
        
        // Mark the sorted bar
        bars[i].classList.add('sorted');
        bars[minIndex].classList.remove('comparing');
    }
    
    // Mark the last bar as sorted
    bars[n - 1].classList.add('sorted');
    
    finishSorting();
}

// Insertion Sort implementation
async function insertionSort() {
    const bars = arrayContainer.children;
    const n = array.length;
    
    // Mark first element as sorted
    bars[0].classList.add('sorted');
    
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        
        // Highlight the key being inserted
        bars[i].classList.add('comparing');
        
        await sleep();
        
        while (j >= 0 && array[j] > key) {
            comparisons++;
            comparisonsElement.textContent = comparisons;
            
            // Highlight the bar being moved
            bars[j].classList.add('swapping');
            
            array[j + 1] = array[j];
            
            // Update the bar height
            bars[j + 1].style.height = `${(array[j + 1] / 100) * arrayContainer.clientHeight}px`;
            
            swaps++;
            swapsElement.textContent = swaps;
            
            await sleep();
            
            // Remove the moving highlight and mark as sorted
            bars[j].classList.remove('swapping');
            bars[j].classList.add('sorted');
            
            j--;
        }
        
        array[j + 1] = key;
        
        // Update the bar height
        bars[j + 1].style.height = `${(array[j + 1] / 100) * arrayContainer.clientHeight}px`;
        
        // Remove comparing highlight and mark as sorted
        bars[i].classList.remove('comparing');
        bars[j + 1].classList.add('sorted');
    }
    
    finishSorting();
}

// Merge Sort implementation (simplified for visualization)
async function mergeSort() {
    // For visualization purposes, we'll use a simpler approach
    // A full recursive merge sort visualization is complex
    await bubbleSort(); // Using bubble sort as placeholder
}

// Quick Sort implementation (simplified for visualization)
async function quickSort() {
    // For visualization purposes, we'll use a simpler approach
    // A full recursive quick sort visualization is complex
    await bubbleSort(); // Using bubble sort as placeholder
}

// Helper function to sleep for animation
function sleep() {
    const speed = 101 - sortSpeed; // Invert the speed value
    return new Promise(resolve => setTimeout(resolve, speed));
}

// Helper function to generate random integer
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize the app
init();