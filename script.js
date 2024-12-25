document.getElementById('allocateMemory').addEventListener('click', function() {
    const processesInput = document.getElementById('processes').value;
    const algorithm = document.getElementById('algorithm').value;

    if (!processesInput) {
        alert("Please enter process sizes.");
        return;
    }

    const processes = processesInput.split(',').map(p => parseInt(p.trim()));

    if (processes.some(p => isNaN(p))) {
        alert("Please enter valid process sizes.");
        return;
    }

    // Define memory blocks (for simulation purposes)
    const memoryBlocks = [300, 500, 700, 400, 800, 600];
    
    let allocatedMemory = [];
    switch (algorithm) {
        case 'firstFit':
            allocatedMemory = firstFit(memoryBlocks, processes);
            break;
        case 'bestFit':
            allocatedMemory = bestFit(memoryBlocks, processes);
            break;
        case 'worstFit':
            allocatedMemory = worstFit(memoryBlocks, processes);
            break;
    }

    visualizeMemoryAllocation(memoryBlocks, allocatedMemory);
});

function firstFit(memoryBlocks, processes) {
    let allocatedMemory = [];
    let memoryCopy = [...memoryBlocks];
    
    processes.forEach(process => {
        let allocated = false;
        for (let i = 0; i < memoryCopy.length; i++) {
            if (memoryCopy[i] >= process) {
                allocatedMemory.push({ process, block: memoryCopy[i] });
                memoryCopy[i] -= process;
                allocated = true;
                break;
            }
        }
        if (!allocated) allocatedMemory.push({ process, block: -1 });
    });

    return allocatedMemory;
}

function bestFit(memoryBlocks, processes) {
    let allocatedMemory = [];
    let memoryCopy = [...memoryBlocks];

    processes.forEach(process => {
        let bestFitBlock = -1;
        let minDiff = Infinity;
        for (let i = 0; i < memoryCopy.length; i++) {
            if (memoryCopy[i] >= process && (memoryCopy[i] - process) < minDiff) {
                bestFitBlock = i;
                minDiff = memoryCopy[i] - process;
            }
        }
        if (bestFitBlock !== -1) {
            allocatedMemory.push({ process, block: memoryCopy[bestFitBlock] });
            memoryCopy[bestFitBlock] -= process;
        } else {
            allocatedMemory.push({ process, block: -1 });
        }
    });

    return allocatedMemory;
}

function worstFit(memoryBlocks, processes) {
    let allocatedMemory = [];
    let memoryCopy = [...memoryBlocks];

    processes.forEach(process => {
        let worstFitBlock = -1;
        let maxDiff = -Infinity;
        for (let i = 0; i < memoryCopy.length; i++) {
            if (memoryCopy[i] >= process && (memoryCopy[i] - process) > maxDiff) {
                worstFitBlock = i;
                maxDiff = memoryCopy[i] - process;
            }
        }
        if (worstFitBlock !== -1) {
            allocatedMemory.push({ process, block: memoryCopy[worstFitBlock] });
            memoryCopy[worstFitBlock] -= process;
        } else {
            allocatedMemory.push({ process, block: -1 });
        }
    });

    return allocatedMemory;
}

function visualizeMemoryAllocation(memoryBlocks, allocatedMemory) {
    const memoryContainer = document.getElementById('memoryContainer');
    const allocatedMemoryContainer = document.getElementById('allocatedMemoryContainer');

    memoryContainer.innerHTML = '';
    allocatedMemoryContainer.innerHTML = '';

    // Display available memory blocks
    memoryBlocks.forEach(block => {
        const memoryBlockDiv = document.createElement('div');
        memoryBlockDiv.classList.add('memoryBlock', 'availableBlock');
        memoryBlockDiv.innerText = `Block Size: ${block}`;
        memoryContainer.appendChild(memoryBlockDiv);
    });

    // Display allocated memory
    allocatedMemory.forEach(item => {
        const memoryBlockDiv = document.createElement('div');
        memoryBlockDiv.classList.add('memoryBlock');
        if (item.block === -1) {
            memoryBlockDiv.classList.add('notAllocated');
            memoryBlockDiv.innerText = `Process ${item.process} - Not Allocated`;
        } else {
            memoryBlockDiv.innerText = `Process ${item.process} allocated to block ${item.block}`;
            if (item.block === 300) memoryBlockDiv.classList.add('firstFit');
            else if (item.block === 500) memoryBlockDiv.classList.add('bestFit');
            else memoryBlockDiv.classList.add('worstFit');
        }
        allocatedMemoryContainer.appendChild(memoryBlockDiv);
    });
}
