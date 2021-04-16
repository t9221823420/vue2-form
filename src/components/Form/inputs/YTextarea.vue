<template>
    <v-textarea v-bind="$props" @input="inputHandler" >
        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope"/>
        </template>
    </v-textarea>
</template>

<script>
    import baseMixin from '../mixins/baseMixin';

    export default {
        name: 'YTextarea',
        mixins: [baseMixin]
    }
</script>
