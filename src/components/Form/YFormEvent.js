import Vue from 'vue';

export default {
    ...(new Vue()),
    ...Object.freeze({
        EVENT_BEFORE_SUBMIT: 'beforeSubmit',
        EVENT_SUBMIT: 'submit',
        EVENT_BEFORE_REQUEST_SUBMIT: 'beforeRequestSubmit',
        EVENT_REQUEST_SUBMIT_SUCCESS: 'requestSubmitSuccess',
        EVENT_REQUEST_SUBMIT_FAIL: 'requestSubmitFail',
        EVENT_BEFORE_VALIDATE: 'beforeValidate',
        EVENT_VALIDATE_SUCCESS: 'validateSuccess',
        EVENT_VALIDATE_FAIL: 'validateFail'
    })
};
