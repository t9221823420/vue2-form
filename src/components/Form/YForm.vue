<template>
    <v-form ref="form" lazy-validation>
        <component v-for="(item, key) in dInputs" :key="key"
                   :is="item.group.component"
                   :config="item.group"
                   :data="item"
                   @input="inputHandler"
                   @itemsAfterLoad="itemsAfterLoadHandler"
        />
    </v-form>
</template>

<script>

import _ from 'lodash';
import validators from "./validators/validators";
import {request} from "../../helpers/requestHelper";
import baseHandlersMixin from './mixins/baseHandlersMixin';
import Standalone from './groups/Standalone';
import GroupTabs from './groups/GroupTabs';
import GroupExpansion from './groups/GroupExpansion';
import GroupHorizontal from './groups/GroupHorizontal';

const GROUP_TYPE_STANDALONE = 'Standalone';
const GROUP_TYPE_TABS = 'GroupTabs';
const GROUP_TYPE_EXPANSION = 'GroupExpansion';
const GROUP_TYPE_HORIZONTAL = 'GroupHorizontal';

const COMPONENT_TYPE_AUTOCOMPLETE = 'YAutocomplete';
const COMPONENT_TYPE_CHECKBOX = 'YCheckbox';
const COMPONENT_TYPE_DATE = 'YDate';
const COMPONENT_TYPE_DISPLAY = 'YDisplay';
const COMPONENT_TYPE_DIVIDER = 'YDivider';
const COMPONENT_TYPE_FILE = 'YFile';
const COMPONENT_TYPE_HIDDEN = 'YHidden';
const COMPONENT_TYPE_SELECT = 'YSelect';
const COMPONENT_TYPE_TABLE = 'YTable';
const COMPONENT_TYPE_TEXT = 'YText';
const COMPONENT_TYPE_TEXTAREA = 'YTextarea';

const DEFAULT_COMPONENT_NAME = COMPONENT_TYPE_TEXT;

const formatData = function (data, $this) {
    let result = {},
        item
    ;

    $this.dSubmitData = {};

    for (let key in data) {
        if (key.indexOf('@') === -1) {
            item = data[key];
            if (typeof item['@group'] !== 'undefined') {
                result[key] = formatGroupData(item, $this);
            } else {
                result[key] = formatSimpleData(item, $this);
            }
        }
    }

    return result;
};

const formatGroupData = function (data, $this) {
    let value = [],
        result = {},
        group,
        item
    ;

    if (typeof data['@group'] !== 'undefined') {
        result.group = data['@group'];
        delete data['@group'];
    }

    // на случай если будет полноценное дерево а не вперемешку
    if (typeof data['@items'] !== 'undefined') {
        group = Object.values(data['@items']);
        delete data['@items'];
    } else {
        group = Object.values(data);
    }

    for (let groupKey in group) {
        value[groupKey] = {label: group[groupKey]['label'] || groupKey, items: {}};
        for (let itemName in group[groupKey]['items']) {
            item = group[groupKey]['items'][itemName];
            if (typeof item['@group'] !== 'undefined') {
                value[groupKey]['items'][itemName] = formatGroupData(item, $this);
            } else {
                value[groupKey]['items'][itemName] = formatSimpleData({...item}, $this);
            }
        }
    }

    result.value = value;

    switch (result.group.widget) {
        case 'horizontal':
            result.group.component = GROUP_TYPE_HORIZONTAL;
            break;
        case 'tabs':
            result.group.component = GROUP_TYPE_TABS;
            break;
        case 'expansion':
            result.group.component = GROUP_TYPE_EXPANSION;
            break;
    }

    return result;
};

