const { getInstanciaPrueba } = require("./utils");

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
    let costo = 0 
    let res = []
    while (totalVisitados < vertices.length) {
        const aristas = getAristas(matriz, actual)
            .filter(arista => !visitados[arista.verticeDestino])
            .sort((a,b) => {
                return a.peso - b.peso
            })
        const arista = aristas[obtenerRandom(aristas)]
        res.push(arista)
        actual = arista.verticeDestino
        visitados[actual] = true
        totalVisitados++
        costo += arista.peso + vertices[arista.verticeOrigen]
    }
    //agrego la arista que regresa al vertice inicial para completar el circuito
    const ultimoVertice = res[res.length-1].verticeDestino 
    const verticeInicio = res[0].verticeOrigen
    const aristaCompletaCircuito = {
        verticeOrigen:ultimoVertice,
        verticeDestino: verticeInicio,
        peso:matriz[ultimoVertice][verticeInicio]
    }
    res.push(aristaCompletaCircuito)
    costo += aristaCompletaCircuito.peso + vertices[aristaCompletaCircuito.verticeOrigen]
    console.log("Resultado Greddy randomized")
    console.log([res, costo])
    return [res, costo]
} 

function obtenerRandom(adyacentes){ //me quedo con el primero entre el 10%
	const randomAdyacente = Math.floor(
		Math.random() * (adyacentes.length / (adyacentes.length < 10 ? 2 : 10))) 
	return randomAdyacente
}


function busquedaLocal(solucion, matriz) {
	let peorVecindario = false
	let solucionActual = solucion
    console.log("Busqueda Local")
	while(!peorVecindario){ 
		let mejorSolucionVecindario = solucionActual
		for (let i = 0; i < solucion[0].length; i++) {
            const { solucionNueva, nuevoCosto } = swapArista(i, solucion, matriz) 
			if(nuevoCosto < mejorSolucionVecindario[1]){
				mejorSolucionVecindario = [solucionNueva, nuevoCosto]
			}
		}
		if(!mejoroCosto(solucionActual[1], mejorSolucionVecindario[1])){
			if(solucionActual[1] > mejorSolucionVecindario[1]){
				solucionActual = mejorSolucionVecindario
			}
			peorVecindario = true
		} else {
			solucionActual = mejorSolucionVecindario
		}
	}
	return solucionActual
}

function swapArista(posArista, solucion, matriz) {
    const aristasSolucion = solucion[0] 
    const costoSolucion = solucion[1] 
    let posAristaAnterior = mod(posArista - 1, aristasSolucion.length)
    let posAristaSiguiente = mod(posArista + 1, aristasSolucion.length)
    const swapArista = {
        verticeOrigen: aristasSolucion[posArista].verticeDestino,
        verticeDestino: aristasSolucion[posArista].verticeOrigen,
        peso: aristasSolucion[posArista].peso
    }

    let swapAristaAnterior = {
        verticeOrigen: aristasSolucion[posAristaAnterior].verticeOrigen,
        verticeDestino: swapArista.verticeOrigen
    }
    swapAristaAnterior.peso = matriz[swapAristaAnterior.verticeOrigen][swapAristaAnterior.verticeDestino]

    let swapAristaSiguiente = {
        verticeOrigen: swapArista.verticeDestino,
        verticeDestino: aristasSolucion[posAristaSiguiente].verticeDestino
    }
    swapAristaSiguiente.peso =  matriz[swapAristaSiguiente.verticeOrigen][swapAristaSiguiente.verticeDestino]
    
    let aristasSolucionConSwap = [...aristasSolucion]
    aristasSolucionConSwap[posArista] = swapArista
    aristasSolucionConSwap[posAristaAnterior] = swapAristaAnterior
    aristasSolucionConSwap[posAristaSiguiente] = swapAristaSiguiente
    const nuevoCosto = costoSolucion 
        + (swapAristaAnterior.peso - aristasSolucion[posAristaAnterior].peso) 
        + (swapAristaSiguiente.peso - aristasSolucion[posAristaSiguiente].peso)
    console.log({solucionNueva: aristasSolucionConSwap, nuevoCosto:nuevoCosto, posAristaASwapear:posArista})    
    return {solucionNueva: aristasSolucionConSwap, nuevoCosto:nuevoCosto}
}

function mejoroCosto(costoActual, costoNuevo){ // retorna true si la solucion nueva es mejor en un 5% o mas
	const mejoraEsperada = (costoActual * 2) / 100
	return (costoActual - costoNuevo) >= mejoraEsperada
}


function mod(n, m) {
    return ((n % m) + m) % m;
}

function grasp(iteraciones, matriz, vertices) {
    let mejorSolucion = busquedaLocal(greedyRandomized(matriz, vertices), matriz)
    let iteracion = 1
    while (iteracion < iteraciones) {
        const solucionActual = busquedaLocal(greedyRandomized(matriz, vertices), matriz)
        if (mejorSolucion[1] > solucionActual[1]) {
            mejorSolucion = solucionActual
            console.log("Iteracion: ", iteracion, "Costo Total: ", mejorSolucion)
        }
        iteracion++ 
    }
    console.log("SOLUCION FINAL :")
    console.log("Circuito ", mejorSolucion[0])
    console.log("Costo Circuito ", mejorSolucion[1])
    return mejorSolucion
}

const matrizEjemplo = [
    [0,2,3,1],
    [2,0,4,2],
    [3,4,0,5],
    [1,2,5,0]
]
const vertices = [7,5,4,6]

async function main(pathInstancia) {
    const { vertices, matriz } = await getInstanciaPrueba(pathInstancia)
    grasp(1,matriz,vertices) 
} 
main('./instancias/test_graph_10.txt')