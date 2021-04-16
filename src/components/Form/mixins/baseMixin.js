import baseHandlersMixin from './baseHandlersMixin';

export default {
    name: 'baseMixin',
    mixins: [baseHandlersMixin],
    props: {
        name: String,
        label: String,
        value: {
            type: [String, Number, Boolean, Array, Object],
            default: null,
        },
        placeholder: String,
        readonly: Boolean,
        disabled: Boolean,
        rules: Array,
    }
}
