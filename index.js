/*
vertices = [1,2,3,4]
matrizCosto = 
       0 1 2 3
    0 [0,3,1,5]
    1 [3,0,1,4]
    2 [1,1,0,1]
    3 [5,4,1,0]


verticeInicio = 0    
ciclo hamiltoniano = [
    {verticeOrigen:0, verticeDestino: 2, peso:1},
    {verticeOrigen:2, verticeDestino: 3, peso:1},
    {verticeOrigen:3, verticeDestino: 1, peso:4},
    {verticeOrigen:1, verticeDestino: 0, peso:3}
] // costo circuito sumando solo aristas = 9      

aristas = 
    {verticeOrigen:0, verticeDestino: 1, peso:3},  
    {verticeOrigen:0, verticeDestino: 2, peso:1},  
    {verticeOrigen:0, verticeDestino: 3, peso:5},  
    {verticeOrigen:1, verticeDestino: 0, peso:3},  
    {verticeOrigen:1, verticeDestino: 2, peso:1},  
    {verticeOrigen:1, verticeDestino: 3, peso:4},  
    {verticeOrigen:2, verticeDestino: 0, peso:1},  
    {verticeOrigen:2, verticeDestino: 1, peso:1},  
    {verticeOrigen:2, verticeDestino: 3, peso:1},  
    {verticeOrigen:3, verticeDestino: 0, peso:5},  
    {verticeOrigen:3, verticeDestino: 1, peso:4},  
    {verticeOrigen:3, verticeDestino: 2, peso:1},  

*/

const getAristas = (matriz, verticeInicio) => {
    let aristas = []
    matriz[verticeInicio].forEach(v => {
        if (verticeDestino != vertice) {
            aristas.push({verticeOrigen:verticeInicio, verticeDestino: verticeDestino, peso:matriz[verticeInicio][verticeDestino]})
        }
    });
    return aristas; 
}

function greedyRandomized(matriz, vertices) {
    let actual = vertices[Math.floor(Math.random() * (vertices.length))]  
    const visitados = new Array(vertices.length).fill(false); 
    visitados[actual] = true;
    let totalVisitados = 1;
    let res = []
    while (totalVisitados < vertices.length) {
        const aristas = getAristas(matriz, actual)
            .filter(arista => !visitados[arista.verticeDestino])
            .sort((a,b) => {
                return a.peso - b.peso
            })
        const siguiente = obtenerRandom(aristas)
        res.push(siguiente)
        actual = siguiente.verticeDestino
        visitados[actual] = true
        totalVisitados++
    }
    //completo el circuito agregando la arista que regresa al inicio
} 

function obtenerRandom(adyacentes){
	const randomAdyacente = Math.floor(
		Math.random() * (adyacentes.length / (adyacentes.length < 10 ? 2 : 10))) 
	return randomAdyacente
}


