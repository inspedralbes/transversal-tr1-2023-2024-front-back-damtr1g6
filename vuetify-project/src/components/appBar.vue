<script setup>
import { getProductes, addProducte, deleteProducte } from '@/services/communicationManager';
import { socket } from '@/services/socket';
import Producto from "../components/Producto.vue";
import ListadoComandes from "../components/ListadoComandes.vue";
import ResumComandes from "../components/ResumComandes.vue"
import RecepcioComandes from "../components/RecepcioComandes.vue"
</script>

<script>
export default {
    data: () => ({
        productos: [],
        searchProduct: [],
        producto: {
            "nombre": "",
            "descripcion": "",
            "precio": 0,
            "imagen_url": "",
            "stock": 0,
            "estado": ""
        },
        comandes: [],
        dialog: false,
        show: false,
        screen: "main",
        buscar: ""
    }),
    mounted() {
        socket.emit('getComandas', {});

        getProductes()
            .then((data) => {
                this.productos = data;
                this.searchProduct = data;
            })
    },
    methods: {
        async addProduct() {
            await addProducte(JSON.stringify(this.producto))
            getProductes()
                .then((data) => {
                    this.productos = data;
                    this.searchProduct = data;
                })
        },
        async deleteP(id) {
            await deleteProducte(id);
            getProductes()
                .then((data) => {
                    this.productos = data;
                    this.searchProduct = data;
                })
        },
        async callGetProductes() {
            getProductes()
                .then((data) => {
                    this.productos = data;
                    this.searchProduct = data;
                })
        },
        search() {
            console.log("hola");
            this.searchProduct = {};
            if (this.buscar == "") {
                this.searchProduct = this.productos;
            } else {
                this.searchProduct = this.productos.filter(producto => producto.nombre.toLowerCase().includes(this.buscar.toLowerCase()));
            }
        },
        getImageName(img) {
            return "http://localhost:3672/api/images/" + img;
        }
    }
}

</script>

<template>
    <v-layout>
        <v-app-bar color="blue">
            <v-img class="mx-2 ml-5" src="../assets/icon.png" max-height="65" max-width="65" contain
                @click="screen = 'main'" style=":hover"></v-img>
            <v-spacer></v-spacer>

            <v-btn @click="screen = 'recepcionComandes'">Recepcio comandes</v-btn>
            <v-btn @click="screen = 'listadoComandes'">Llistat comandes</v-btn>
            <v-btn @click="screen = 'resumComandes'">Resum comandes</v-btn>
            <v-img class="mx-2 mr-10" src="../assets/user.png" max-height="40" max-width="40" contain></v-img>
        </v-app-bar>

        <v-main class="box-productos" v-if="screen === 'main'">
            <v-container>
                <v-form class="box-write">
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="buscar" label="Producte" type="text" variant="outlined"
                                    @input="search()">
                                    <template v-slot:append>
                                        <v-menu>
                                            <template v-slot:activator="{ props }">
                                                <v-dialog v-model="dialog" persistent width="1024">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn v-bind="props" class="ma-2" color="indigo"
                                                            icon="mdi-plus"></v-btn>
                                                    </template>
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
                <v-row>
                    <v-col cols="12" class=" w-auto h-auto" xs="12" sm="6" md="3" lg="3"
                        v-for="producto in this.searchProduct">
                        <Producto :producto="producto" :callGetProductes="callGetProductes"
                            :imageName="getImageName(producto.imagen_url)" />
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
        <RecepcioComandes v-if="screen === 'recepcionComandes'" />
        <ListadoComandes v-if="screen === 'listadoComandes'" />
        <ResumComandes v-if="screen === 'resumComandes'" />
    </v-layout>
</template>

<style scoped></style>