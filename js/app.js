let cliente ={
    mesa:'',
    hora:'',
    pedido:[]
}

const categorias ={
    1:'Comida',
    2:'Bebidas',
    3:'Postres'
}

btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click',guardarCliente);


function guardarCliente(){
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    //Revisar si hay campos vacios
    const camposVacios = [mesa, hora].some(campos => campos === '');

    if(camposVacios){
        //verificar si ya hay una alerta
        const existeAlerta = document.querySelector('.invalid-feedback');

        if(!existeAlerta){
            const alerta = document.createElement('div');
            alerta.classList.add('invalid-feedback','d-block','text-center');
            alerta.textContent = 'Todos los campos son obligatorios';
            document.querySelector('.modal-body form').appendChild(alerta);

            //eliminar nuestra alerta
            setTimeout(()=>{
                alerta.remove();
            },3000);
        }
        return;
    }
    //asignar datos a formulario a cliente
    cliente = {...cliente,mesa,hora}

    //ocultar modal
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();

    mostrarSecciones();

    //obtener platillos de la API de JSON-Server
    obtenerPlatillos();
}

function mostrarSecciones (){
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));

}

function obtenerPlatillos(){
    const url = 'http://localhost:4000/platillos';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then (resultado => mostrarPlatillos(resultado))
        .catch(error => console.log(error));
}

function mostrarPlatillos (platillos){
    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach(platillo =>{
        const row = document.createElement('div');
        row.classList.add('row','py-3','border-top');

        const nombre = document.createElement('div');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('div');
        precio.classList.add('col-md-3','fw-bold');
        precio.textContent = `$ ${platillo.precio}`;

        const categoria = document.createElement('div');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platillo.categoria];

        const inputCantidad = document.createElement('input');
        inputCantidad.type ='number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');

        // Funcion que detecta la cantidad y el platillo que se esta agregando
        inputCantidad.onchange = function(){
            const cantidad = parseInt(inputCantidad.value);
            agregarPlatillo({...platillo,cantidad});
        };

        const agregar = document.createElement('div');
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);

        contenido.appendChild(row);
    })

}

function agregarPlatillo(producto){

    //extraer el pedido actual
    let {pedido} = cliente;
    // revisar que la cantidad  sea mayo a 0
    if(producto.cantidad > 0){
        //comprueba si un elemento existe en el array
        if( pedido.some(articulo => articulo.id === producto.id)){
            // el articulo ya existe, actualizar la cantidad
            const pedidoActualizado = pedido.map(articulo=>{
              if(articulo.id === producto.id){
                  articulo.cantidad = producto.cantidad;             
                 }  
                 return articulo;
            });
            // se asigna el nuevo array a cliente.pedido
            cliente.pedido = [...pedidoActualizado];
        } else{
            // el articulo no existe, lo agregamos al array de pedido
            cliente.pedido=[...pedido,producto];
        }

    }else{
        // eliminar elementos cuando la cantidad es 0
        const resultado = pedido.filter( articulo => articulo.id !== producto.id);
        cliente.pedido = [...resultado];
    }

    //limpiar el codigo html previo
    limpiarHTML();

    if(cliente.pedido.length){
        //mostrar el resumen
        actualizarResumen();
    }else{
        mensajePedidoVacio();
    }

}

function actualizarResumen(){
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6','card','py-2','px-3','shadow');

    //informacion de la mesa
    const mesa = document.createElement('p');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('span');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    //informacion de la hora
    const hora = document.createElement('p');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('span');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    //agregar a los elementos padres
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    //titulo de la seccion
    const heading=document.createElement('h3');
    heading.textContent='Platillos Consumidos';
    heading.classList.add('my-4','text-center');

    //iterar sobre el arrau de pedidos
    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');

    const {pedido}= cliente;
    pedido.forEach(articulo=>{
        const {nombre, cantidad,precio,id}=articulo;
        const lista = document.createElement('li');  
        lista.classList.add('list-group-item');  

        const nombreEL = document.createElement('h4');
        nombreEL.classList.add('my-4');
        nombreEL.textContent = nombre;   
        
        //cantidad del articulo
        const cantidadEL = document.createElement('p');
        cantidadEL.classList.add('fw-bold');
        cantidadEL.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('span');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

         //precio del articulo
         const precioEL = document.createElement('p');
         precioEL.classList.add('fw-bold');
         precioEL.textContent = 'Precio: ';
 
         const precioValor = document.createElement('span');
         precioValor.classList.add('fw-normal');
         precioValor.textContent = `$ ${precio}`;

         //subtotal del articulo
         const subtotalEL = document.createElement('p');
         subtotalEL.classList.add('fw-bold');
         subtotalEL.textContent = 'Subtotal: ';
 
         const subtotalValor = document.createElement('span');
         subtotalValor.classList.add('fw-normal');
         subtotalValor.textContent = calcularSubtotal(precio, cantidad);

         //boton eliminar
         const btnEliminar = document.createElement('button');
         btnEliminar.classList.add('btn','btn-danger');
         btnEliminar.textContent= 'Eliminar del pedido';

         //funcion para eliminar del pedido
         btnEliminar.onclick = function (){
             eliminarProducto(id);
         }

            //agregar valores a sus contenedores
            cantidadEL.appendChild(cantidadValor);
            precioEL.appendChild(precioValor);
            subtotalEL.appendChild(subtotalValor);

            //agregar elementos al li
            lista.appendChild(nombreEL);
            lista.appendChild(cantidadEL);
            lista.appendChild(precioEL);
            lista.appendChild(subtotalEL);
            lista.appendChild(btnEliminar);

            //agregar lista al grupo principal
            grupo.appendChild(lista);
    });

    //agregar al contenido
    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    //mostrar formulario de propinas
    formularioPropinas();

}

