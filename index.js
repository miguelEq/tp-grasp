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
    matriz[verticeInicio].forEach((v,verticeDestino) => {
        if (verticeDestino != verticeInicio) {
            aristas.push({verticeOrigen:verticeInicio, verticeDestino: verticeDestino, peso:matriz[verticeInicio][verticeDestino]})
        }
    });
    return aristas; 
}

function greedyRandomized(matriz, vertices) {
    let actual = Math.floor(Math.random() * (vertices.length))  
    const visitados = new Array(vertices.length).fill(false) 
    visitados[actual] = true
    let totalVisitados = 1
    let costo = vertices[actual] //costo del vertice inicial
    let res = []
    res.push(actual)
    while (totalVisitados < vertices.length) {
        const aristas = getAristas(matriz, actual)
            .filter(arista => !visitados[arista.verticeDestino])
            .sort((a,b) => {
                return a.peso + vertices[a.verticeDestino] - b.peso + vertices[b.verticeDestino]
            })
        const siguiente = aristas[obtenerRandom(aristas)]
        res.push(siguiente.verticeDestino)
        actual = siguiente.verticeDestino
        visitados[actual] = true
        totalVisitados++
        costo += siguiente.peso + vertices[actual]
    }
    //agrego la arista que regresa al vertice inicial para completar el circuito
    const aristaInicio = res[0] 
    const aristaFin = res[res.length-1]
    res.push(aristaInicio)
    costo += matriz[aristaFin][aristaInicio] + vertices[aristaInicio]
    console.log([res, costo])
    return [res, costo]
} 

function obtenerRandom(adyacentes){
	const randomAdyacente = Math.floor(
		Math.random() * (adyacentes.length / (adyacentes.length < 10 ? 2 : 10))) 
	return randomAdyacente
}

function grasp(){
    const ejemplo = [
        [0,3,1,5],
        [3,0,1,4],
        [1,1,0,1],
        [5,4,1,0]
    ]
    const vertices = [4,3,5,8]
    greedyRandomized(ejemplo,vertices)
}
grasp()

/*
solucion greedy = 
[
  { verticeOrigen: 0, verticeDestino: 1, peso: 3 },
  { verticeOrigen: 1, verticeDestino: 2, peso: 1 },
  { verticeOrigen: 2, verticeDestino: 3, peso: 1 },
  { verticeOrigen: 3, verticeDestino: 0, peso: 5 }
] 
luego de busqueda local

[
  { verticeOrigen: 3, verticeDestino: 2, peso: 1 },
  { verticeOrigen: 2, verticeDestino: 0, peso: 1 },
  { verticeOrigen: 0, verticeDestino: 1, peso: 3 },
  { verticeOrigen: 1, verticeDestino: 3, peso: 4 }
]
 */