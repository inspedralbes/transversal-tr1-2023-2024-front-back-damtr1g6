import io from 'socket.io-client';
import { reactive } from "vue";

export const socket = io.connect('http://localhost:3672');

export const state = reactive({
    comandas: []
});

socket.on('comandas', (...comandas) => {
    state.comandas = comandas;
});