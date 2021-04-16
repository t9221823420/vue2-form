<template>
    <CSelect
            v-bind="$props"
            @input="inputHandler"
            @itemsAfterLoad="itemsAfterLoadHandler"
    >
        <template v-slot:item="data">
            <v-col sm="3">
                {{ data.item.title }} /
            </v-col>
            <v-col sm="9">
                {{ data.item.lead }}
            </v-col>
        </template>
        <template v-slot:selection="data">
            <v-col sm="3">
                {{ data.item.title }} /
            </v-col>
            <v-col sm="9">
                {{ data.item.lead }}
            </v-col>
        </template>
        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope"/>
        </template>
    </CSelect>
</template>

<script>
    import selectMixin from '../mixins/selectMixin';
    import CSelect from './CSelect';

    export default {
        name: "CSelectPrices",
        mixins: [selectMixin],
        components: {
            CSelect,
        },
    }
</script>
