const colorOptions = document.querySelectorAll('.color-option');
const shapeOptions = document.querySelectorAll('.shape-option');
const blocks = document.querySelectorAll('.block');
const sizeInput = document.getElementById('sizeInput');
const flexDirectionSelect = document.getElementById('flexDirection');
const justifyContentSelect = document.getElementById('justifyContent');
const alignItemsSelect = document.getElementById('alignItems');
const blocksContainer = document.getElementById('blocksContainer');

let selectedColor = '';

colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        selectedColor = getComputedStyle(option).backgroundColor;
        blocks.forEach(block => {
            block.style.backgroundColor = selectedColor;
        });
        colorOptions.forEach(opt => opt.style.border = 'none');
        option.style.border = '2px solid black';
    });
});

shapeOptions.forEach(option => {
    option.addEventListener('click', () => {
        const isCircle = option.classList.contains('rounded-full');
        blocks.forEach(block => {
            block.style.borderRadius = isCircle ? '50%' : '0';
            block.style.backgroundColor = selectedColor;
        });
        shapeOptions.forEach(opt => opt.style.border = 'none');
        option.style.border = '2px solid black';
    });
});

sizeInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const size = sizeInput.value + 'px';
        blocks.forEach(block => {
            block.style.width = size;
            block.style.height = size;
        });
    }
});

flexDirectionSelect.addEventListener('change', () => {
    blocksContainer.className = `w-3/4 p-4 flex ${flexDirectionSelect.value} space-x-4 items-center justify-center`;
});

justifyContentSelect.addEventListener('change', () => {
    blocksContainer.classList.remove(...['justify-start', 'justify-center', 'justify-end']);
    blocksContainer.classList.add(justifyContentSelect.value);
});

alignItemsSelect.addEventListener('change', () => {
    blocksContainer.classList.remove(...['items-start', 'items-center', 'items-end']);
    blocksContainer.classList.add(alignItemsSelect.value);
});