function limpiarHTML(){
    const contenido = document.querySelector('#resumen .contenido');

    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild);
    }
}

function calcularSubtotal(precio,cantidad){
    return `$ ${precio * cantidad}`;
}

function eliminarProducto(id){
    const {pedido} = cliente;
    const resultado = pedido.filter( articulo => articulo.id !== id);
    cliente.pedido = [...resultado];

    
    //limpiar el codigo html previo
    limpiarHTML();

    
    if(cliente.pedido.length){
        //mostrar el resumen
        actualizarResumen();
    }else{
        mensajePedidoVacio();
    }

    // el producto se elimino por lo tanto regresamos la cantidad a 0 en el formulario
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;
}

function mensajePedidoVacio(){
    const contenido = document.querySelector('#resumen .contenido');

    const texto = document.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos del pedido';

    contenido.appendChild(texto);

}

function formularioPropinas(){
    const contenido = document.querySelector('#resumen .contenido');

    const formulario = document.createElement('div');

    formulario.classList.add('col-md-6','formulario');

    const divFormulario = document.createElement('div');
    divFormulario.classList.add('card','py-2','px-3','shadow');

    const heading = document.createElement('h3');
    heading.classList.add('my-4','text-center');
    heading.textContent = 'Propina';

    //radio button 10%
    const radio10 = document.createElement('input');
    radio10.type = 'radio';
    radio10.name ='propina';
    radio10.value = '10';
    radio10.classList.add('form-check-input');
    radio10.onclick = calcularPropina;

    const radio10Label = document.createElement('label');
    radio10Label.textContent = '10%';
    radio10Label.classList.add('form-check-label');

    const radio10Div = document.createElement('div');
    radio10Div.classList.add('form-check');

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    //radio button 25%
    const radio25 = document.createElement('input');
    radio25.type = 'radio';
    radio25.name ='propina';
    radio25.value = '25';
    radio25.classList.add('form-check-input');
    radio25.onclick = calcularPropina;

    const radio25Label = document.createElement('label');
    radio25Label.textContent = '25%';
    radio25Label.classList.add('form-check-label');

    const radio25Div = document.createElement('div');
    radio25Div.classList.add('form-check');

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);

    //radio button 50%
    const radio50 = document.createElement('input');
    radio50.type = 'radio';
    radio50.name ='propina';
    radio50.value = '50';
    radio50.classList.add('form-check-input');
    radio50.onclick = calcularPropina;

    const radio50Label = document.createElement('label');
    radio50Label.textContent = '50%';
    radio50Label.classList.add('form-check-label');

    const radio50Div = document.createElement('div');
    radio50Div.classList.add('form-check');

    radio50Div.appendChild(radio50);
    radio50Div.appendChild(radio50Label);

    //agregar al div principal
    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio25Div);
    divFormulario.appendChild(radio50Div);

    //agregar al formulario
    formulario.appendChild(divFormulario);
    contenido.appendChild(formulario);


}

function calcularPropina(){
    const {pedido} = cliente;
    let subtotal = 0;

    //calcular el subtotal a pagar
    pedido.forEach(articulo=>{
        subtotal += articulo.cantidad * articulo.precio;
    });

    //seleccionar el radio button con la propina del cliente
    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;

    //calcular la propina
    const propina = ((subtotal * parseInt(propinaSeleccionada))/100);

    //calcular el total a pagar
    const total = subtotal + propina;

    mostrarTotalHTML(subtotal,total,propina);
}

function mostrarTotalHTML(subtotal,total,propina){

    const divTotales = document.createElement('div');
    divTotales.classList.add('total-pagar','my-5');

    //subtotal
    const subtotalParrafo = document.createElement('p');
    subtotalParrafo.classList.add('fs-4','fw-bold','mt-2');
    subtotalParrafo.textContent = 'Subtotal Consumo : ';

    const subtotalSpan = document.createElement('span');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$${subtotal}`;

    subtotalParrafo.appendChild(subtotalSpan);

    //propina
    const propinaParrafo = document.createElement('p');
    propinaParrafo.classList.add('fs-4','fw-bold','mt-2');
    propinaParrafo.textContent = 'Propina: ';

    const propinaSpan = document.createElement('span');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `$${propina}`;

    propinaParrafo.appendChild(propinaSpan);

    
    //total
    const totalParrafo = document.createElement('p');
    totalParrafo.classList.add('fs-4','fw-bold','mt-2');
    totalParrafo.textContent = 'Total a pagar : ';

    const totalSpan = document.createElement('span');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `$${total}`;

    totalParrafo.appendChild(totalSpan);

    //eliminar el ultimo resultado
    const totalpagarDiv = document.querySelector('.total-pagar');

    if(totalpagarDiv){
        totalpagarDiv.remove();
    }

    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);

    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild(divTotales);
}