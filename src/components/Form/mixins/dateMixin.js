import baseMixin from './baseMixin';

export default {
    name: 'dateMixin',
    mixins: [baseMixin],
    props: {
        'no-title': {
            type: Boolean,
            default: false,
        },
        'scrollable': {
            type: Boolean,
            default: false,
        },
    }
}
