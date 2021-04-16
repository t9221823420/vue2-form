<template>
    <v-text-field v-bind="$props" @input="inputHandler"/>
</template>

<script>
    import baseMixin from '../mixins/baseMixin';

    export default {
        name: 'YText',
        mixins: [baseMixin],
    }
</script>
