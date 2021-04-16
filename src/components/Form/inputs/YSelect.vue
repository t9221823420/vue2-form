<template>
  <v-select v-bind="$props"
            :items="dItems"
            :placeholder="dPlaceholder"
            :disabled="dDisabled"
            @input="inputHandler"
            @itemsAfterLoad="itemsAfterLoadHandler"
  >
    <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope"/>
    </template>
  </v-select>
</template>

<script>
    import selectMixin from '../mixins/selectMixin';
    import selectExtensionMixin from '../mixins/selectExtensionMixin';

    export default {
        name: 'YSelect',
        mixins: [selectMixin, selectExtensionMixin],
    };
</script>
