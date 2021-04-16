<template>
    <YSelect v-bind="$props"
             item-value="id"
             item-text="title"
             @input="inputHandler"
             @itemsAfterLoad="itemsAfterLoadHandler"
             dense
    >
        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope"/>
        </template>
    </YSelect>
</template>

<script>
    import selectMixin from '../mixins/selectMixin';
    import YSelect from '../inputs/YSelect';

    export default {
        name: "CSelect",
        mixins: [selectMixin],
        components: {
            YSelect,
        },
    }
</script>
