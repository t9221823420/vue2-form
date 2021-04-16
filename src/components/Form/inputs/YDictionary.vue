<template>
  <v-data-table v-bind="$props"
                dense
  >
    <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope"/>
    </template>
  </v-data-table>
</template>

<script>
    import tableMixin from '../mixins/tableMixin';

    export default {
        name: 'YDictionary',
        mixins: [tableMixin],
    }
</script>
