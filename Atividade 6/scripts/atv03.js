function ex03() {
    const input = document.querySelector('form#form03 input[name="in_03"]').value;
    const numbers = input.split(' ').map(Number);
    
    const parityCheck = numbers.map(num => {
        return num % 2 === 0 ? `PAR` : `ÍMPAR`;
    });
    
    document.getElementById('output').textContent = parityCheck.join(', ');
}