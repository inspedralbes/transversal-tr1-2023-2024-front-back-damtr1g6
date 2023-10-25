<script>
export default {
    data: () => ({
        show:false
    }),
    methods: {
        
    },
    mounted() {

    }
}
</script>
<template>
    <v-main class="box-recepcio-comandes">
            <v-container>
                <v-row>
                    <v-col cols="6">
                        <v-card>
                            <v-card-title>
                                Comanda
                            </v-card-title>
                            <v-card-text>
                                dinero
                            </v-card-text>

                            <v-card-actions>
                                <v-btn>ACEPTAR</v-btn>
                                <v-btn>DENEGAR</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn @click="show=!show">DETAILS</v-btn>
                            </v-card-actions>
                        </v-card>
                        <v-expand-transition>

                            <div v-if="show === true">
                                <v-card>
                                    <v-card-title>
                                        TITULO PRODUCTO
                                    </v-card-title>
                                    <v-card-text>
                                        <b>ID:</b>  <br>
                                        <b>Precio:</b> <br>
                                    </v-card-text>
                                </v-card>
                            </div>
                        </v-expand-transition>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
</template>