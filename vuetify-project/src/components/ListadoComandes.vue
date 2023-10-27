<script setup>
import { getComandes } from '@/communicationManager';
</script>
<script>
export default {
    data: () => ({
        comandes: [],
        show: false
    }),
    methods: {

    },
    mounted() {
        getComandes()
            .then((data) => {
                this.comandes = data.filter(comanda => comanda.estado_comanda == "PROCESANDO");
                console.log(this.comandes);
            })
    }
}
</script>
<template>
    <v-main class="box-comandes">
        <v-container>
            <v-row>
                <v-col cols="6" v-for="comanda in this.comandes">
                    <v-card>
                        <v-card-title>
                            ID: {{ comanda.id_comanda }}
                        </v-card-title>
                        <v-card-text>precio
                        </v-card-text>
                        <v-card-text>
                            {{ comanda.estado_comanda }}
                        </v-card-text>
                        <v-card-actions>
                            <v-btn @click="show = !show">DETAILS</v-btn>
                        </v-card-actions>
                    </v-card>
                    <v-expand-transition>

                        <div v-if="show === true" v-for="producto in comanda.productos">
                            <v-card>
                                <v-card-title>
                                    {{ producto }}
                                </v-card-title>
                                <v-card-text>
                                    <b>ID:</b> <br>
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