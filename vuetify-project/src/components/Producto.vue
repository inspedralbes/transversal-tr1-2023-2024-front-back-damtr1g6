<script setup>

</script>

<script>
export default {
    props: ["producto"],
    data: () => ({
        modal: false,
    }),
    methods: {

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
            {{ producto.precio }}
        </v-card-subtitle>

        <v-card-actions icon>
            <v-btn color="orange-lighten-2" variant="text">Habilitar</v-btn>
        </v-card-actions>

    </v-card>
</template>

<style scoped></style>
  