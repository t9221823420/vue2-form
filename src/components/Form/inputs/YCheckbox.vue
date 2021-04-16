<template>
  <v-checkbox
    v-bind="$props"
    :inputValue="value"
    @change="inputHandler"
  />
</template>

<script>
    import baseMixin from '../mixins/baseMixin';

    export default {
        name: 'YCheckbox',
        mixins: [baseMixin],
        methods: {
            inputHandler(value, inputItem) {
                inputItem = inputItem || this;
                this.$emit('input', value === true, inputItem);
            },
        },
    }
</script>
