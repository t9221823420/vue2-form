<template>
    <FilterComponent
            :selected-filters="value"
            :filters="dFilters"
            label="Выберите фильтр"
            @onSelect="inputHandler"
    />
</template>

<script>
    import App from '@/App';
    import {request} from '@/helpers/requestHelper';
    import baseMixin from '../mixins/baseMixin';
    import selectMixin from '../mixins/selectMixin';
    import FilterComponent from '@/components/Modal/filter/FilterComponent';

    export default {
        name: 'CFilters',
        mixins: [baseMixin, selectMixin],
        data() {
            return {
                dFilters: [],
            }
        },
        components: {
            FilterComponent,
        },
        methods: {
            getFilters(){
                request({
                    url: App.params.api.controllers.filtersList + '/' // @TODO понадобился CRUD контроллер - пришлось переименовать в filtersList
                }, true).then(response => this.dFilters = response.data)
            },
            setDefaultAdditions(){
                this.$store.dispatch('modules/updateAdditions', {index:this.componentData.index, 'count': this.defaultAdditions })
            }
        },
        created() {
            this.getFilters();
        }
    }
</script>
