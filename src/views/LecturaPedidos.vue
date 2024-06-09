<script>
import axios from 'axios';
import { ref } from 'vue';

export default {
    name: 'LecturaPedidos',
    setup() {
        let pedido = ref('');
        let pedidoData = ref(null);
        let error = ref(null);
        let scannedBarcode = ref('');

        let fetchPedido = async () => {
            error.value = null;
            pedidoData.value = null;

            try {
                let response = await axios.get(`/api/datasnap/rest/TSrvMethods/ListaPedido/${pedido.value}`);
                if (response.data.Resultado === 'OK') {
                    console.log("Pedido ok, response.data: ", response.data)
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
                    alert('Cantidad ya completada.')
                }
                scannedBarcode.value = '';
                reorderItems();
            } else {
                alert('Código de barra no encontrado en el pedido.')
            }
        };

        let reorderItems = () => {
            pedidoData.value.Items.sort((a, b) => {
                if (a.completed && !b.completed) return 1;
                if (!a.completed && b.completed) return -1;
                return 0;
            });
        };

        return {
            pedido,
            pedidoData,
            error,
            fetchPedido,
            scannedBarcode,
            processBarcode
        };
    }
}
</script>

<template>
    <h1 class="text-center my-3">Lectura de Pedidos</h1>

    <form @submit.prevent="fetchPedido">
        <div class="mb-3">
            <label for="pedidoInput" class="form-label">Nro de Pedido</label>
            <input type="text" class="form-control" id="pedidoInput" v-model="pedido" required>
        </div>
        <button type="submit" class="btn btn-primary">Buscar Pedido</button>
    </form>

    <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>

    <div v-if="pedidoData && pedidoData.Items && !error" class="mt-3">
        <h2>Pedido {{ pedido }}</h2>

        <div class="mb-3">
            <label for="barcodeInput" class="form-label">Escanear Código de Barras</label>
            <input type="text" class="form-control" id="barcodeInput" v-model="scannedBarcode" @keyup.enter="processBarcode">
        </div>

        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Productos</th>
                    <th scope="col">Laboratorio</th>
                    <th scope="col">CodBarra</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Estanteria</th>
                    <th scope="col">Controlado</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in pedidoData.Items" :key="item.NRO_ITEM" :class="{ 'table-success': item.completed }">
                    <td>{{ item.Producto }}</td>
                    <td>{{ item.Laboratorio }}</td>
                    <td>{{ item.CodBarra }}</td>
                    <td>{{ item.Cantidad }}</td>
                    <td>{{ item.Estanteria }}</td>
                    <td>{{ item.Controlado }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style>
    .table-success {
        background-color: #4bb543 !important;
    }
</style>