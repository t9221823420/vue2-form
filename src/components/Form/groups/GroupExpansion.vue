<template>
    <v-expansion-panels v-bind="config">
        <v-expansion-panel v-for="(group, groupKey) in data.value" :key="groupKey">
            <v-expansion-panel-header>
                {{ group.label }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <component v-for="(item, key) in group.items" :key="key"
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
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>
import groupMixin from '../mixins/groupMixin';
import Standalone from './Standalone';
import GroupTabs from './GroupTabs';
import GroupHorizontal from './GroupHorizontal';

export default {
    name: 'GroupExpansion',
    mixins: [groupMixin],
    data() {
        return {}
    },
    components: {
        Standalone,
        GroupTabs,
        GroupHorizontal,
    },
}
</script>
