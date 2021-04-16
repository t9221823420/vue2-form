<template>
    <v-container>
        <v-label>{{ label }}</v-label>
        <v-layout wrap>
            <draggable class="c-items"
                       v-model="dSelectedItems"
                       @end="emitInput"
            >
                <v-card v-for="(item, key) in dSelectedItems" :key="key">
                    <v-img :src="getPhotoPath(item)"
                           width="100"
                           height="100"
                    />
                    <v-card-text>{{item.id}}</v-card-text>
                    <v-card-actions>
                        <v-btn @click="removeItem(key)">Удалить</v-btn>
                    </v-card-actions>
                </v-card>
            </draggable>
        </v-layout>

        <CTablePhotos v-bind="$props"
                :selected="dSelectedItems"
                @click:row="clickRowHandler"
                @item-selected="itemSelectedHandler"
        >
            <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
                <slot :name="slot" v-bind="scope"/>
            </template>
        </CTablePhotos>
    </v-container>
</template>

<script>
import draggable from 'vuedraggable';
import CTablePhotos from '@/components/Table/custom/CTablePhotos';
import customTableMixin from '../mixins/customTableMixin';

export default {
    name: 'CTableImages',
    mixins: [customTableMixin],
    components: {
        draggable,
        CTablePhotos,
    },
    props: {
        items: [String, Array],
    },
    data() {
        return {
            dSelectedItems: this.value || [],
        }
    },
    watch: {
        dSelectedItems() {
            this.emitInput();
        }
    },
    methods: {
        clickRowHandler(item, row, target) {
            row.select(!row.isSelected);
            target = target || this;
            this.$emit('click:row', item, row, target);
        },
        itemSelectedHandler(item, selected, target) {
            let add = true;
            let itemKey = this.itemKey;

            for(let index in this.dSelectedItems){
                if(this.dSelectedItems[index][itemKey] == item[itemKey]){
                    if(!selected){
                        this.dSelectedItems.splice(index, 1);
                    }
                    add = false;
                    break;
                }
            }

            if(add && selected){
                this.dSelectedItems.push(item);
            }

            target = target || this;
            this.$emit('item-selected', item, selected, target);
        },
        emitInput() {
            let result = [];
            for (let i in this.dSelectedItems) {
                result.push({id: this.dSelectedItems[i].id});
            }
            this.$emit('input', result, this);
        },
        removeItem(key) {
            this.dSelectedItems.splice(key, 1);
            this.emitInput();
        }
    }
}
</script>


<style scoped>
.v-tooltip__content.menuable__content__active {
    opacity: 1!important;
}
</style>
