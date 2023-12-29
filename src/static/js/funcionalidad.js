//PONER EL JS PARA EL FUNCIONAMIENTO DE LA PÁGINA 
src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
integrity = "sha384-pzjw8SPg5AqAF+GOvYIUnQg3b7dyjYqSUGxw8WQU8vg+0F3/BFrtA0vExMqdjBC3"
crossorigin = "anonymous"


document.addEventListener('DOMContentLoaded', function () {
    var buttonIr = document.getElementById('button-ir');
    /**
     * BOTON CLAVE
     */
    var buttonCalcular = document.getElementById('button-calcular');
    var resultadoElemento = document.getElementById('resultadoobtenido');
    var tablaCuerpo = document.getElementById('tablaVariables');
    var resultadorRemplazado = document.getElementById('input-hint');
    var resultadoCalculado = document.getElementById('resultadoCalculado');
    var pasosCalculo = document.getElementById('pasosCalculo');


    // Función para limpiar el contenido
    function limpiarContenido() {
        resultadorRemplazado.textContent = '';
        pasosCalculo.innerHTML = '';
        resultadoCalculado.innerHTML = '';
    }

    buttonIr.addEventListener('click', function () {
        // Limpiar el contenido de los resultados y la resolución paso a paso
        // resultadorRemplazado.textContent = '';
        // pasosCalculo.innerHTML = '';
        // resultadoCalculado.innerHTML = '';
        tablaCuerpo.innerHTML = '';
        limpiarContenido();

        var expresionMatematica = document.getElementById('expresionMatematica').value;
        var letrasUnicas = [...new Set(expresionMatematica.match(/[a-zA-Z]/g))];

        resultadoElemento.textContent = 'Expresión matemática ingresada: ' + expresionMatematica;
        resultadoElemento.innerHTML += '<br>Variables utilizadas: ' + letrasUnicas.join(', ');

        letrasUnicas.forEach(function (letra, index) {
            var nuevaFila = document.createElement('tr');
            nuevaFila.innerHTML = `
                        <td>${letra}</td>
                        <td>0</td>
                        <td>
                            <button type="button" class="btn btn-custom" data-toggle="modal"
                                data-target="#editModal" onclick="abrirModal(${index})">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                        </td>
                    `;
            tablaCuerpo.appendChild(nuevaFila);
        });
    });

    // Evento al hacer clic en el botón "Calcular"
    buttonCalcular.addEventListener('click', function () {
        limpiarContenido();

        // Obtener la expresión matemática ingresada
        var expresionMatematica = document.getElementById('expresionMatematica').value;
        var filas = document.querySelectorAll('table tbody tr');


        // Iterar sobre cada fila de la tabla
        filas.forEach(function (fila) {
            var letra = fila.cells[0].textContent;
            var valor = fila.cells[1].textContent;


            // Agregar asterisco (*) entre letras y números si es necesario
            expresionMatematica = expresionMatematica.replace(/([a-zA-Z]+)([0-9]+)/g, '$1*$2');
            expresionMatematica = expresionMatematica.replace(/([0-9]+)([a-zA-Z]+)/g, '$1*$2');

            // Sustituir el valor de la variable en la expresión
            // expresionMatematica = expresionMatematica.replace(new RegExp(letra, 'g'), valor);
            expresionMatematica = expresionMatematica.replace(new RegExp('(^|[^.0-9])' + letra + '($|[^.0-9])', 'g'), '$1' + valor + '$2');

        });
        try {

            // Mostrar el ejercicio con valores reemplazados
            resultadorRemplazado.textContent = 'Expresión después de las sustituciones: ' + expresionMatematica;

            // Limpiar el contenido de pasosCalculo antes de cada clic
            pasosCalculo.innerHTML = '';

            // Mostrar la expresión original
            pasosCalculo.innerHTML += `<strong>Expresión original:</strong> ${expresionMatematica}<br><br>`;

            // Resolver la expresión paso a paso
            resolverExpresionPasoAPaso(expresionMatematica);

            // Mostrar el resultado final redondeado a tres decimales
            var resultadoFinal = eval(expresionMatematica);
            resultadoFinal = Math.round(resultadoFinal * 1000) / 1000; // Redondear a tres decimales

            // Determinar si el resultado final es un entero o decimal
            var tipoResultadoFinal = Number.isInteger(resultadoFinal) ? 'int' : 'double';

            // resultadoCalculado.innerHTML = `<strong></strong> ${expresionMatematica} = ${resultadoFinal} (Tipo de dato: ${tipoResultadoFinal})`;

            resultadoCalculado.innerHTML = `<strong></strong> ${expresionMatematica} = ${resultadoFinal} (Tipo de dato: ${tipoResultadoFinal})`;
        } catch (error) {
            // Mostrar mensaje de error
            resultadoCalculado.innerHTML = `<strong>Error:</strong> La expresión ingresada es inválida. Por favor, verifica la sintaxis.`;
            pasosCalculo.innerHTML = ''; // Limpiar los pasos en caso de error
        }
    });

    function resolverExpresionPasoAPaso(expresion) {
        var pasosHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Paso</th>
                        <th scope="col">Expresión</th>
                        <th scope="col">Operación</th>
                        <th scope="col">Resultado</th>
                        <th scope="col">Tipo</th>
                    </tr>
                </thead>
                <tbody>`;

        var paso = 1;

        // Paso 1: Resolver paréntesis
        while (expresion.includes('(')) {
            var expParentesis = expresion.match(/\([^()]+\)/)[0];
            var resultadoParentesis = eval(expParentesis.slice(1, -1));
            resultadoParentesis = Math.round(resultadoParentesis * 1000) / 1000; // Redondear a tres decimales
            var tipoResultado = Number.isInteger(resultadoParentesis) ? 'int' : 'double';
            pasosHTML += `<tr>
                            <td>${paso++}</td>
                            <td>${expParentesis}</td>
                            <td>Asociación</td>
                            <td>${resultadoParentesis}</td>
                            <td>${tipoResultado}</td>
                        </tr>`;
            expresion = expresion.replace(expParentesis, resultadoParentesis);
        }

        // Paso 2: Resolver exponentes
        while (expresion.includes('^')) {
            var expExponente = expresion.match(/\d+\^\d+/)[0];
            var resultadoExponente = eval(expExponente.replace('^', '**'));
            resultadoExponente = Math.round(resultadoExponente * 1000) / 1000; // Redondear a tres decimales
            var tipoResultadoExponente = Number.isInteger(resultadoExponente) ? 'int' : 'double';
            pasosHTML += `<tr>
                            <td>${paso++}</td>
                            <td>${expExponente}</td>
                            <td>Exponente</td>
                            <td>${resultadoExponente}</td>
                            <td>${tipoResultadoExponente}</td>
                        </tr>`;
            expresion = expresion.replace(expExponente, resultadoExponente);
        }

        // Paso 3: Resolver multiplicación y división
        while (expresion.match(/(-?\d+\.*\d*)[\/*](-?\d+\.*\d*)/)) {
            var expMultiplicacionDivision = expresion.match(/(-?\d+\.*\d*)[\/*](-?\d+\.*\d*)/)[0];
            var resultadoMultiplicacionDivision = eval(expMultiplicacionDivision);
            resultadoMultiplicacionDivision = Math.round(resultadoMultiplicacionDivision * 1000) / 1000; // Redondear a tres decimales
            var tipoResultadoMultiplicacionDivision = Number.isInteger(resultadoMultiplicacionDivision) ? 'int' : 'double';
            var operacion = expMultiplicacionDivision.includes('*') ? 'Multiplicación' : 'División';
            pasosHTML += `<tr>
                            <td>${paso++}</td>
                            <td>${expMultiplicacionDivision}</td>
                            <td>${operacion}</td>
                            <td>${resultadoMultiplicacionDivision}</td>
                            <td>${tipoResultadoMultiplicacionDivision}</td>
                        </tr>`;
            expresion = expresion.replace(expMultiplicacionDivision, resultadoMultiplicacionDivision);
        }

        // Paso 4: Resolver suma y resta
        while (expresion.match(/(-?\d+\.*\d*)[+\-](-?\d+\.*\d*)/)) {
            var expSumaResta = expresion.match(/(-?\d+\.*\d*)[+\-](-?\d+\.*\d*)/)[0];
            var resultadoSumaResta = eval(expSumaResta);
            resultadoSumaResta = Math.round(resultadoSumaResta * 1000) / 1000; // Redondear a tres decimales
            var tipoResultadoSumaResta = Number.isInteger(resultadoSumaResta) ? 'int' : 'double';
            var operacion = expSumaResta.includes('+') ? 'Suma' : 'Resta';
            pasosHTML += `<tr>
                            <td>${paso++}</td>
                            <td>${expSumaResta}</td>
                            <td>${operacion}</td>
                            <td>${resultadoSumaResta}</td>
                            <td>${tipoResultadoSumaResta}</td>
                        </tr>`;
            expresion = expresion.replace(expSumaResta, resultadoSumaResta);
        }

        // Cerrar la tabla
        pasosHTML += `</tbody></table>`;

        // Mostrar los pasos en pasosCalculo
        pasosCalculo.innerHTML = pasosHTML;
    }

});
// Función para abrir el modal de edición
function abrirModal(index) {
    var fila = document.querySelectorAll('table tbody tr')[index];
    var valorActual = fila.cells[1].textContent;

    document.getElementById('variableValue').value = valorActual;
    $('#editModal').data('targetRow', fila);
    $('#editModal').modal('show');
}
// Función para guardar cambios en el modal de edición
function guardarCambios() {
    var nuevoValor = document.getElementById('variableValue').value;
    var fila = $('#editModal').data('targetRow');
    fila.cells[1].textContent = nuevoValor;
    $('#editModal').modal('hide');
}