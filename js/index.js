function generateRandomColor() {
    const hexCodes = '0123456789ABCDEF';

    let color = '';

    for (let i = 0; i < 6; i++) {
        color += hexCodes[Math.floor(Math.random() * hexCodes.length)]
    }

    return '#' + color;
}

function setRandomColors(isInitial = false) {
    const columns = document.querySelectorAll('.column');
    if (!columns.length) return;

    const colors = isInitial ? getColorsFromHash() : [];

    columns.forEach((column, index) => {
        const text = column.querySelector('h2');
        const button = column.querySelector('button');
        if (!text || !button) return;

        const isLocked = checkLocked(column);
        if (isLocked) {
            if (!colors[index]) colors.push(text.textContent);
            return;
        }

        const color = isInitial && colors[index] ? colors[index] : generateRandomColor();

        if (!colors[index]) colors.push(color);
        column.style.backgroundColor = color;

        text.textContent = color;
        setColor(text, color);
        setColor(button, color);
    })

    updateColorsHash(colors);
}

function setColor(element, color) {
    if (!element || !color) return;

    const luminance = chroma(color).luminance();
    element.style.color = luminance > 0.5 ? '#131313' : '#FFFAFA';
}

function checkLocked(column) {
    const icon = column.querySelector('i');

    return icon.classList.contains('fa-lock');
}

function handleTextClick(event) {
    const target = event.target;

    const text = target.closest('.palette h2');
    if (!text) return;

    const content = text.textContent;
    if (!content) return;

    copy(text.textContent);
}

function handleButtonClick(event) {
    const target = event.target;

    const lockButton = target.closest('.palette__inner button');
    if (lockButton) {
        const icon = lockButton.querySelector('i');
        if (!icon) return;

        icon.classList.toggle('fa-lock-open');
        icon.classList.toggle('fa-lock');
    }

    const generateButton = target.closest('.palette__menu button');
    if (generateButton) setRandomColors();
}

function copy(text) {
    return navigator.clipboard.writeText(text);
}

function updateColorsHash(colors = []) {
    document.location.hash = colors.map(color => {
        return color.substring(1);
    }).join('-');
}

function getColorsFromHash() {
    if (document.location.hash.length > 1) {
        return document.location.hash.substring(1).split('-').map(color => '#' + color);
    }
    return [];
}

document.addEventListener('click', handleTextClick);
document.addEventListener('click', handleButtonClick);

document.addEventListener('keydown', function(event) {
    event.preventDefault();

    if (event.code.toLowerCase() === 'space') setRandomColors();
})

document.addEventListener('DOMContentLoaded', function() {
    setRandomColors(true);
})
