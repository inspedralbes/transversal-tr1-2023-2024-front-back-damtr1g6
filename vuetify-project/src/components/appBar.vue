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
                        <v-card style="height: 510px;">
                            <v-img
                                src="https://img.freepik.com/fotos-premium/3d-burger-sandwich-for-social-media-post-7_351245-1478.jpg"
                                height="380px" alter="no encontrado" cover></v-img>

                            <v-card-title>
                                {{producto.nombre}}
                            </v-card-title>

                            <v-card-subtitle>
                               {{producto.precio}}
                            </v-card-subtitle>

                            <v-card-actions icon>
                                <v-btn color="orange-lighten-2" variant="text">Habilitar</v-btn>
                            </v-card-actions>

                        </v-card>
                    </v-col>

                </v-row>
            </v-container>
        </v-main>

    </v-layout>
</template>

<script>
import { getProductes } from '@/communicationManager';
export default {
    data: () => ({
        productos:[]
    }),
    created(){
        console.log("CREATED");
        getProductes()
        .then((data) =>{
            this.productos = data;
            console.log(this.productos);
        })
    },
    methods: {
    }
}

</script>

<style scoped></style>