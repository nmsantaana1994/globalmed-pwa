<script>
import axios from 'axios';
import { ref } from 'vue';
import { useNotifications } from '../notification.js';

export default {
    name: 'LecturaPedidos',
    setup() {
        let pedido = ref('');
        let pedidoData = ref(null);
        let error = ref(null);
        let scannedBarcode = ref('');
        let { addNotification } = useNotifications();

        let fetchPedido = async () => {
            error.value = null;
            pedidoData.value = null;

            try {
                let response = await axios.get(`/api/datasnap/rest/TSrvMethods/ListaPedido/${pedido.value}`);
                if (response.data.Resultado === 'OK') {
                    pedidoData.value = response.data;

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

        return {
            pedido,
            pedidoData,
            error,
            fetchPedido,
            scannedBarcode,
            processBarcode,
            getColorClass
        };
    }
}
</script>

<template>
    <!-- <h1 class="text-center my-1 h3">Lectura de Pedidos</h1> -->

    <form @submit.prevent="fetchPedido" class="my-3">
        <div class="row">
            <div class="col-6">
                <!-- <label for="pedidoInput" class="form-label">Nro de Pedido</label> -->
                <input type="text" class="form-control form-control-sm" id="pedidoInput" v-model="pedido" placeholder="Nro de Pedido" required autofocus>
            </div>
            <div class="col-6">
                <button type="submit" class="btn btn-primary btn-sm w-100">Buscar Pedido</button>
            </div>
        </div>
    </form>

    <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>

    <div v-if="pedidoData && pedidoData.Items && !error" class="mt-2">

        <div class="row">
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
                    <td><input class="form-check-input" type="checkbox" value="" id='flexCheck{{ item.CodBarra }}'></td>
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