<template>
    <v-container>
        <v-label :absolute="true" :value="dSelectedItems.length > 0">{{ label }}</v-label>

        <v-layout wrap>
            <draggable class="c-items"
                       v-model="dSelectedItems"
                       @end="emitInput"
            >
                <v-card v-for="(item, key) in dSelectedItems" :key="key">
                    <v-img :src="getImagePath(item)"
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

        <CAutocompletePreviews
                v-bind="$props"
                :label="null"
                :value="dSelectedItems"
                placeholder="Выберите изображения"
                multiple
                returnObject
                @input="inputHandler"
                @itemsAfterLoad="itemsAfterLoadHandler"
        >
            <template v-slot:selection="data"/>
            <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
                <slot :name="slot" v-bind="scope"/>
            </template>
        </CAutocompletePreviews>

    </v-container>
</template>

<script>
    import draggable from 'vuedraggable';
    import autocompleteMixin from '../mixins/autocompleteMixin';
    import selectExtensionMixin from '../mixins/selectExtensionMixin';
    import imageMappingMixin from '../mixins/imageMappingMixin';
    import CAutocompletePreviews from './CAutocompletePreviews';

    export default {
        name: "CAutocompleteDraggablePreviews",
        mixins: [autocompleteMixin, selectExtensionMixin, imageMappingMixin],
        data: () => ({
            dOrder: [],
            dDrag: false,
        }),
        methods: {
            emitInput(inputItem) {
                let result = [];

                inputItem = inputItem || this;

                for (let i in this.dSelectedItems) {
                    result.push({id: this.dSelectedItems[i].id});
                }
                this.$emit('input', result, inputItem);
            },
            inputHandler(value, inputItem) {
                this.dSelectedItems = value;
                this.emitInput(inputItem);
            },
            removeItem(key) {
                this.dSelectedItems.splice(key, 1);
                this.emitInput();
            }
        },
        components: {
            CAutocompletePreviews,
            draggable
        },
        watch: {
            // выполняется один раз после первоначальной загрузки dItems
            dItems(items) {
                let result = [],
                    id
                ;
                //сортируем, потому что изначально сортируется в соотвествии с подгруженными dItems
                for (let i in this.value) {
                    id = this.value[i]['id'] || this.value[i];
                    for (let n in items) {
                        if (items[n]['id'] === id) {
                            result.push(items[n]);
                        }
                    }
                }
                this.dSelectedItems = result;
            },
        }
    }
</script>

<style scoped>
.c-items .item, .c-items .v-card {
    display: inline-block;
    margin: 5px 5px;
    cursor: pointer;
}

.c-autocomplete-draggable-previews {
    position: relative;
}

.c-autocomplete-draggable-previews .v-label--active {
    max-width: 133%;
    -webkit-transform: translateY(-18px) scale(.75);
    transform: translateY(-18px) scale(.75);
}
</style>
