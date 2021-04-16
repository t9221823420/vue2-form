import {request} from '@/helpers/requestHelper';

export default {
    name: 'selectExtensionMixin',
    data() {
        return {
            dIsLoading: false,
            dDisabled: this.disabled,
            dPlaceholder: this.placeholder,
            dSelectedItems: [], // to store fix bug  and selected items in common list after search request
            dItems: [], // search request item list + dSelectedItems
        }
    },
    methods: {
        normalizeItems(data) {
            let items = [];

            for (let key in data) {
                // @ отбрасываем служебные поля
                if (key.indexOf('@') === -1) {
                    items.push(data[key]);
                }
            }

            return items;
        },
        normalizeSelectedItems(data, returnObject) {
            let valueKey = this.itemValue,
                sortType = this.sortAsc === null && this.sortDesc !== null ? -1 : 1,
                sortKey = this.sortAsc || this.sortDesc,
                items = this.dItems,
                debug = false
            ;

            data = data || [];
            returnObject = returnObject || this.returnObject;

            for (let i in items) {
                if (items[i][valueKey]) {
                    if (this.multiple === true) {
                        for (let n in data) {
                            if (returnObject === true) {
                                if(typeof data[n] === 'object' && items[i][valueKey] === data[n][valueKey]){
                                    data[n] = items[i];
                                /* vuetify select has a bug - it returns previously selected items as ids and only last ones as object
                                    fix it by replacing simple data type to object type
                                */
                                } else if (items[i][valueKey] === data[n]) {
                                    data[n] = items[i];
                                }
                                !debug || console.log('case 1', i, n, {...items[i]}, {...items}, {...data});
                            } else if (items[i][valueKey] === data[n]) {
                                !debug || console.log('case 2', i, n, {...items[i]}, {...items}, {...data});
                                data[n] = items[i][valueKey];
                            }
                        }
                    } else {
                        if (returnObject === true && typeof data === 'object' && items[i][valueKey] === data[valueKey]) {
                            !debug || console.log('case 3', i, {...items[i]}, {...items}, {...data});
                            data = items[i];
                        } else if (items[i][valueKey] === data) {
                            !debug || console.log('case 4', i, {...items[i]}, {...items}, {...data});
                            data = items[i][valueKey];
                        }
                    }
                }
            }

            if (sortKey) {
                data = Object.values(data).sort(function(a, b) {
                    let valA = typeof a[sortKey] === 'string' ? a[sortKey].toLowerCase() : a[sortKey];
                    let valB = typeof b[sortKey] === 'string' ? b[sortKey].toLowerCase() : b[sortKey];

                    return (valA > valB) ? 1 : ((valB < valA) ? -1 : 0) * sortType;
                })
            }

            !debug || console.log('result', {...items}, {...data});

            return data;
        },
        inputHandler(value, inputItem) {
            inputItem = inputItem || this;
            value = this.normalizeSelectedItems(value);
            this.dSelectedItems = value;
            this.$emit('input', value, inputItem);
        }
    },
    watch: {
        items: {
            immediate: true,
            handler(value) {
                if (typeof value === 'string') {
                    let prevPlaceholder = this.dPlaceholder;
                    this.dPlaceholder = 'loading ...';
                    this.dDisabled = true;

                    request({url: value}, true).then(response => {
                        this.dItems = this.normalizeItems(response.data);
                        this.dSelectedItems = this.normalizeSelectedItems(this.dSelectedItems);
                        this.$emit('itemsAfterLoad', this.dItems, this);
                    }).finally(() => {
                        this.dDisabled = false;
                        this.dPlaceholder = prevPlaceholder;
                    });
                } else if (Array.isArray(value)) {
                    this.dItems = value;
                }
            },
        },
        value: {
            immediate: true,
            handler(value) {
                this.dSelectedItems = this.normalizeSelectedItems(value);
            },
        }
    }
}
