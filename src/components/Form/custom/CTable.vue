<template>
    <v-container class="input" >
        <v-label :absolute="true" :value="true">{{ label }}</v-label>

        <component
            :is="cComponent"
            v-bind="$props"
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
        </component>
    </v-container>
</template>

<script>
import customTableMixin from '../mixins/customTableMixin';
import customTableComponentsMixin from '@/components/Table/mixins/customTableComponentsMixin';

export default {
    name: 'CTable',
    mixins: [customTableMixin, customTableComponentsMixin],
    props: ['customTableComponent',],
    computed: {
        cComponent() {
            return this.customTableComponent || 'YTable';
        },
    },
    methods: {
        itemAfterUpdateHandler($item, $items, $target) {
            $target = $target || this;

            // в качестве $target отправляем таблицу, в которой изменился объект
            this.$emit('itemAfterUpdate', $item, $items, $target);

            // в качестве $target отправляем CTable, т.к. он является кастомной оберткой, для вложенных таблиц
            // но по сути представляет из себя тоже самое что и стандартный YText
            this.$emit('input', $items, this);
        },
        itemDeleteHandler($item, $items, $target) {
            $target = $target || this;

            // по аналогии с itemAfterUpdateHandler
            this.$emit('itemDelete', $item, $items, $target);
            this.$emit('input', $items, this);
        },
    },
}
</script>

<style scoped>
.container.input{
    position: relative;
    padding-top: 25px;
}

.container.input label{
    top: 0px;
}

.container {
    max-width: 100%;
}
</style>
