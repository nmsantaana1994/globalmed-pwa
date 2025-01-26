<script>
import { ref, inject, onMounted, nextTick, watch } from 'vue';
import { useNotifications } from '../notification.js';

export default {
    name: 'LecturaPedidos',
    setup() {
        let apiConfig = inject('apiConfig'); // Inyectar configuración global
        let pedido = ref('');
        let pedidoInputRef = ref(null); // Ref para el input de número de pedido
        let pedidoData = ref(null);
        let error = ref(null);
        let scannedBarcode = ref('');
        let barcodeInputRef = ref(null); // Ref para el input de escaneo
        let { addNotification } = useNotifications();
        let showControlButton = ref(false); // Variable para controlar la visibilidad del botón
        let usuario = ref('');
        let continuarPedidoVisible = ref(false); // Controla la visibilidad del botón "Continuar Pedido Actual"
        let isProcessing = ref(false); // Estado para controlar si el botón está deshabilitado
        let pedidoActual = 0;


        // Recuperamos el valor de 'usuario' del localStorage
        onMounted(() => {
            let sessionData = localStorage.getItem('session');
            if (sessionData) {
                try {
                    let parsedSessionData = JSON.parse(sessionData);
                    usuario.value = parsedSessionData.usuario || ''; // Asigna el valor del usuario o una cadena vacía
                    console.log("Data session LocalStorage usuario: ", usuario.value);
                } catch (e) {
                    console.error('Error parsing session data from localStorage:', e);
                }
            }

            if (localStorage.getItem('pedidoActual')) {
                continuarPedidoVisible.value = true; // Mostrar botón "Continuar Pedido Actual"
            }
        });

        // Recuperar datos de pedido desde LocalStorage
        let cargarPedidoLocalStorage = () => {
            // Deshabilitar el botón al inicio
            isProcessing.value = true;
            let pedidoGuardado = localStorage.getItem('pedidoActual');
            if (pedidoGuardado) {
                try {
                    let parsedPedido = JSON.parse(pedidoGuardado);
                    pedidoData.value = parsedPedido.pedidoData;
                    pedido.value = parsedPedido.pedido;
                    pedidoActual = pedido.value;
                    addNotification(`Pedido ${pedido.value} cargado desde almacenamiento local.`, { duration: 1500, autoClose: true, fullScreen: true, type: 'info' });
                    continuarPedidoVisible.value = false; // Ocultar botón tras cargar
                    reorderItems();
                    showControlButton.value = true; // Mostrar el botón una vez cargado el pedido
                } catch (error) {
                    console.error('Error al parsear el pedido desde LocalStorage:', error);
                    addNotification(`Error al cargar pedido desde almacenamiento local.`, { duration: 0, autoClose: false, fullScreen: true, type: 'danger' });
                } finally {
                    isProcessing.value = false;
                }
            }
        };

        // Guardar datos del pedido en LocalStorage
        let guardarPedidoEnLocalStorage = () => {
            let pedidoAGuardar = {
                pedido: pedido.value,
                pedidoData: pedidoData.value,
            };
            console.log("guardarPedidoEnLocalStorage(): ", pedidoAGuardar);
            localStorage.setItem('pedidoActual', JSON.stringify(pedidoAGuardar));
        };


        let fetchPedido = async () => {
            error.value = null;
            pedidoData.value = null;
            showControlButton.value = false; // Ocultar el botón al comenzar una nueva búsqueda

            try {
                pedidoActual = pedido.value;
                // Deshabilitar el botón al inicio
                isProcessing.value = true;

                let response = await fetch(`${apiConfig.ApiBaseUrl}/datasnap/rest/TSrvMethods/ListaPedido/${pedidoActual}`);

                // Extraer el cuerpo de la respuesta en formato JSON (o usar otro método si el formato es diferente)
                let data = await response.json();

                console.log("Response: ", response);
                console.log("Response data: ", data);

                if (data.Resultado === 'OK') {
                    pedidoData.value = data;

                    console.log("ListaPedido API: ", pedidoData.value);

                    // Marcar ítems completados y reordenar al cargar los datos
                    pedidoData.value.Items.forEach(item => {
                        item.Controlado = parseInt(item.Controlado); // Asegurarse de que Controlado es un número
                        item.Cantidad = parseInt(item.Cantidad); // Asegurarse de que Cantidad es un número
                        if (item.Controlado === item.Cantidad) {
                            item.completed = true;
                        }
                    });
                    reorderItems();
                    guardarPedidoEnLocalStorage();
                    addNotification(`Pedido ${pedidoActual} cargado correctamente`, { duration: 1500, autoClose: true, fullScreen: true, type: 'success' });
                    showControlButton.value = true; // Mostrar el botón una vez cargado el pedido

                    // Enfocar automáticamente en el input de escaneo de código de barras
                    nextTick(() => {
                        if (barcodeInputRef.value) {
                            barcodeInputRef.value.focus();
                        }
                    });
                } else {
                    console.log("pedidoActual else fetchPedido() value: ", pedidoActual);
                    // throw error;
                    // addNotification(`Pedido ${pedido.value} cargado correctamente`, { duration: 1500, autoClose: true, fullScreen: true, type: 'success' });
                    error.value = data.Resultado;
                    addNotification(`${error.value}`, { duration: 0, autoClose: true, fullScreen: true, type: 'danger', });
                    pedido.value = null;
                    pedidoActual = null;
                    // Enfocar automáticamente en el input de escaneo de código de barras
                    nextTick(() => {
                        if (pedido.value) {
                            pedido.value.focus();
                        }
                    });
                }
            } catch (err) {
                // throw err;
                error.value = 'Error al conectar con la API.';
            } finally {
                // Habilitar el botón después de completar la operación
                isProcessing.value = false;
            }
        };

        let processBarcode = () => {
            let barcode = scannedBarcode.value.trim();
            if (!barcode) return;

            let item = pedidoData.value.Items.find(item => item.CodBarra.trim() === barcode || item.CodBarraAlt.trim() === barcode);
            if (item) {
                if (parseInt(item.Controlado) < parseInt(item.Cantidad)) {
                    item.Controlado = parseInt(item.Controlado) + 1;
                    if (parseInt(item.Controlado) === parseInt(item.Cantidad)) {
                        item.completed = true;
                    }
                } else {
                    addNotification(`Cantidad ya completada.`, { duration: 0, autoClose: false, fullScreen: true, type: 'danger', playSound: true });
                    scannedBarcode.value = '';
                }
                scannedBarcode.value = '';
                reorderItems();
                guardarPedidoEnLocalStorage();
            } else {
                addNotification(`Código de barra no encontrado en el pedido.`, { duration: 0, autoClose: false, fullScreen: true, type: 'warning', playSound: true });
                scannedBarcode.value = '';
            }
        };

        // Función para reordenar los ítems, moviendo los completados al final
        let reorderItems = () => {
            pedidoData.value.Items.sort((a, b) => {
                if (a.completed && !b.completed) return 1;
                if (!a.completed && b.completed) return -1;
                
                if (a.Estanteria < b.Estanteria) return -1;
                if (a.Estanteria > b.Estanteria) return 1;
                return 0;
            });
        };

        function convertToHex(color) {
            return `#${Number(color).toString(16).padStart(6, '0')}`;
        }


        let controlPedido = async () => {
            // Deshabilitar el botón al inicio
            isProcessing.value = true;

            let itemsToControl = pedidoData.value.Items.map(item => {
                return {
                    "NRO_SUBDI": item.NRO_SUBDI,
                    "NRO_ITEM": item.NRO_ITEM,
                    "Producto": item.Producto,
                    "Laboratorio": item.Laboratorio,
                    "CodBarra": item.CodBarra,
                    "CodBarraAlt": item.CodBarraAlt,
                    "Cantidad": item.Cantidad,
                    "Corte": item.Corte,
                    "Packs": item.Packs,
                    "Estanteria": item.Estanteria,
                    "Estante": item.Estante,
                    "Controlado": item.Controlado,
                    "Repo": document.getElementById(`flexCheck${item.CodBarra}`).checked // Obtener el estado del checkbox
                };
            });

            let requestData = {
                "Usuario": usuario.value,
                "Factura": pedidoActual,
                "Items": itemsToControl
            };

            try {
                console.log("Datos para enviar en Json de Control: ", requestData);
                // return;
                // let response = await axios.post('/api/datasnap/rest/TSrvMethods/Controlado', requestData);

                let response = await fetch(`${apiConfig.ApiBaseUrl}/datasnap/rest/TSrvMethods/Controlado`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // Asegúrate de especificar los encabezados necesarios
                    },
                    body: JSON.stringify(requestData) // Convierte los datos a una cadena JSON
                });

                let data = await response.json();

                if (data.Resultado === 'OK') {
                    addNotification(`Control del pedido ${pedidoActual} realizado con éxito.`, { duration: 3000, autoClose: true, fullScreen: true, type: 'success' });

                    // Limpiar la pantalla y volver al formulario de búsqueda
                    localStorage.removeItem('pedidoActual');
                    pedido.value = '';
                    pedidoActual = null;
                    pedidoData.value = null;
                    scannedBarcode.value = '';
                    showControlButton.value = false;

                    // Enfocar automáticamente en el input de número de pedido
                    nextTick(() => {
                        if (pedidoInputRef.value) {
                            pedidoInputRef.value.focus();
                        }
                    });
                } else {
                    addNotification(`Error al controlar el pedido: ${response.data.Error}`, { duration: 0, autoClose: false, fullScreen: true, type: 'danger' });
                }
            } catch (err) {
                addNotification('Error al conectar con la API para controlar el pedido.', { duration: 0, autoClose: false, fullScreen: true, type: 'danger' });
            } finally {
                // Habilitar el botón después de completar la operación
                isProcessing.value = false;
            }
        };

        return {
            pedido,
            pedidoData,
            error,
            fetchPedido,
            scannedBarcode,
            processBarcode,
            barcodeInputRef, // Retorna la referencia
            pedidoInputRef, // Retorna la referencia
            convertToHex,
            showControlButton, // Añadir a los datos que retornamos
            controlPedido, // Añadir la función para controlar el pedido
            continuarPedidoVisible,
            cargarPedidoLocalStorage,
            isProcessing,
        };
    }
}
</script>

