function ex04() {
    const input = document.querySelector('form#form04 input[name="in_04"]').value;
    const numbers = input.split(' ').map(Number);
    
    function isPerfectNumber(num) {
        if (num <= 1) return false;
        
        let sum = 1; // 1 é divisor universal
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) {
                sum += i;
                const complement = num / i;
                if (complement !== i) {
                    sum += complement;
                }
            }
        }
        return sum === num;
    }
    
    const perfectNumbers = numbers.filter(isPerfectNumber);
    document.getElementById('output').textContent = 
        perfectNumbers.length > 0 
            ? `Números perfeito!` 
            : 'Número imperfeito!';
}