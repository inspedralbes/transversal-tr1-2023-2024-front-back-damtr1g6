<script setup>

</script>

<script>
export default {
    props: ["producto"],
    data: () => ({
        modal: false,
    }),
    methods: {
        changeState(){

        }
    },

    mounted() {

    }
}
</script>

<template>
    <v-card style="height: 510px;">
        <v-img src="https://img.freepik.com/fotos-premium/3d-burger-sandwich-for-social-media-post-7_351245-1478.jpg"
            height="380px" alter="no encontrado" cover></v-img>

        <v-card-title>
            {{ producto.nombre }}
        </v-card-title>

        <v-card-subtitle>
            {{ producto.descripcion }}
        </v-card-subtitle>

        <v-card-actions icon>
            <v-card-text>{{ producto.precio }}</v-card-text>
            <v-spacer></v-spacer>
            <v-btn color="orange-lighten-2" variant="text" :@click="changeState()">{{producto.estado}}</v-btn>
        </v-card-actions>

    </v-card>
</template>

<style scoped></style>
  