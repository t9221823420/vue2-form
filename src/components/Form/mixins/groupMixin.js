import baseHandlersMixin from './baseHandlersMixin';

export default {
    name: 'groupMixin',
    mixins: [baseHandlersMixin],
    props: {
        config: Object,
        data: Object,
    }
}
