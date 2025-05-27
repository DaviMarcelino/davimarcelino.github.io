function ex05() {
    const input = document.querySelector('form#form05 input[name="in_05"]').value;
    
    try {
        const jsonData = JSON.parse(input);
        
        function createObjectFromJSON(data) {
            const obj = {};
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    obj[key] = data[key];
                }
            }
            return obj;
        }
        
        const obj = createObjectFromJSON(jsonData);
        
        let output = '';
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                output += `${key}: ${obj[key]} `;
            }
        }
        
        document.getElementById('output').textContent = output.trim();
    } catch (e) {
        document.getElementById('output').textContent = 'JSON inválido!';
    }
}