function ex01() {
    const input = document.querySelector('form#form01 input[name="in_01"]').value;
    const numbers = input.split(' ').map(Number);
    
    function calculateAverage() {
        let sum = 0;
        for (let i = 0; i < arguments.length; i++) {
            sum += arguments[i];
        }
        return sum / arguments.length;
    }
    
    const average = calculateAverage(...numbers);
    document.getElementById('output').textContent = `Média: ${average.toFixed(2)}`;
}