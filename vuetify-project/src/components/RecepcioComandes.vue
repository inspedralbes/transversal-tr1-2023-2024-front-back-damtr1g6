<script>
import { getComandes } from '@/services/communicationManager';
import { socket, state } from '@/services/socket';

export default {
    data: () => ({
        show: false,
        idMostrar: "",
        color: 1
    }),
    methods: {
        changeState(id, state) {
            socket.emit('changeState', { id: id, state: state });
        },
        deleteComanda(id) {
            socket.emit('deleteComanda', id);
        },
        mostrar(id) {
            this.show = !this.show;
            this.idMostrar = id;
        }
    },
    computed: {
        comandas() {
            return state.comandas[0].filter(comanda => comanda.estado_comanda == "Recibida");
            
        }
    },
    mounted() {
        socket.emit('getComandas', {});
        console.log(state.comandas[0]);
    }
}
</script>
<template>
    <v-main class="box-recepcio-comandes">
        <v-container>
            <v-row>
                <v-col cols="3" v-for="comanda in comandas">
                    <v-card>
                        <v-card-title>
                            Tastybyte
                        </v-card-title>
                        <v-card-text>Comanda: {{ comanda.id_comanda }}</v-card-text>
                        <v-card-text v-if="comanda.importe_total != null">{{ comanda.importe_total }} $
                        </v-card-text>
                        <v-card-text><b>{{ comanda.estado_comanda }}</b></v-card-text>
                        <v-card-actions>
                            <v-btn @click="changeState(comanda.id_comanda, 'Procesando')">ACEPTAR</v-btn>
                            <v-btn @click="deleteComanda(comanda.id_comanda)">DENEGAR</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn @click="mostrar(comanda.id_comanda)">DETAILS</v-btn>
                        </v-card-actions>
                    </v-card>
                    <v-expand-transition>

                        <div v-if="show === true && idMostrar == comanda.id_comanda">
                            <v-card>
                                <v-card-title>
                                    Productos: {{ comanda.productos_total}}
                                </v-card-title>
                                <v-card-text>
                                    <v-row>
                                        <v-col cols="10">Nombre</v-col>
                                        <v-col cols="2">Preu</v-col>
                                    </v-row>
                                </v-card-text>
                                <v-card-text v-for="(producto, index) in comanda.productos">
                                    <v-row>
                                        <v-col cols="10">{{ producto.nombre }}  </v-col>
                                        <v-col cols="2">{{ producto.precio }}</v-col>
                                    </v-row>
                                                             
                                </v-card-text>
                            </v-card>
                        </div>
                    </v-expand-transition>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>