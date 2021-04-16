<template>
    <CAutocomplete
            v-bind="$props"
            @input="inputHandler"
            @itemsAfterLoad="itemsAfterLoadHandler"
    >
        <template v-slot:item="data">
            <v-col sm="1">
                {{ data.item.id }}
            </v-col>
            <v-col sm="5">
                {{ data.item.title }}
            </v-col>
            <v-col sm="6">
                <img :src="getImagePath(data.item)"/>
            </v-col>
        </template>
        <template v-slot:selection="data">
            <img :src="getImagePath(data.item)" />
        </template>
        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope"/>
        </template>
    </CAutocomplete>
</template>

<script>
    import autocompleteMixin from '../mixins/autocompleteMixin';
    import imageMappingMixin from '../mixins/imageMappingMixin';
    import CAutocomplete from './CAutocomplete';

    export default {
        name: "CAutocompletePreviews",
        mixins: [autocompleteMixin, imageMappingMixin],
        components: {
            CAutocomplete,
        },
    }
</script>
