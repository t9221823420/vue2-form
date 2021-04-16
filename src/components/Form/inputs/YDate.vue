<template>
    <v-menu
        v-model="dShowDatepicker"
        :close-on-content-click="false"
        :return-value.sync="dValue"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
        ref="menu"
    >
        <template v-slot:activator="{ on }">
            <v-text-field v-bind="$props"
                          v-model="dValue"
                          v-on="on"
                          @input="inputHandler"
            />
        </template>
        <v-date-picker v-bind="$props"
                       v-model="dValue"
                       no-title
                       scrollable
                       @input="inputHandler"
        >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="$refs.menu.save(dValue)">OK</v-btn>
            <v-btn text color="primary" @click="dShowDatepicker = false">Cancel</v-btn>
        </v-date-picker>
    </v-menu>
</template>

<script>
    import dateMixin from '../mixins/dateMixin';

    export default {
        name: 'YDate',
        mixins: [dateMixin],
        data: function () {
            return {
                dShowDatepicker: false,
                dValue: this.value,
            };
        },
    }
</script>
