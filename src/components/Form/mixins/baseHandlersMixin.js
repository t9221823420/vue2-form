import YFormEvent from '../YFormEvent';

export default {
  name: 'baseHandlersMixin',
  methods: {
    // template attr inline output
    console() {
      console.log(...arguments);
    },
    inputHandler(value, inputItem) {
      inputItem = inputItem || this;
      this.$emit('input', value, inputItem);
    },
    itemsAfterLoadHandler(items, inputItem) {
      //console.log(items, inputItem, this);
      inputItem = inputItem || this;
      this.$emit('itemsAfterLoad', items, inputItem);
    },
    nestedHandler() {
      // @TODO;
    }
  },
}
