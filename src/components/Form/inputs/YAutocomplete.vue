<template>
  <v-autocomplete v-bind="$props"
                  :items="dItems"
                  :value="dSelectedItems"
                  :loading="dIsLoading"
                  :search-input.sync="dSearch"
                  :placeholder="dPlaceholder"
                  :disabled="dDisabled"
                  hide-no-data
                  @input="inputHandler"
                  @itemsAfterLoad="itemsAfterLoadHandler"
  >
    <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope"/>
    </template>
  </v-autocomplete>
</template>

<script>
    import autocompleteMixin from '../mixins/autocompleteMixin';
    import selectExtensionMixin from '../mixins/selectExtensionMixin';
    import {request} from '@/helpers/requestHelper';

    export default {
        name: 'YAutocomplete',
        mixins: [autocompleteMixin, selectExtensionMixin],
        props: {
            search: String,
        },
        data: () => ({
            dSearch: null,
        }),
        methods: {
            requestFilteredItems: async (value, $this) => {
                let url = $this.search + value;
                $this.dIsLoading = true;

                request({url: url}, true)
                    .then(response => {
                        let newItems = $this.normalizeItems(response.data),
                            selectedItems
                        ;

                        // it's need to normalize with forced true because dItems always are object
                        selectedItems = $this.normalizeSelectedItems($this.dSelectedItems, true);
                        //for this.multiple !== true
                        if (!Array.isArray(selectedItems)) {
                            selectedItems = [selectedItems];
                        }

                        for (let i in $this.dItems) {
                            for (let k in selectedItems) {
                                if (($this.returnObject === true
                                    && selectedItems[k][$this.itemValue]
                                    && selectedItems[k][$this.itemValue] === $this.dItems[i][$this.itemValue]) ||
                                    ($this.returnObject === false
                                        && selectedItems[k] === $this.dItems[i][$this.itemValue])
                                ) {
                                    newItems.push($this.dItems[i]);
                                }
                            }
                        }

                        // add selected items to store in list after search
                        $this.dItems = newItems;

                        $this.$emit('itemsAfterLoad',  $this.dItems, $this);
                    })
                    .finally(() => ($this.dIsLoading = false));
            },
        },
        watch: {
            dSearch(value) {
                if (!value || typeof this.search !== 'string' || value.length < 2) {
                    return;
                }
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.requestFilteredItems(value.trim(), this);
                }, 500);
            },
        },
    };
</script>
