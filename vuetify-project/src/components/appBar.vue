<script setup>
import { getProductes } from '@/communicationManager';
import Producto from "../components/Producto.vue";
</script>

<script>
export default {
    data: () => ({
        productos: []
    }),
    mounted() {
        console.log("CREATED");
        getProductes()
            .then((data) => {
                console.log("HOla");
                this.productos = data;
                console.log(this.productos);
            })
    },
    methods: {
    }
}

</script>

<template>
    <v-layout>
        <v-app-bar color="blue">
            <v-img class="mx-2 ml-5" src="../assets/icon.png" max-height="65" max-width="65" contain></v-img>
            <v-spacer></v-spacer>

            <v-img class="mx-2 mr-10" src="../assets/user.png" max-height="40" max-width="40" contain></v-img>
        </v-app-bar>

        <v-main>
            <v-container>
                <v-form class="box-write">
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="buscar" clearable label="Producte" type="text" variant="outlined">
                                    <template v-slot:append>
                                        <v-menu>
                                            <template v-slot:activator="{ props }">
                                                <v-btn icon>
                                                    <v-icon>mdi-magnify</v-icon>
                                                </v-btn>
                                            </template>
                                        </v-menu>
                                    </template>
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
                <v-row>
                    <v-col cols="3" v-for="producto in this.productos">
                        <Producto :producto="producto" />
                    </v-col>
                </v-row>
            </v-container>
        </v-main>

    </v-layout>
</template>

<style scoped></style>