<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useNotifications } from '../notification.js';

export default {
    name: 'LecturaPedidos',
    setup() {
        let pedido = ref('');
        let pedidoData = ref(null);
        let error = ref(null);
        let scannedBarcode = ref('');
        let { addNotification } = useNotifications();
        let showControlButton = ref(false); // Variable para controlar la visibilidad del botón
        let usuario = ref('');

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
        });

        let fetchPedido = async () => {
            error.value = null;
            pedidoData.value = null;
            showControlButton.value = false; // Ocultar el botón al comenzar una nueva búsqueda

            try {
                let response = await fetch(`http://192.168.100.44:63644/datasnap/rest/TSrvMethods/ListaPedido/${pedido.value}`);

                // Extraer el cuerpo de la respuesta en formato JSON (o usar otro método si el formato es diferente)
                let data = await response.json();

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
                    addNotification(`Pedido ${pedido.value} cargado correctamente`, { duration: 1500, autoClose: true, fullScreen: false, type: 'success' });
                    showControlButton.value = true; // Mostrar el botón una vez cargado el pedido
                } else {
                    error.value = 'No se pudo encontrar el pedido.';
                }
            } catch (err) {
                error.value = 'Error al conectar con la API.';
            }
        };

        let processBarcode = () => {
            let barcode = scannedBarcode.value.trim();
            if (!barcode) return;

            let item = pedidoData.value.Items.find(item => item.CodBarra.trim() === barcode);
            if (item) {
                if (parseInt(item.Controlado) < parseInt(item.Cantidad)) {
                    item.Controlado = parseInt(item.Controlado) + 1;
                    if (parseInt(item.Controlado) === parseInt(item.Cantidad)) {
                        item.completed = true;
                    }
                } else {
                    addNotification(`Cantidad ya completada.`, { duration: 0, autoClose: false, fullScreen: true, type: 'danger', playSound: true });
                    // alert('Cantidad ya completada.')
                }
                scannedBarcode.value = '';
                reorderItems();
            } else {
                addNotification(`Código de barra no encontrado en el pedido.`, { duration: 0, autoClose: false, fullScreen: false, type: 'warning', playSound: true });
                // alert('Código de barra no encontrado en el pedido.')
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

        // Función para obtener la clase CSS según el nivel de vencimiento
        let getColorClass = (nivelVto) => {
            switch (nivelVto) {
                case '1':
                    return 'nivel-1';
                case '2':
                    return 'nivel-2';
                case '3':
                    return 'nivel-3';
                case '4':
                    return 'nivel-4';
                case '5':
                    return 'nivel-5';
                default:
                    return '';
            }
        };

        let controlPedido = async () => {
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
                "Factura": pedido.value,
                "Items": itemsToControl
            };

            try {
                console.log("Datos para enviar en Json de Control: ", requestData);
                // return;
                // let response = await axios.post('/api/datasnap/rest/TSrvMethods/Controlado', requestData);

                let response = await fetch('http://192.168.100.45:63644/datasnap/rest/TSrvMethods/Controlado', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // Asegúrate de especificar los encabezados necesarios
                    },
                    body: JSON.stringify(requestData) // Convierte los datos a una cadena JSON
                });

                let data = await response.json();

                if (data.Resultado === 'OK') {
                    addNotification(`Control del pedido ${pedido.value} realizado con éxito.`, { duration: 3000, autoClose: true, fullScreen: false, type: 'success' });

                    // Limpiar la pantalla y volver al formulario de búsqueda
                    pedido.value = '';
                    pedidoData.value = null;
                    scannedBarcode.value = '';
                    showControlButton.value = false;
                } else {
                    addNotification(`Error al controlar el pedido: ${response.data.Error}`, { duration: 0, autoClose: false, fullScreen: true, type: 'danger' });
                }
            } catch (err) {
                addNotification('Error al conectar con la API para controlar el pedido.', { duration: 0, autoClose: false, fullScreen: true, type: 'danger' });
            }
        };

        return {
            pedido,
            pedidoData,
            error,
            fetchPedido,
            scannedBarcode,
            processBarcode,
            getColorClass,
            showControlButton, // Añadir a los datos que retornamos
            controlPedido // Añadir la función para controlar el pedido
        };
    }
}
</script>

<template>
    <!-- <h1 class="text-center my-1 h3">Lectura de Pedidos</h1> -->

    <form v-if="!showControlButton" @submit.prevent="fetchPedido" class="my-2">
        <div class="row">
            <div class="col-6">
                <input type="text" class="form-control form-control-sm" id="pedidoInput" v-model="pedido" placeholder="Nro de Pedido" required autofocus>
            </div>
            <div class="col-6">
                <button type="submit" class="btn btn-primary btn-sm w-100">Buscar Pedido</button>
            </div>
        </div>
    </form>

    <button v-else @click="controlPedido" class="btn btn-danger btn-sm w-100 mt-2">Control Pedido</button>

    <div v-if="error" class="alert alert-danger mt-2">{{ error }}</div>

    <div v-if="pedidoData && pedidoData.Items && !error" class="mt-2">

        <div class="row mb-2">
            <div class="col-12">
                <h2 class="h5">Pedido {{ pedido }}</h2>
            </div>
            <div class="col-12">
                <input type="text" class="form-control form-control-sm" id="barcodeInput" v-model="scannedBarcode" @keyup.enter="processBarcode" placeholder="Escanear Código de Barras" autofocus required>
            </div>
        </div>

        <table class="table table-striped custom-table">
            <thead>
                <tr>
                    <th scope="col">Est</th>
                    <th scope="col">Producto</th>
                    <th scope="col">CodBar</th>
                    <th scope="col">Cant</th>
                    <!--<th scope="col">Laboratorio</th>-->
                    <th scope="col">Ctrl</th>
                    <th scope="col">Repo</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in pedidoData.Items" :key="item.NRO_ITEM" :class="{ 'table-success': item.completed }">
                    <td :class="getColorClass(item.NivelVto)">{{ item.Estanteria }}</td>
                    <td :class="getColorClass(item.NivelVto)">{{ item.Producto }}</td>
                    <td :class="getColorClass(item.NivelVto)">{{ item.CodBarra }}</td>
                    <td :class="getColorClass(item.NivelVto)">{{ item.Cantidad }}</td>
                    <!--<td>{{ item.Laboratorio }}</td>-->
                    <td :class="getColorClass(item.NivelVto)">{{ item.Controlado }}</td>
                    <td><input class="form-check-input" type="checkbox" :value="item.Repo" :id="'flexCheck' + item.CodBarra" v-model="item.Repo"></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
    .table-success {
        background-color: #4bb543;
    }

    .nivel-1 {
        color: #CC483F;
    }

    .nivel-2 {
        color: #C1B11D;
    }

    .nivel-3 {
        color: #277FFF;
    }

    .nivel-4 {
        color: #241CED;
    }

    .nivel-5 {
        color: #130C98;
    }

    .custom-table th, .custom-table td {
        padding: 0;
    }
</style>