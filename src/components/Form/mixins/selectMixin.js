import baseMixin from './baseMixin';

export default {
    name: 'selectMixin',
    mixins: [baseMixin],
    props: {
        chips: {
            type: Boolean,
            default: false,
        },
        deletableChips: {
            type: Boolean,
            default: false,
        },
        dense: {
            type: Boolean,
            default: false,
        },
        items: [Array, Object, String],
        itemText: {
            type: String,
            default: 'text',
        },
        itemValue: {
            type: String,
            default: 'value',
        },
        menuProps: {
            type: Object,
            default: () => ({
                closeOnClick: true,
                offsetY: true
            }),
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        placeholder: String,
        returnObject: {
            type: Boolean,
            default: false,
        },
        sortAsc: {
            type: String,
            default: null,
        },
        sortDesc: {
            type: String,
            default: null,
        },
    }
}
