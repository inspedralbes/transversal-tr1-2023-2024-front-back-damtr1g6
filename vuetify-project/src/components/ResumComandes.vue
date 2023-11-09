<script>
import { getComandes } from '@/services/communicationManager';
import { socket, state } from '@/services/socket';

export default {
    data: () => ({
    }),
    methods: {
        changeState(id, state) {
            socket.emit('changeState', { id: id, state: state });

        },
    },
    computed: {
        comandasPreaparada() {
            return state.comandas[0].filter(comanda => comanda.estado_comanda == "Preparada");
        },
        comandasProcessant() {
            return state.comandas[0].filter(comanda => comanda.estado_comanda == "Processant");
        },
    },
    mounted() {
        socket.emit('getComandas', {});
    },
}
</script>
<template>
    <v-main class="box-recepcio-comandes">
        <v-container>
            <v-row>
                <v-col>
                    <v-card style="height: 100vh; padding: 30px;">
                        <v-card-title>EN PREPARACIÓ</v-card-title>
                        <v-divider></v-divider>
                        <br>
                        <v-row>
                            <v-col cols="4" v-for="comanda in comandasProcessant">
                                <v-card>
                                    <v-card-title>
                                        ID: {{ comanda.id_comanda }}
                                    </v-card-title>
                                    <v-divider></v-divider>
                                    <v-card-title><b>{{ comanda.estado_comanda }}</b></v-card-title>
                                    <v-card-text v-if="comanda.productos_total != null">
                                        Productes: {{ comanda.productos_total }}
                                    </v-card-text>
                                    <v-card-text v-else>
                                        Productes: 0
                                    </v-card-text>
                                    
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card style="height: 100vh; padding: 30px;">
                        <v-card-title>PREPARADA</v-card-title>
                        <v-divider></v-divider>
                        <br>
                        <v-row>
                            <v-col cols="4" v-for="comanda in comandasPreaparada">
                                <v-card style="background-color:#A8F68A">
                                    <v-card-title>
                                        ID: {{ comanda.id_comanda }}
                                    </v-card-title>
                                    <v-divider></v-divider>
                                    <v-card-title><b>{{ comanda.estado_comanda }}</b></v-card-title>
                                    <v-card-text v-if="comanda.productos_total != null">
                                        Productes: {{ comanda.productos_total }}
                                    </v-card-text>
                                    <v-card-text v-else>
                                        Productes: 0
                                    </v-card-text>
                                    <v-divider></v-divider>
                                    <v-card-actions>
                                        <v-btn @click="changeState(comanda.id_comanda, 'Recollida')">RECOLLIR</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>