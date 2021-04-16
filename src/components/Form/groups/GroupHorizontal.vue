<template>
    <div>
        <v-card v-for="(group, groupKey) in data.value" :key="groupKey" class="pa-4 mb-5">
            <div>{{ group.label }}</div>
            <v-row>
                <v-col
                    v-for="(item, itemKey) in group.items"
                    :key="itemKey"
                    cols="12"
                    :sm="12/Math.floor(Object.values(group.items).length)"
                >
                    <component
                        :is="item.group.component"
                        :config="item.group"
                        :data="item"
                        @input="inputHandler"
                        @itemsAfterLoad="itemsAfterLoadHandler"
                    >
                        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
                            <slot :name="slot" v-bind="scope"/>
                        </template>
                    </component>
                </v-col>
            </v-row>
        </v-card>
    </div>
</template>

<script>
import groupMixin from '../mixins/groupMixin';
import Standalone from './Standalone';
import GroupTabs from './GroupTabs';
import GroupExpansion from './GroupExpansion';

export default {
    name: 'GroupHorizontal',
    mixins: [groupMixin],
    data() {
        return {
            dActiveTab: null,
        }
    },
    components: {
        Standalone,
        GroupExpansion,
        GroupTabs,
    },
}
</script>
