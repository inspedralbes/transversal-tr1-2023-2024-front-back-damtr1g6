<script setup>
import { getComandes } from '@/services/communicationManager';
import { state, socket } from '@/services/socket';
</script>
<script>
export default {
    data: () => ({
        color: 1
    }),
    methods: {
        changeState(id, state) {
            socket.emit('changeState', { id: id, state: state });
        },
    },
    computed: {
        comandas() {
            return state.comandas[0].filter(comanda => comanda.estado_comanda == "Processant" || comanda.estado_comanda == "Preparada");
        }
    },
    mounted() {
        socket.emit('getComandas', {});
    },
}
</script>
<template>
    <v-main class="box-comandes">
        <v-container>
            <v-row>
                <v-col>
                    <v-card>
                        <v-card-title>EN PREPARACIO</v-card-title>
                        <v-row>
                            <v-col cols="6" v-for="comanda in comandas">
                                <v-card :style="{ backgroundColor: comanda.time }"
                                    v-if="comanda.estado_comanda == 'Processant'">
                                    <v-card-title>
                                        ID: {{ comanda.id_comanda }}
                                    </v-card-title>
                                    <v-card-title>
                                        Productes: {{ comanda.productos_total }}
                                    </v-card-title>
                                    <v-card-text>
                                        <v-row>
                                            <v-col cols="10">Nom</v-col>
                                            <v-col cols="2">Preu</v-col>
                                        </v-row>
                                    </v-card-text>
                                    <v-card-text v-for="(producto, index) in comanda.productos">
                                        <v-row>
                                            <v-col cols="10">{{ producto.nombre }} </v-col>
                                            <v-col cols="2">{{ producto.precio }} €</v-col>
                                        </v-row>

                                    </v-card-text>
                                    <v-card-text v-if="comanda.importe_total != null">
                                        <v-row>
                                            <v-col>Total: {{ comanda.importe_total }} €</v-col>
                                        </v-row>
                                    </v-card-text>
                                    <v-card-text><b>{{ comanda.estado_comanda }}</b></v-card-text>
                                    <v-card-actions>
                                        <v-btn @click="changeState(comanda.id_comanda, 'Preparada')">PREPARADA</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card>
                        <v-card-title>PREPARADA</v-card-title>
                        <v-row>
                            <v-col cols="6" v-for="comanda in comandas">
                                <v-card :style="{ backgroundColor: comanda.time }">
                                    <v-card-title>
                                        ID: {{ comanda.id_comanda }}
                                    </v-card-title>
                                    <v-card-title>
                                        Productes: {{ comanda.productos_total }}
                                    </v-card-title>
                                    <v-card-text>
                                        <v-row>
                                            <v-col cols="10">Nom</v-col>
                                            <v-col cols="2">Preu</v-col>
                                        </v-row>
                                    </v-card-text>
                                    <v-card-text v-for="(producto, index) in comanda.productos">
                                        <v-row>
                                            <v-col cols="10">{{ producto.nombre }} </v-col>
                                            <v-col cols="2">{{ producto.precio }} €</v-col>
                                        </v-row>

                                    </v-card-text>
                                    <v-card-text v-if="comanda.importe_total != null">
                                        <v-row>
                                            <v-col>Total: {{ comanda.importe_total }} €</v-col>
                                        </v-row>
                                    </v-card-text>
                                    <v-card-text><b>{{ comanda.estado_comanda }}</b></v-card-text>
                                    <v-card-actions>
                                        <v-btn @click="changeState(comanda.id_comanda, 'Preparada')">PREPARADA</v-btn>
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