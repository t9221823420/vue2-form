<template>
    <CSelect
            v-bind="$props"
            @input="inputHandler"
            @itemsAfterLoad="itemsAfterLoadHandler"
    >
        <template v-slot:selection="data">
            <v-col sm="12">
                1{{ data.item.title }}
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
        name: "CSelectOutputRows",
        mixins: [selectMixin],
        components: {
            CSelect,
        },
    }
</script>
