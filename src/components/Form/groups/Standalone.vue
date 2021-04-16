<template>
    <v-card class="pa-4 mb-5" v-if="data.component !== 'YHidden'">
        <component :is="data.component"
                   v-bind="data"
                   v-show="!data.hide"
                   :class="cComponentClass"
                   @input="inputHandler"
                   @itemsAfterLoad="itemsAfterLoadHandler"
        >
            <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
                <slot :name="slot" v-bind="scope"/>
            </template>
        </component>
    </v-card>
</template>

<script>
import _ from 'lodash'

import groupMixin from '../mixins/groupMixin';

import YAutocomplete from '../inputs/YAutocomplete';
import YCheckbox from '../inputs/YCheckbox';
import YDate from '../inputs/YDate';
import YDisplay from '../inputs/YDisplay';
import YDivider from '../inputs/YDivider';
import YFile from '../inputs/YFile';
import YHidden from '../inputs/YHidden';
import YSelect from '../inputs/YSelect';
import YTable from '../inputs/YTable';
import YText from '../inputs/YText';
import YTextarea from '../inputs/YTextarea';

import customInputComponentsMixin from '../mixins/customInputComponentsMixin';

export default {
    name: 'Standalone',
    mixins: [groupMixin, customInputComponentsMixin],
    computed: {
        cComponentClass() {
            return _.kebabCase(this.data.component);
        }
    },
    components: {
        YAutocomplete,
        YCheckbox,
        YDate,
        YDisplay,
        YDivider,
        YFile,
        YHidden,
        YSelect,
        YTable,
        YText,
        YTextarea,
    },
}
</script>
