<template>
    <CSelectDraggablePreviews
        v-bind="$props"
        :value="dSelectedItems"
        @input="inputHandler"
        @itemsAfterLoad="itemsAfterLoadHandler"
    >
        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope"/>
        </template>
    </CSelectDraggablePreviews>
</template>

<script>
    import {setUrlParams} from '@/helpers/requestHelper';
    import EventBus from '@/eventBus';
    import selectMixin from '../mixins/selectMixin';
    import CSelectDraggablePreviews from './CSelectDraggablePreviews';

    export default {
        name: "CImagesStaticList",
        mixins: [selectMixin],
        data() {
            return {
                dSelectedItems: this.value,
            }
        },
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
            },
            // альбом прикручивается через EventBus.$on('getItemsUrl'...
            getItemsUrl(){
                let url = this.items,
                    ids = []
                ;

                if(this.dSelectedItems.length){
                    for (let i in this.dSelectedItems) {
                        ids.push(this.dSelectedItems[i].id || this.dSelectedItems[i]);
                    }

                    url = setUrlParams(this.items, {
                        '@filter[or][][id]': ids,
                    });

                } else {
                    url = setUrlParams(this.items, {
                        '@filter[or][][id]': null,
                    });
                }

                return url;
            }
        },
        components: {
            CSelectDraggablePreviews,
        },
        mounted() {
            // отслеживает изменение выбраного альбома в CSelect через PageModule::inputHandler
            // в switch-t в 226 строке EventBus.$emit('getItemsUrl', result => url = result);
            EventBus.$on('getItemsUrl', callback => callback(this.getItemsUrl()));
        }
    }
</script>
