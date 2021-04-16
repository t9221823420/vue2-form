<template>
  <v-input>
    <label>{{ label }}</label>
    <div v-html="value" />
  </v-input>
</template>

<script>
    import baseMixin from '../mixins/baseMixin';

    export default {
        name: 'YDisplay',
        mixins: [baseMixin],
    }
</script>