<template>
    <!-- <h1 class="text-center my-1 h3">Lectura de Pedidos</h1> -->

    <form v-if="!showControlButton" @submit.prevent="fetchPedido" class="my-2">
        <div class="row">
            <div class="col-6">
                <input type="text" class="form-control form-control-sm" id="pedidoInput" v-model="pedido" placeholder="Nro de Pedido" required autofocus ref="pedidoInputRef">
            </div>
            <div class="col-6">
                <button type="submit" class="btn btn-primary btn-sm w-100" :disabled="isProcessing">{{ isProcessing ? 'Procesando...' : 'Buscar Pedido' }}</button>
            </div>
        </div>
    </form>

    <!-- Botón "Continuar Pedido Actual" -->
    <div v-if="continuarPedidoVisible && !showControlButton" class="my-2 text-center">
        <button @click="cargarPedidoLocalStorage" class="btn btn-secondary btn-sm" :disabled="isProcessing">{{ isProcessing ? 'Procesando...' : 'Continuar Pedido Actual' }}</button>
    </div>


    <!-- <button v-else @click="controlPedido" class="btn btn-danger btn-sm w-100 mt-2">Control Pedido</button> -->

    <!-- <div v-if="error" class="alert alert-danger mt-2">{{ error }}</div> -->

    <div v-if="pedidoData && pedidoData.Items && !error" class="mt-2">

        <div class="row mb-2">
            <div class="col-5">
                <!-- <input type="text" class="form-control form-control-sm" id="barcodeInput" v-model="scannedBarcode" @keyup.enter="processBarcode" placeholder="Escanear Código de Barras" autofocus required> -->
                <input type="text" class="form-control form-control-sm" id="barcodeInput" v-model="scannedBarcode" @keyup.enter="processBarcode" placeholder="Escanear Código de Barras" required ref="barcodeInputRef"> <!-- Añade la referencia aquí -->
            </div>
            <div class="col-4 d-flex align-items-center justify-content-center">
                <p class="h6 m-0 fw-bold text-center">Pedido {{ pedido }}</p>
            </div>
            <div class="col-3">
                <!-- Botón "Control Pedido" aquí, visible sólo cuando `showControlButton` es verdadero -->
                <!-- <button v-if="showControlButton" @click="controlPedido" class="btn btn-danger btn-sm w-100">Control Pedido</button> -->
                <button 
                    v-if="showControlButton"
                    @click="controlPedido" 
                    :disabled="isProcessing" 
                    class="btn btn-danger btn-sm w-100"
                    >
                    {{ isProcessing ? 'Procesando...' : 'Controlar Pedido' }}
                </button>
            </div>
        </div>

        <!-- <div class="table-responsive"> -->
            <table class="table table-striped custom-table">
                <thead>
                    <tr>
                        
                        <th scope="col" style="width: 60px;" >Est</th>
                        <th scope="col" >Producto</th>
                        <th scope="col" >CodBar</th>
                        <th scope="col" class="ps-3 text-right" style="width: 40px;">Cant</th>
                        <!--<th scope="col">Laboratorio</th>-->
                        <th scope="col"  class="ps-3 text-right" style="width: 40px;">Ctrl</th>
                        <th scope="col"  class="ps-3 pe-1 text-right" style="width: 40px;">Repo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in pedidoData.Items" :key="item.NRO_ITEM" :class="{ 'table-success': item.completed }">
                        <td class="nivel" :style="{ '--dynamic-color': convertToHex(item.ColorVto) }">{{ item.Estanteria }}</td>
                        <td class="col-prod nivel" :style="{ '--dynamic-color': convertToHex(item.ColorVto) }">{{ item.Producto }}</td>
                        <!-- <td class="nivel" :style="{ '--dynamic-color': convertToHex(item.ColorVto) }">{{ item.CodBarra }}</td> -->
                        <td class="nivel" :style="{ '--dynamic-color': convertToHex(item.ColorVto) }">{{ item.CodBarra.slice(-4) }}</td>
                        <td class="text-right pe-1 nivel" :style="{ '--dynamic-color': convertToHex(item.ColorVto) }">{{ item.Cantidad }}</td>
                        <!--<td>{{ item.Laboratorio }}</td>-->
                        <td class="text-right pe-1 nivel" :style="{ '--dynamic-color': convertToHex(item.ColorVto) }">{{ item.Controlado }}</td>
                        <td class="text-right pe-1"><input class="form-check-input" type="checkbox" :value="item.Repo" :id="'flexCheck' + item.CodBarra" v-model="item.Repo"></td>
                    </tr>
                </tbody>
            </table>
        <!-- </div> -->
    </div>
</template>

<style scoped>
    .table-success {
        background-color: #4bb543;
    }

    .nivel {
        color: var(--dynamic-color, #000); /* Default to black */
    }

    .custom-table th, .custom-table td {
        padding: 0;
        /* white-space: nowrap; Evita que el contenido se divida en varias líneas */
        /* overflow: hidden; */
        text-overflow: ellipsis; /* Agrega puntos suspensivos si el texto es demasiado largo */
    }

    /* .col-prod{
        text-overflow: ellipsis !important;
    } */
    
    .custom-table .text-right {
        text-align: right; /* Alinear a la derecha */
    }


    /* .custom-table .text-center {
        text-align: center;
    } */
</style>