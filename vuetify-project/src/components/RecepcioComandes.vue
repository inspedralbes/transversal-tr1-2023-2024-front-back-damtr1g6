<script>
import { getComandes } from '@/services/communicationManager';
import { socket, state } from '@/services/socket';

export default {
    data: () => ({
        show: false,
        idMostrar: [],
        color: 1
    }),
    methods: {
        changeState(id, state, index) {
            this.idMostrar.splice(index, 1);
            socket.emit('changeState', { id: id, state: state });
        },
        deleteComanda(id, index) {
            this.idMostrar.splice(index, 1);
            socket.emit('deleteComanda', id);

        },
        mostrar(id) {
            this.idMostrar[id] = !this.idMostrar[id];
        },
        extractNom(nom) {
            return nom.replace(/^\(\d+\)/, '').trim();
        },
        extraerValorEntreParentesis(texto) {
            const expresionRegular = /\((\d+)\)/;
            return texto.match(expresionRegular);
        }
    },
    computed: {
        comandas() {
            let comandas = state.comandas[0].filter(comanda => comanda.estado_comanda == "Recibida");

            for (let i = 0; i < comandas.length; i++) {
                if (this.idMostrar[i] == undefined) {
                    this.idMostrar.push(false);
                }
            }

            return comandas;
        }
    },
    mounted() {
        socket.emit('getComandas', {});
    }
}
</script>
<template>
    <v-main class="box-recepcio-comandes">
        <v-container>
            <v-row>
                <v-col cols="3" v-for="(comanda, index) in comandas">
                    <v-card>
                        <v-card-title>
                            Tastybyte
                        </v-card-title>
                        <v-card-text>Comanda: {{ comanda.id_comanda }}</v-card-text>
                        <v-card-text v-if="comanda.importe_total != null">{{ comanda.importe_total }} €
                        </v-card-text>
                        <v-card-text><b>{{ comanda.estado_comanda }}</b></v-card-text>
                        <v-card-actions>
                            <v-btn @click="changeState(comanda.id_comanda, 'Procesando', index)">ACCEPTAR</v-btn>
                            <v-btn @click="deleteComanda(comanda.id_comanda, index)">DENEGAR</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn @click="mostrar(index)">DETALLS</v-btn>
                        </v-card-actions>
                        <v-expand-transition>
                            <div v-if="idMostrar[index] == true">
                                <v-card-title>
                                    Productes: {{ comanda.productos_total }}
                                </v-card-title>
                                <v-card-text>
                                    <v-row>
                                        <v-col cols="6">Nom</v-col>
                                        <v-col cols="3">Preu</v-col>
                                        <v-col cols="3">Quantitat</v-col>
                                    </v-row>
                                </v-card-text>
                                <v-card-text v-for="(producto, index) in comanda.productos">
                                    <v-row>
                                        <v-col cols="6">{{ extractNom(producto.nombre) }} </v-col>
                                        <v-col cols="3">{{ producto.precio }} €</v-col>
                                        <v-col cols="3">{{ extraerValorEntreParentesis(producto.nombre) }} </v-col>
                                    </v-row>

                                </v-card-text>
                            </div>
                        </v-expand-transition>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>