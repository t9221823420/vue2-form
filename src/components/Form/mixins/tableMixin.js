import baseMixin from './baseMixin';
import tableMixin from '@/components/Table/mixins/tableMixin';

export default {
  name: 'tableMixin',
  mixins: [baseMixin, tableMixin],
  props: ['parentModel'],
  data() {
    return {
      dItems: this.items || this.value,
    }
  },
  methods: {
    itemsUpdateHandler(item, items, table, eventName) {
      table = table || this;
      this.$emit(eventName || 'itemsUpdate', item, items, table);
      this.$emit('input', items, this);
    },
  },
}
