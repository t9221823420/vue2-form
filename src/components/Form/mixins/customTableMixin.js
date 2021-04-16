import tableMixin from './tableMixin';
import customTableMixin from '@/components/Table/mixins/customTableMixin';
import customTableSearchByIdAndTitleMixin from '@/components/Table/mixins/customTableSearchByIdAndTitleMixin';

export default {
  name: 'customTableMixin',
  mixins: [tableMixin, customTableMixin, customTableSearchByIdAndTitleMixin],
}
