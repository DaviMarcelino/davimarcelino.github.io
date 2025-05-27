function ex02() {
    const input = document.querySelector('form#form02 input[name="in_02"]').value;
    const numbers = input.split(' ').map(Number);
    
    const calculateAverage = (...args) => {
        const sum = args.reduce((acc, val) => acc + val, 0);
        return sum / args.length;
    };
    
    const average = calculateAverage(...numbers);
    document.getElementById('output').textContent = `Média: ${average.toFixed(2)}`;
}