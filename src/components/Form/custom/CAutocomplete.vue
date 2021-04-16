<template>
    <YAutocomplete v-bind="$props"
                   itemValue="id"
                   itemText="title"
                   @input="inputHandler"
                   @itemsAfterLoad="itemsAfterLoadHandler"
    >
        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope"/>
        </template>
    </YAutocomplete>
</template>

<script>
    import autocompleteMixin from '../mixins/autocompleteMixin';
    import YAutocomplete from '../inputs/YAutocomplete';

    export default {
        name: "CAutocomplete",
        mixins: [autocompleteMixin],
        components: {
            YAutocomplete,
        },
    }
</script>
