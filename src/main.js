import Vue from 'vue';
import App from '@/App';
import YForm from '@/components/Form/YForm';

Vue.component('YForm', YForm);

new Vue({
    el: '#app',
    render: h => h(App)
});
