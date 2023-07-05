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
    console.log("---GreedyRandomized solucion---")
    console.log([res, costo])
    return [res, costo]
} 

function obtenerRandom(adyacentes){
	const randomAdyacente = Math.floor(
		Math.random() * (adyacentes.length / (adyacentes.length < 10 ? 2 : 10))) 
	return randomAdyacente
}


function busquedaLocal(solucion, matriz, vertices) {
	let peorVecindario = false
	let solucionActual = solucion
	while(!peorVecindario){ 
		let mejorSolucionVecindario = solucionActual
		for (let i = 0; i < solucion[0].length; i++) {
			const verticeSiguiente = (i + 1) % solucion[0].length
			const costoNuevo = costoIntercambio(i, verticeSiguiente, solucionActual, matriz, vertices)
			if(costoNuevo < mejorSolucionVecindario[1]){
				mejorSolucionVecindario = [swap(i, verticeSiguiente, [...solucionActual[0]]), costoNuevo]
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

function costoIntercambio(primero, segundo, solucion, matriz, vertices) {
        let listaVerticesSolucion = solucion[0]
        let verticeAnterior = listaVerticesSolucion[mod(primero - 1, solucion[0].length)]
        let costoSwapPrimero
        if (verticeAnterior === listaVerticesSolucion[primero]) {
            costoSwapPrimero = 
            (matriz[listaVerticesSolucion[mod(primero - 2, solucion[0].length)]][listaVerticesSolucion[segundo]] -
            matriz[listaVerticesSolucion[mod(primero - 2, solucion[0].length)]][verticeAnterior]) - 
            vertices[listaVerticesSolucion[primero]] + vertices[listaVerticesSolucion[segundo]]  //resto 1 aparicion de primero y sumo otra aparicion de segundo
        } else {
            costoSwapPrimero = matriz[verticeAnterior][listaVerticesSolucion[segundo]] - matriz[verticeAnterior][listaVerticesSolucion[primero]]
        }

        let verticeSiguiente = listaVerticesSolucion[mod(segundo + 1, solucion[0].length)]
        let costoSwapSegundo
        if (verticeSiguiente === listaVerticesSolucion[segundo]) {
            costoSwapSegundo = 
            (matriz[listaVerticesSolucion[primero]][listaVerticesSolucion[mod(segundo + 2, solucion[0].length)]] -
            matriz[verticeSiguiente][listaVerticesSolucion[mod(segundo + 2, solucion[0].length)]]) -
            vertices[listaVerticesSolucion[verticeSiguiente]] + vertices[listaVerticesSolucion[primero]]  //resto 1 aparicion de primero y sumo otra aparicion de second

        } else {
            costoSwapSegundo = matriz[listaVerticesSolucion[primero]][verticeSiguiente] - matriz[listaVerticesSolucion[segundo]][verticeSiguiente]
        }
        console.log("COSTO SWAP ")
        console.log("COSTO SWAP ", solucion)
        console.log(`primero ${primero} segundo ${segundo}`)
        console.log(solucion[1])
        console.log(costoSwapPrimero)
        console.log(costoSwapSegundo)

        return solucion[1] + costoSwapPrimero + costoSwapSegundo
}

function swap(primero, segundo, solucion){ //O(1)
	console.log("swap solucion")
    console.log(primero, segundo, solucion)
    const tmp1 = solucion[primero]
    const tmp2 = solucion[segundo]
    if (primero === 0) {
        solucion[primero] = tmp2
        solucion[segundo] = tmp1
        solucion[solucion.length-1] = tmp2
    } else {
        solucion[primero] = tmp2
        solucion[segundo] = tmp1
    }
    if (segundo === (solucion.length -1)) {
        solucion[primero] = tmp2
        solucion[segundo] = tmp1
        solucion[0] = tmp1

    } else {
        solucion[primero] = tmp2
        solucion[segundo] = tmp1
    }
    console.log(solucion)
	return solucion
}

function mejoroCosto(costoActual, costoNuevo){ // O(1) retorna true si la solucion nueva es mejor en un 5% o mas
	const mejoraEsperada = (costoActual * 2) / 100
	return (costoActual - costoNuevo) >= mejoraEsperada
}


function mod(n, m) {
    return ((n % m) + m) % m;
}

function grasp(iteraciones, matriz, vertices) {
    let mejorSolucion = busquedaLocal(greedyRandomized(matriz, vertices), matriz, vertices)
    let iteracion = 1
    while (iteracion < iteraciones) {
        const solucionActual = busquedaLocal(greedyRandomized(matriz, vertices), matriz, vertices)
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
    [0,3,1,5],
    [3,0,1,4],
    [1,1,0,1],
    [5,4,1,0]
]
const vertices = [4,3,5,8]

grasp(10,matrizEjemplo,vertices)
1 + 5 + 3 + 1 

[ 1, 0, 2, 3, 1 ] -> costo 1->0(3) + 0->2(1) + 2->3(1) + 3->1(5) 