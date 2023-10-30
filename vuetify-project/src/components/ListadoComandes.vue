<script setup>
import { getComandes } from '@/services/communicationManager';
import { state, socket } from '@/services/socket';
</script>
<script>
export default {
    data: () => ({
        show: false,
        idMostrar: "",
        color: 1
    }),
    methods: {
        mostrar(id) {
            this.show = !this.show;
            this.idMostrar = id;
            console.log(this.idMostrar);
        },
        changeState(id, state) {
            socket.emit('changeState', { id: id, state: state });
        },
    },
    computed: {
        comandas() {
            return state.comandas[0].filter(comanda => comanda.estado_comanda == "PROCESANDO");
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
                <v-col cols="6" v-for="comanda in comandas">
                    <v-card :style="{ backgroundColor: comanda.time }">
                        <v-card-title>
                            ID: {{ comanda.id_comanda }}
                        </v-card-title>
                        <v-card-text v-if="comanda.importe_total != null">{{ comanda.importe_total }} $
                        </v-card-text>
                        <v-card-text><b>{{ comanda.estado_comanda }}</b></v-card-text>
                        <v-card-actions>
                            <v-btn @click="changeState(comanda.id_comanda, 'PREPARADA')">PREPARADA</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn @click="mostrar(comanda.id_comanda)">DETAILS</v-btn>
                        </v-card-actions>
                    </v-card>
                    <v-expand-transition>

                        <div v-if="show == true && idMostrar == comanda.id_comanda">
                            <v-card>
                                <v-card-title v-if="comanda.productos != null">
                                    Productos: {{ comanda.productos.length }}
                                </v-card-title>
                                <v-card-text v-for="(producto, index) in comanda.productos">
                                    {{ index + 1 }}. {{ producto }}
                                </v-card-text>
                            </v-card>
                        </div>
                    </v-expand-transition>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>