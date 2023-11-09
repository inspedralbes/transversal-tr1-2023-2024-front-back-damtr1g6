<script setup>
import { loginUser, addProducte, deleteProducte } from '@/services/communicationManager';
import { socket, state } from '@/services/socket';
import Producto from "../components/Producto.vue";
import ListadoComandes from "../components/ListadoComandes.vue";
import ResumComandes from "../components/ResumComandes.vue";
import RecepcioComandes from "../components/RecepcioComandes.vue";
import DialogoEnviar from "../components/DialogoEnviar.vue";
</script>

<script>
export default {
    data: () => ({
        searchProduct: [],
        producto: {
            "nombre": "",
            "descripcion": "",
            "precio": 0,
            "stock": 0,
            "estado": "",
            "image": "",
        },
        usuario: {
            "usuario": "",
            "passwd": "",
        },
        comandes: [],
        dialog: false,
        showConfirmation: false,
        show: false,
        screen: "login",
        appBar:false,
        buscar: "",
        images: [],
        dialogSend: false,
        dialogSendMessage: "",
    }),
    mounted() {
        socket.emit('getComandas', {});
        socket.emit('getProductes', {});

    },
    computed: {
        productes() {
            this.searchProduct = state.productes[0];
        }
    },
    methods: {
        async addProduct() {
            this.dialogSend = true;
            this.dialogSendMessage = "loading";
            let response = await addProducte(this.producto);

            this.producto = {
                "nombre": "",
                "descripcion": "",
                "precio": 0,
                "stock": 0,
                "estado": "",
                "image": "",
            };

            this.showConfirmation = true;
            if (response.message == undefined) {
                this.dialogSendMessage = "";
            } else {
                this.dialogSendMessage = "error";
            }
        },
        async deleteP(id) {
            await deleteProducte(id);
        },
        search() {
            this.searchProduct = {};
            if (this.buscar == "") {
                this.searchProduct = state.productes[0]
            } else {
                this.searchProduct = state.productes[0].filter(producto => producto.nombre.toLowerCase().includes(this.buscar.toLowerCase()));
            }
        },
        getImageName(img) {
            return "http://localhost:3672/api/images/" + img;
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            this.producto.image = file;
        }, getGraphics(img) {
            return "http://localhost:3672/api/graphics/" + img;
        },
        openModal() {
            this.modal = true;
        },
        onSubmit() {
            console.log(this.usuario);
            loginUser(this.usuario)
                .then(data => {
                    console.log(data);
                    if (data.rol == 'Administrador' && data.autoritzacio) {
                        this.screen = 'main';
                        this.appBar = true
                    } else{
                        console.log("Equivocado");
                    }
                })
        },
        updateDialogSend(newValue) {
            this.dialogSend = newValue;
        }
    }
}

</script>

<template>
    <v-layout>
        <v-main v-if="screen === 'login'">
            <v-container class="d-flex justify-center align-center" style="height: 100vh;">
                <v-card class="mx-auto px-8 py-10 elevation-10" min-width="450">
                    <v-img class="mx-auto d-block" src="../assets/icon.png" max-height="95" max-width="95" contain></v-img>
                    <v-form v-model="form" @submit.prevent="onSubmit">
                        <v-text-field v-model="usuario.usuario" required class="mb-2"
                            clearable label="Usuari"></v-text-field>

                        <v-text-field type="password" v-model="usuario.passwd" required
                            clearable label="Contrassenya"></v-text-field>

                        <br>

                        <v-btn block color="success" size="large" type="submit" variant="elevated">
                            Log in
                        </v-btn>
                    </v-form>
                </v-card>
            </v-container>
        </v-main>

        <v-app-bar color="blue" v-if="appBar">
                <v-img class="mx-2 ml-5 hover-icon" src="../assets/icon.png" max-height="65" max-width="65" contain
                    @click="screen = 'main'"></v-img>
                <v-spacer></v-spacer>

                <v-btn @click="screen = 'recepcionComandes'">Recepcio comandes</v-btn>
                <v-btn @click="screen = 'listadoComandes'">Llistat comandes</v-btn>
                <v-btn @click="screen = 'resumComandes'">Resum comandes</v-btn>
                <v-btn @click="openModal">Informes</v-btn>
                <v-dialog v-model="modal" max-width="600">
                    <v-carousel>
                        <v-carousel-item v-for="(image, index) in images" :key="index">
                            <img :src="image" alt="Imagen" @error="handleImageError">
                        </v-carousel-item>
                    </v-carousel>
                </v-dialog>
                </v-app-bar>

        <v-main class="box-productos" v-if="screen === 'main'">
            <v-container>
                <DialogoEnviar :dialogSend="dialogSend" :dialogSendMessage="dialogSendMessage"
                    :updateDialogSend="updateDialogSend" />
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
                                                                        <v-file-input accept="image/*" label="Image"
                                                                            @change="handleFileUpload"
                                                                            require></v-file-input>

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
                    <v-col cols="12" class=" w-auto h-auto" xs="12" sm="6" md="3" lg="3" v-if="buscar.length == 0"
                        v-for="producto in state.productes[0]">
                        <Producto :producto="producto" :imageName="getImageName(producto.imagen_url)" />
                    </v-col>
                    <v-col cols="12" class=" w-auto h-auto" xs="12" sm="6" md="3" lg="3" v-else
                        v-for="producto in this.searchProduct">
                        <Producto :producto="producto" :imageName="getImageName(producto.imagen_url)" />
                    </v-col>
                </v-row>
            </v-container>
        </v-main>

        <RecepcioComandes v-if="screen === 'recepcionComandes'" />
        <ListadoComandes v-if="screen === 'listadoComandes'" />
        <ResumComandes v-if="screen === 'resumComandes'" />
    </v-layout>
</template>

<style scoped>
.hover-icon {
    transition: filter 0.3s;
}
.hover-icon:hover {
    cursor: pointer;
    filter:brightness(0.6);
}
</style>