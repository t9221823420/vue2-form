import selectMixin from './selectMixin';

export default {
    name: 'autocompleteMixin',
    mixins: [selectMixin],
    props: {
        search: String,
        solo: Boolean,
        filter: Function,
    }
}
