<script>
export default {
    props: ["dialogSend", "dialogSendMessage", "updateDialogSend"],
    data() {
        return {
            dialogVisible: this.dialogSend
        };
    },
    watch: {
        dialogSend(newValue) {
            this.dialogVisible = newValue;
        }
    }
}
</script>


<template>
    <v-dialog v-model="dialogVisible" persistent width="600">
        <v-card append-icon="$close" class="mx-auto" elevation="16" min-width="500" title="Afegir Producte">
            <template v-slot:append>
                <v-btn icon="$close" variant="text" @click="updateDialogSend(false)"></v-btn>
            </template>

            <v-divider></v-divider>

            <div class="py-12 text-center" v-if="dialogSendMessage == 'error'">
                <v-icon class="mb-6" color="error" icon="mdi-alert-circle-outline" size="128"></v-icon>
                <div class="text-h4 font-weight-bold px-5">El producte no s'ha pogut afegir, comproveu que heu introduït
                    correctament els camps</div>
            </div>
            <div class="py-12 text-center" v-else-if="dialogSendMessage == 'loading'">
                <v-progress-circular indeterminate :size="42" :width="5"></v-progress-circular>
            </div>
            <div class="py-12 text-center" v-else>
                <v-icon class="mb-6" color="success" icon="mdi-check-circle-outline" size="128"></v-icon>

                <div class="text-h4 font-weight-bold px-5">El producte s'ha afegit correctament</div>
            </div>

            <v-divider></v-divider>

            <div class="pa-4 text-end" v-if="dialogSendMessage != 'loading'">
                <v-btn class="text-none" color="medium-emphasis" min-width="92" rounded variant="outlined"
                    @click="updateDialogSend(false)">
                    Tancar
                </v-btn>
            </div>
        </v-card>
    </v-dialog>
</template>