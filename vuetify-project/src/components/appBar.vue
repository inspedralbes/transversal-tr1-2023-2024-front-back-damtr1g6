<script setup>
import { getProductes, addProducte, deleteProducte } from '@/communicationManager';
import Producto from "../components/Producto.vue";
import ListadoComandes from "../components/ListadoComandes.vue";
import RecepcioComandes from "../components/RecepcioComandes.vue"
</script>

<script>
export default {
    data: () => ({
        productos: [],
        producto: {
            nombre: "",
            descripcion: "",
            precio: 0,
            imagen_url: "",
            stock: 0,
            estado: ""
        },
        comandes: [],
        dialog: false,
        show: false,
        modal: false,  // Propiedad para controlar la apertura del modal
        images: [],
        loadingImages: false,
    }),
    created() {
        this.loadImages();
        console.log("Rutas de imágenes en la aplicación Vue: ", this.images);

    },
    mounted() {
        getProductes()
            .then((data) => {
                this.productos = data;
            });
    },
    methods: {
        async addProduct() {
            await addProducte(JSON.stringify(this.producto));
            getProductes()
                .then((data) => {
                    this.productos = data;
                });
        },
        async deleteP(id) {
            await deleteProducte(id);
            getProductes()
                .then((data) => {
                    this.productos = data;
                });
        },
        async callGetProductes() {
            getProductes()
                .then((data) => {
                    this.productos = data;
                });
        },
        openModal() {
            this.modal = true;
        },
        loadImages() {
            var urlStats = "http://localhost:3672/estadisticas"
            this.loadingImages = true;

            // Realiza una solicitud HTTP para obtener las imágenes desde tu servidor
            // Asegúrate de ajustar la URL de la solicitud GET según tu configuración de ruta en el servidor.
            fetch(urlStats)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Error al cargar las imágenes');
                    }
                    return response.json();
                })
                .then((data) => {
                    // En este punto, puedes actualizar el estado 'images' con los datos de las imágenes.
                    // this.images = [
                    //     { "id": 1, "url": '/informes/estatComandes.png' },
                    //     { "id": 2, "url": '/informes/estatProd.png' },
                    //     { "id": 3, "url": '/informes/prodVSvendida.png' },
                    //     { "id": 4, "url": '/informes/quantComand.png' },
                    //     { "id": 5, "url": '/informes/quantProd.png' },
                    //     { "id": 6, "url": '/informes/stock.png' },
                    // ];
                    this.images = data.images.map(image => image.url); // Asegúrate de que se almacenan como cadenas

                    this.loadingImages = false;

                })
                .catch((error) => {
                    this.loadingImages = false;

                    //console.error(error);
                });
        },
        handleImageError(event) {
            console.error("Error al cargar la imagen:", event.target.src);
            // Puedes mostrar un mensaje de error o tomar otras medidas aquí
        }
    },

}
</script>
<template>
    <v-layout>
        <v-app-bar color="blue">
            <v-img class="mx-2 ml-5" src="../assets/icon.png" max-height="65" max-width="65" contain></v-img>
            <v-spacer></v-spacer>

            <v-img class="mx-2 mr-10" src="../assets/user.png" max-height="40" max-width="40" contain></v-img>
        </v-app-bar>

        <v-main class="box-productos">
            <v-container>
                <v-form class="box-write">
                    <v-container>

                        <v-row>
                            <!-- El largo de la barra de busqueda -->
                            <v-col cols="12">
                                <v-text-field v-model="buscar" clearable label="Producte" type="text" variant="outlined">
                                    <template v-slot:append>
                                        <v-menu>
                                            <template v-slot:activator="{ props }">
                                                <v-btn icon>
                                                    <v-icon>mdi-magnify</v-icon>
                                                </v-btn>
                                                <!-- MODAL INFORMES -->
                                                <v-btn @click="openModal">Informes</v-btn>
                                                <v-dialog v-model="modal" max-width="600">
                                                    <v-carousel>
                                                        <v-carousel-item v-for="(image, index) in images" :key="index">
                                                            <img :src="image" alt="Imagen" @error="handleImageError">
                                                        </v-carousel-item>
                                                    </v-carousel>
                                                </v-dialog>
                                                <!-- Add product icon -->
                                                <v-dialog v-model="dialog" persistent width="1024">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn v-bind="props" class="ma-2" color="indigo"
                                                            icon="mdi-cloud-upload">
                                                        </v-btn>
                                                    </template>

                                                    <!-- Modal add -->
                                                    <v-card>
                                                        <v-card-title>
                                                            <span class="text-h5">Producto</span>
                                                        </v-card-title>
                                                        <v-card-text>
                                                            <v-container>
                                                                <v-row>
                                                                    <v-col cols="12" sm="6" md="7">
                                                                        <v-text-field label="Nom producte*"
                                                                            v-model="producto.nombre"
                                                                            required></v-text-field>
                                                                    </v-col>
                                                                    <v-col cols="12" sm="6" md="5">
                                                                        <v-text-field label="Preu*"
                                                                            v-model="producto.precio" type="number"
                                                                            required></v-text-field>
                                                                    </v-col>

                                                                    <v-col cols="12">
                                                                        <v-text-field label="Descripcio*"
                                                                            v-model="producto.descripcion"
                                                                            hint="Ensalada fresca de frutas tropicales"
                                                                            required></v-text-field>
                                                                    </v-col>
                                                                    <v-col cols="12" sm="4">
                                                                        <v-text-field label="Imagen*"
                                                                            v-model="producto.imagen_url"
                                                                            required></v-text-field>
                                                                    </v-col>
                                                                    <v-col cols="12" sm="4">
                                                                        <v-text-field label="Stock*"
                                                                            v-model="producto.stock" type="number"
                                                                            required></v-text-field>
                                                                    </v-col>
                                                                    <v-col cols="12" sm="4">
                                                                        <v-select :items="['Disponible', 'No disponible']"
                                                                            label="Estado*" required
                                                                            v-model="producto.estado"></v-select>
                                                                    </v-col>
                                                                </v-row>
                                                            </v-container>
                                                            <small>*indicates required field</small>
                                                        </v-card-text>
                                                        <v-card-actions>
                                                            <v-spacer></v-spacer>
                                                            <v-btn color="blue-darken-1" variant="text"
                                                                @click="dialog = false">
                                                                Close
                                                            </v-btn>
                                                            <v-btn color="blue-darken-1" variant="text"
                                                                @click="dialog = false; addProduct()">
                                                                Save
                                                            </v-btn>
                                                        </v-card-actions>
                                                    </v-card>
                                                </v-dialog>
                                            </template>
                                        </v-menu>
                                    </template>

                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
                <!-- all products -->
                <v-row>
                    <v-col cols="12" class=" w-auto h-auto" xs="12" sm="6" md="3" lg="3" v-for="producto in this.productos">
                        <Producto :producto="producto" :callGetProductes="callGetProductes" />
                    </v-col>
                </v-row>
            </v-container>
        </v-main>

        <ListadoComandes v-if="false" />

        <RecepcioComandes />


    </v-layout>
</template>

<style scoped></style>