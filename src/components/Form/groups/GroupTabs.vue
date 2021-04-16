<template>
    <v-tabs v-model="dActiveTab" grow>
        <v-tab v-for="(group, groupKey) in data.value" :key="groupKey">
            {{ group.label }}
        </v-tab>
        <v-tab-item v-for="(group, groupKey) in data.value" :key="groupKey">
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
        </v-tab-item>
    </v-tabs>
</template>

<script>
import groupMixin from '../mixins/groupMixin';
import Standalone from './Standalone';
import GroupExpansion from './GroupExpansion';
import GroupHorizontal from './GroupHorizontal';

export default {
    name: 'GroupTabs',
    mixins: [groupMixin],
    data() {
        return {
            dActiveTab: null,
        }
    },
    components: {
        Standalone,
        GroupExpansion,
        GroupHorizontal,
    },
}
</script>
