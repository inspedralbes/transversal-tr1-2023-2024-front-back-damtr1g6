<script>
export default {
    props: {
        dialogSend: {
            type: Boolean,
            required: true
        }
    },
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
    <v-dialog v-model="dialogVisible" persistent width="600" @input="$emit('update:dialogSend', dialogVisible)">
        <v-card append-icon="$close" class="mx-auto" elevation="16" min-width="500" title="Send a receipt">
            <template v-slot:append>
                <v-btn icon="$close" variant="text" @click="dialogSend = false"></v-btn>
            </template>

            <v-divider></v-divider>

            <div class="py-12 text-center">
                <v-icon class="mb-6" color="success" icon="mdi-check-circle-outline" size="128"></v-icon>

                <div class="text-h4 font-weight-bold">This receipt was sent</div>
            </div>

            <v-divider></v-divider>

            <div class="pa-4 text-end">
                <v-btn class="text-none" color="medium-emphasis" min-width="92" rounded variant="outlined"
                    @click="dialogSend = false">
                    Close
                </v-btn>
            </div>
        </v-card>
    </v-dialog>
</template>