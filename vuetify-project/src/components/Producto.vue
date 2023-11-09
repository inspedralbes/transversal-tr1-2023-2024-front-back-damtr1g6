<script setup>
import { deleteProducte, updateProducte } from '@/services/communicationManager';
</script>


<script>

export default {
    props: ["producto", "callGetProductes", "imageName"],
    data: () => ({
        modal: false,
        dialog: false,
        image: null,
        modalExist: false,
    }),
    methods: {
        async deleteP(id) {
            let deleted = await deleteProducte(id);

            if (!deleted) {
                this.modalExist = true;
            }
        },
        async updateP(producte, estado) {
            if(estado != undefined){
                producte.estado = estado;
            }
            await updateProducte(producte);
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            this.producto.image = file;
        },
        closeModal() {
            this.modalExist = false;
        },
    },
}
</script>

<template>
    
    <v-card style="height: 558px">
        <v-img :src="imageName" height="380px" alter="no encontrado" cover></v-img>

        <v-card-title>
            {{ producto.nombre }}
        </v-card-title>

        <v-card-subtitle>
            {{ producto.descripcion }}
        </v-card-subtitle>

        <v-card-text style="padding-bottom: 0px">
            <v-row>
                <v-col>{{ producto.precio }} €</v-col>
                <v-col class="d-flex flex-row-reverse">Stock: {{ producto.stock }}</v-col>
            </v-row>
        </v-card-text>
        <v-card-actions icon>
            <v-card-text v-if="producto.estado == 'Disponible'" class="pa-2 text-center bg-green rounded-xl ml-1 hover-estado" @click="updateP(producto, 'No disponible')">{{ producto.estado }}</v-card-text>
            <v-card-text v-else class="pa-2 text-center bg-red rounded-xl ml-1 hover-estado" @click="updateP(producto, 'Disponible')">{{ producto.estado }}</v-card-text>
            <v-spacer></v-spacer>
            <v-btn color="blue" variant="text" icon="mdi-delete-outline" @click="deleteP(producto.id)"></v-btn>
            <v-dialog v-model="dialog" persistent width="1024">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" class="ma-2" color="blue" icon="mdi-wrench">

                    </v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="text-h5">Producte</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="6" md="7">
                                    <v-text-field label="Nom producte*" v-model="producto.nombre" required></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="5">
                                    <v-text-field label="Preu*" v-model="producto.precio" type="number"
                                        required></v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <v-text-field label="Descripció*" v-model="producto.descripcion"
                                        hint="Amanida fresca de fruites tropicals" required></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4">
                                    <v-file-input accept="image/*" label="Imatge" @change="handleFileUpload"
                                        require></v-file-input>
                                </v-col>
                                <v-col cols="12" sm="4">
                                    <v-text-field label="Estoc*" v-model="producto.stock" type="number"
                                        required></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4">
                                    <v-select :items="['Disponible', 'No disponible']" label="Estat*" required
                                        v-model="producto.estado"></v-select>
                                </v-col>
                            </v-row>
                        </v-container>
                        <small>*Indica camp requerit</small>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
                            Tancar
                        </v-btn>
                        <v-btn color="blue-darken-1" variant="text" @click="dialog = false; updateP(producto)">
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="modalExist" max-width="300">
                <v-card>
                    <v-card-title class="headline"><v-icon color="warning" icon="mdi-alert"></v-icon></v-card-title>
                    <v-card-text>
                        El producte està sent utilitzat en una comanda existent.
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="closeModal" color="primary">Okey</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card-actions>
    </v-card>
</template>

<style scoped>
.hover-estado {
    transition: filter 0.3s;
}
.hover-estado:hover {
    cursor: pointer;
    filter:brightness(1.1);
}
</style>
  