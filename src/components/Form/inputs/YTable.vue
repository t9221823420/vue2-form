<template>
  <YTable v-bind="$props"
          :items="dItems"
          @input="inputHandler"
          @itemsAfterLoad="itemsAfterLoadHandler"
          @itemAfterUpdate="itemAfterUpdateHandler"
          @itemDelete="itemDeleteHandler"
          @reorderItemsStop="reorderItemsStopHandler"
  >
    <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope"/>
    </template>
  </YTable>
</template>

<script>
    import tableMixin from '../mixins/tableMixin';
    import YTable from '@/components/Table/YTable';

    export default {
        name: 'YTable',
        mixins: [tableMixin],
        components: {
            YTable
        }
    }
</script>
