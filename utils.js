const fs = require('fs/promises');

async function getInstanciaPrueba(path) {
  try {
    const data = await fs.readFile(path, { encoding: 'utf8' });
    let iterador = 0
    let input =[]  
    data.split(/\r?\n/).forEach(line =>  {
        input[iterador] = line
        iterador++ 
    });
    let matriz = []
    let vertices = input[iterador - 1].split(" ").map(n => Number(n))   
    const cantNodos = Number(input[0])  
    for(let i =1 ; i < cantNodos+1; i++ ) {
        matriz.push(input[i].split(" ").map(n => Number(n)))
    } 
    return {vertices, matriz}    
  } catch (err) {
    console.log(err);
  }
}

async function guardarResultado(resultado, path){
  const sol = resultado[0].map(s => `(${s.verticeOrigen},${s.verticeDestino}) `)
  await fs.writeFile(path,  `Costo Total: ${resultado[1]}, Solucion: ${sol}`)
}

module.exports = { getInstanciaPrueba, guardarResultado }