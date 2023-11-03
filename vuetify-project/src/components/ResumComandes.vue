<script>
import { getComandes } from '@/services/communicationManager';
import { socket, state } from '@/services/socket';

export default {
    data: () => ({
        show: false
    }),
    methods: {
        changeState(id, state) {
            socket.emit('changeState', { id: id, state: state });

        },
        mostrar(id) {
            this.show = !this.show;
            this.idMostrar = id;
        }
    },
    computed: {
        comandas() {
            return state.comandas[0].filter(comanda => comanda.estado_comanda == "Preparada");
        }
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
                <v-col cols="3" v-for="comanda in comandas">
                    <v-card>
                        <v-card-title>
                            Comanda: {{ comanda.id_comanda }}
                        </v-card-title>
                        <v-card-text v-if="comanda.importe_total != null"><b>{{ comanda.estado_comanda }}</b></v-card-text>
                        <v-card-actions>
                            <v-btn @click="changeState(comanda.id_comanda, 'Recollida')">RECOLLIR</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn @click="mostrar(comanda.id_comanda)">DETALLS</v-btn>
                        </v-card-actions>
                    </v-card>
                    <v-expand-transition>

                        <div v-if="show === true && idMostrar == comanda.id_comanda">
                            <v-card>
                                <v-card-title v-if="comanda.productos = ! null">
                                    Productes: {{ comanda.productos.length }}
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