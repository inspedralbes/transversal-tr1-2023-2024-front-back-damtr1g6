<script>
import { getComandes, updateState } from '@/communicationManager';
import socket from '@/socket';

export default {
    data: () => ({
        comandes: [],
        show: false
    }),
    methods: {
        changeState(id, state) {
            socket.emit('changeState', { id: id, state: state });
        }
    },
    mounted() {
        getComandes()
            .then((data) => {
                this.comandes = data.filter(comanda => comanda.estado_comanda == "RECIBIDA");
            })

        socket.on('comandas', (comandas) => {
            this.comandes = comandas.filter(comanda => comanda.estado_comanda == "RECIBIDA");
        });
    }
}
</script>
<template>
    <v-main class="box-recepcio-comandes">
        <v-container>
            <v-row>
                <v-col cols="6" v-for="comanda in this.comandes">
                    <v-card>
                        <v-card-title>
                            Comanda: {{ comanda.id_comanda }}
                        </v-card-title>
                        <v-card-text>
                            {{ comanda.imorte_total }}
                        </v-card-text>

                        <v-card-actions>
                            <v-btn @click="changeState(comanda.id_comanda, 'PROCESANDO')">ACEPTAR</v-btn>
                            <v-btn>DENEGAR</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn @click="show = !show">DETAILS</v-btn>
                        </v-card-actions>
                    </v-card>
                    <v-expand-transition>

                        <div v-if="show === true" v-for="(producto, index) in comanda.productos">
                            <v-card>
                                <v-card-title>
                                    Productos:
                                </v-card-title>
                                <v-card-text>
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