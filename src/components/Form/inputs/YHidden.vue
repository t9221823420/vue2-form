<template>
  <div>
    <input type="hidden"
           :name="name"
           :value="value"
    />
  </div>
</template>

<script>
    import baseMixin from '../mixins/baseMixin';

    export default {
        name: 'YHidden',
        mixins: [baseMixin],
    }
</script>
