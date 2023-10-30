import io from 'socket.io-client';
import { reactive } from "vue";

export const socket = io.connect('http://localhost:3672');

export const state = reactive({
    connected: false,
    comandas: [],
});

socket.on('comandas', (...comandas) => {
    console.log("comandas recibidas");
    state.comandas = comandas;
});