<template>
    <CAutocomplete
        v-bind="$props"
        :filter="() => true"
        :value="dSelectedItems"
        :returnObject="true"
        sort-desc="title"
        @input="inputHandler"
        @itemsAfterLoad="itemsAfterLoadHandler"
    >
        <template v-slot:item="{item, active}">
            <template v-if="item.group_title">
                <v-list-item-title
                    @click.stop="clickGroupTitleHandler(item)"
                >
                    {{ item.group_title }}
                    <v-divider/>
                </v-list-item-title>
            </template>
            <template v-else-if="item.group_id">
                <v-list-item-group>
                    <v-list-item>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </template>
            <template v-else>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
            </template>
        </template>

        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope"/>
        </template>
    </CAutocomplete>
</template>

<script>
import autocompleteMixin from '../mixins/autocompleteMixin';
import CAutocomplete from './CAutocomplete';

export default {
    name: "CAutocompleteGrouped",
    mixins: [autocompleteMixin],
    components: {
        CAutocomplete,
    },
    data() {
        return {
            dSelectedItems: this.value || [], // fix bug and to store selected items in common list after search request
        };
    },
    methods: {
        clickGroupTitleHandler($inputItem) {
            let $valueKey = this.itemValue;
            let $result = Object.values(this.dSelectedItems);
            let $exists;
            let $clear_selected = true;
            let $existed = [];
            let $returnObject = this.returnObject;

            for (let i in this.dItems) {
                // group_id - строковый тип данных
                if (this.dItems[i].group_id && this.dItems[i].group_id === $inputItem.id) {
                    // when we have simple data in $result index:value
                    if ($returnObject === true) {
                        $exists = false;
                        for (let n in $result) {
                            if ($result[n][$valueKey] && $result[n][$valueKey] === this.dItems[i][$valueKey]) {
                                $existed.push(this.dItems[i]);
                                $exists = true;
                                break;
                            }
                        }

                        if (!$exists) {
                            $clear_selected = false;
                            $result.push(this.dItems[i]);
                        }

                    } else {
                        if ($result.includes(this.dItems[i].id)) {
                            $existed.push(this.dItems[i].id);
                        } else {
                            $clear_selected = false;
                            $result.push(this.dItems[i].id);
                        }
                    }
                }
            }

            if ($clear_selected) {
                $result = $result.filter(function ($item) {
                    let $exists = false;

                    if ($returnObject === true) {
                        for (let i in $existed) {
                            if ($existed[i][$valueKey] === $item[$valueKey]) {
                                $exists = true;
                                break;
                            }
                        }
                    } else {
                        $exists = !$existed.includes($item);
                    }

                    return $exists;
                });
            }
            this.dSelectedItems = [...new Set($result)];
            this.$emit('input', this.dSelectedItems, this);
        },
        itemsAfterLoadHandler($items, $inputItem) {
            this.dItems = $items;
            $inputItem = $inputItem || this;
            this.$emit('itemsAfterLoad', $items, $inputItem);
        },
    }
}
</script>