const formatSimpleData = function (data, $this) {
    let rules;

    if (!data.component) {

        if (!data.widget) {
            console.error('Component and Widget are not set');
        }

        // приводим к типу, т.к. невозможно создать компоненты с зарезервированными именами
        switch (data.widget) {
            case 'text':
                data.component = COMPONENT_TYPE_TEXT;
                break;
            case 'hidden':
                data.component = COMPONENT_TYPE_HIDDEN;
                //data.hide = true;
                break;
            case 'textarea':
                data.component = COMPONENT_TYPE_TEXTAREA;
                break;
            case 'checkbox':
                data.component = COMPONENT_TYPE_CHECKBOX;
                data.value = Boolean(parseInt(data.value));
                break;
            case 'select':
                data.component = COMPONENT_TYPE_SELECT;
                break;
            case 'autocomplete':
                data.component = COMPONENT_TYPE_AUTOCOMPLETE;
                break;
            case 'file':
                data.component = COMPONENT_TYPE_FILE;
                break;
            case 'table':
                data.component = COMPONENT_TYPE_TABLE;
                break;
            case 'date':
                data.component = COMPONENT_TYPE_DATE;
                break;
            case 'display':
                data.component = COMPONENT_TYPE_DISPLAY;
                break;
            case 'divider':
                data.component = COMPONENT_TYPE_DIVIDER;
                break;
            default:
                //formData set Component name from ViewModel
                data.component = data.widget;
        }
    }

    // задаем лейбл поля
    if (typeof data.label !== 'string' && typeof data.name === 'string') {
        data.label = _.startCase(data.name);
    }

    // приводим полученные настройки валидаторов к самим валидаторам
    if (typeof data.rules === 'object') {
        rules = [];
        for (let key in data.rules) {
            if (typeof validators[key] !== 'undefined') {
                let options = data.rules[key];
                rules.push(v => validators[key](v, options));
            }
        }
        data.rules = rules;
    }

    data.group = {
        component: GROUP_TYPE_STANDALONE
    };

    // initialize data for submit
    // any widget may have special format of data but form have to has simple plain data
    $this.dSubmitData[data.name] = data.value;

    for (let key in data) {
        if (data[key] === null) {
            delete data[key];
        }
    }

    return data;
};

const getInputItem = function (name, items) {

    let item;

    for (let key in items) {
        item = items[key];

        if (key === name) {
            return item;
        }

        if (item.group.component !== GROUP_TYPE_STANDALONE) {
            for (let groupKey in item.value) {
                if (typeof item.value[groupKey].items !== 'undefined') {
                    return getInputItem(name, item.value[groupKey].items)
                }
            }
        }
    }
};

const addItems = function (params) {

    let currentItem,
        newItems = params['items'],
        newItem = params['item'],
        newItemKey = params['key'],
        originalItems = params['originalItems'],
        beforeItem = params['beforeItem'],
        afterItem = params['afterItem'],
        resultItems = {}
    ;

    // как это сделать лучше - не знаю. Пробовал другие варианты - не работет.
    if (newItemKey === undefined && newItem !== undefined && newItem.name !== undefined) {
        newItemKey = newItem.name;
    }

    let addItemsToResult = function (newItems) {
        for (let key in newItems) {
            resultItems[key] = newItems[key];
        }
    }

    for (let key in originalItems) {
        currentItem = originalItems[key];

        if (beforeItem && key === beforeItem) {
            if (newItem !== undefined) {
                addItemsToResult({[newItemKey]: newItem});
            }
            if (newItems !== undefined) {
                addItemsToResult(newItems);
            }
            resultItems[key] = currentItem;
            continue;
        } else if (afterItem && key === afterItem) {
            resultItems[key] = currentItem;
            if (newItem !== undefined) {
                addItemsToResult({[newItemKey]: newItem});
            }
            if (newItems !== undefined) {
                addItemsToResult(newItems);
            }
            continue;
        }

        if (currentItem.group.component !== GROUP_TYPE_STANDALONE) {
            for (let groupKey in currentItem.value) {
                if (typeof currentItem.value[groupKey].items !== 'undefined') {
                    params['originalItems'] = currentItem.value[groupKey].items;
                    currentItem.value[groupKey].items = addItems(params);
                }
            }
        }

        resultItems[key] = currentItem;
    }

    return resultItems;
}

