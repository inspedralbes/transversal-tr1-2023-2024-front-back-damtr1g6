<script setup>
import { deleteProducte, updateProducte } from '@/services/communicationManager';
</script>


<script>

export default {
    props: ["producto", "callGetProductes", "imageName"],
    data: () => ({
        modal: false,
        dialog: false,
    }),
    methods: {
        async deleteP(id) {
            await deleteProducte(id);
            this.callGetProductes();
        },
        async updateP(producte) {
            await updateProducte(JSON.stringify(producte))
            this.callGetProductes();
        }
    },
}
</script>

<template>
    <v-card style="height: 510px">
        <v-img :src="imageName" height="380px" alter="no encontrado" cover></v-img>

        <v-card-title>
            {{ producto.nombre }}
        </v-card-title>

        <v-card-subtitle>
            {{ producto.descripcion }}
        </v-card-subtitle>

        <v-card-actions icon>
            <v-card-text>{{ producto.precio }}</v-card-text>
            <v-spacer></v-spacer>
            <v-btn color="blue" variant="text" icon="mdi-delete-outline" @click="deleteP(producto.id)"></v-btn>
            <v-dialog v-model="dialog" persistent width="1024">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" class="ma-2" color="blue" icon="mdi-wrench">

                    </v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="text-h5">Producto</span>
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
                                    <v-text-field label="Descripcio*" v-model="producto.descripcion"
                                        hint="Ensalada fresca de frutas tropicales" required></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4">
                                    <v-text-field label="Imagen*" v-model="producto.imagen_url" required></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4">
                                    <v-text-field label="Stock*" v-model="producto.stock" type="number"
                                        required></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4">
                                    <v-select :items="['Disponible', 'No disponible']" label="Estado*" required
                                        v-model="producto.estado"></v-select>
                                </v-col>
                            </v-row>
                        </v-container>
                        <small>*indicates required field</small>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
                            Close
                        </v-btn>
                        <v-btn color="blue-darken-1" variant="text" @click="dialog = false; updateP(producto)">
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card-actions>

    </v-card>
</template>

<style scoped></style>
  