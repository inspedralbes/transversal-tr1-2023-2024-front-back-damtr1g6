<template>
    <v-layout>
        <v-app-bar color="purple">
            <v-app-bar-nav-icon>
                <v-icon icon="mdi-circle-slice-4"> </v-icon>
            </v-app-bar-nav-icon>
            <v-app-bar-title>
                FlixHub
            </v-app-bar-title>
            <v-spacer></v-spacer>

            <v-btn icon>
                <v-icon :icon="`mdiSvg:${mdiAccount}`"></v-icon>
            </v-btn>
        </v-app-bar>

        <v-main>
            <v-container>
                <v-form class="box-write">
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="buscar" clearable label="Producte" type="text" variant="outlined">
                                    <template v-slot:append>
                                        <v-menu>
                                            <template v-slot:activator="{ props }">
                                                <v-btn icon>
                                                    <v-icon>mdi-magnify</v-icon>
                                                </v-btn>
                                            </template>

                                        </v-menu>
                                    </template>
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
                <v-row>
                    <v-col cols="2">
                        <v-card style="height: 510px;">
                            <v-img
                                src="https://img.freepik.com/fotos-premium/3d-burger-sandwich-for-social-media-post-7_351245-1478.jpg"
                                height="380px" alter="no encontrado" cover></v-img>

                            <v-card-title>
                                TITULO
                            </v-card-title>

                            <v-card-subtitle>
                                DSADAS
                            </v-card-subtitle>

                            <v-card-actions icon>
                                <v-btn color="orange-lighten-2" variant="text">Comprar</v-btn>
                            </v-card-actions>

                        </v-card>
                    </v-col>

                </v-row>
            </v-container>
        </v-main>

    </v-layout>
</template>

<script>
export default {
    data: () => ({
    }),
    methods: {
    }
}

</script>

<style scoped></style>