export default {
    name: 'YForm',
    mixins: [baseHandlersMixin],
    props: ['data', 'action', 'method'],
    data() {
        return {
            dForm: null,
            dInputs: {},
            dSubmitData: {}, // flat data for submit
            dAction: this.action,
            dMethod: this.method || 'POST'
        }
    },
    components: {
        Standalone,
        GroupTabs,
        GroupHorizontal,
        GroupExpansion,
    },
    watch: {
        data: {
            immediate: true,
            handler(data) {
                if (!this.dInputs.length) {
                    let inputs = {};

                    for (let key in data) {
                        // @ выбрасывает исключение, поэтому либо обрабатываем либо исключаем
                        if (key.indexOf('@') > -1) {
                            switch (key) {
                                case '@action':
                                    this.dAction = data[key];
                                    break;
                                case '@method':
                                    this.dMethod = data[key];
                                    break;
                                default:
                                    delete data[key];
                            }
                        } else {
                            inputs[key] = data[key];
                        }
                    }
                    this.dInputs = formatData(inputs, this);
                }
                return this.dInputs;
            },
        }
    },
    methods: {
        submit($doRequest = true) {
            let $this = this,
                $form = this.dForm,
                $promise
            ;

            //console.log('$form', $form);
            //$this.$emit(EVENT_BEFORE_SUBMIT, $this.$refs.$form, this.dSubmitData);

            //$this.$emit(EVENT_BEFORE_VALIDATE, $this.$refs.$form, this.dSubmitData);

            if ($form.validate()) {
                //$this.$emit(EVENT_VALIDATE, $this.$refs.$form, this.dSubmitData);
                if ($this.dAction) {
                    if ($doRequest === true) {
                        let $requestParams = {
                                url: $this.dAction,
                                method: $this.dMethod,
                                data: $this.dSubmitData,
                            }
                        ;

                        //$this.$emit(EVENT_SUBMIT_BEFORE_REQUEST, $requestParams);
                        $promise = request($requestParams, true)
                            .then($response => {
                                //$this.$emit(EVENT_SUBMIT_REQUEST_SUCCESS, response);
                                return Promise.resolve({
                                    submitData: this.dSubmitData,
                                    requestParams: $requestParams,
                                    response: $response,
                                });
                            })
                            .catch(error => {
                                //$this.$emit(EVENT_SUBMIT_REQUEST_FAIL, error);
                                return Promise.reject(error);
                            })
                        ;
                    } else {
                        // эмулируем запрос-ответ для локального редактирования
                        $promise = Promise.resolve({
                            submitData: this.dSubmitData,
                            response: this.dSubmitData,
                        });
                    }

                }

                $promise = Promise.resolve({
                    submitData: this.dSubmitData,
                });
                //$this.$emit(EVENT_SUBMIT, $this.$refs.$form, this.dSubmitData);
            } else {
                console.log('Error validation.');
                //$this.$emit(EVENT_VALIDATE_FAIL, $this.$refs.$form, this.dSubmitData);
                $promise = Promise.reject({
                    type: 'validation',
                });
            }

            return $promise;
        },
        inputHandler($value, $inputItem) {
            let $inputName = $inputItem.name;
            this.dSubmitData[$inputName] = $value;
            this.$emit('input', $value, $inputItem, this);
            if ($inputItem.nested) {
                let $requestParams = {
                    url: $inputItem.nested.url,
                    method: $inputItem.nested.method || 'GET',
                    data: $inputItem.nested.data || {},
                };

                request($requestParams, true)
                    .then($response => {
                        let $items = formatData($response.data);
                        if ($items) {
                            let $params = {
                                'items': $items,
                                'beforeItem': $inputItem.nested.beforeItem || null,
                                'afterItem': $inputItem.nested.afterItem || $inputName,
                                'originalItems': this.dInputs,
                            };
                            this.dInputs = addItems($params);
                        }
                    })
                ;
            }
        },
        setAction(action) {
            this.dAction = action;
        },
        setMethod(method) {
            this.dMethod = method;
        },
    },
    mounted() {
        this.dForm = this.$refs.form
    }
}

</script>
