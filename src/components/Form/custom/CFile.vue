<template>
  <YFile v-bind="$props"
         :options="dDropzoneOptions"
         :autoProcessQueue="true"
         :clearDropzoneAfterUpload="true"
         :closeDropzoneAfterUpload="true"
         :maxFilesize="300"
         @input="inputHandler"
  />
</template>

<script>
    import App from '@/App';
    import fileMixin from '../mixins/fileMixin';
    import YFile from '../inputs/YFile';

    export default {
        name: 'CFile',
        mixins: [fileMixin],
        data: function () {
            return {
                dDropzoneOptions: {...{
                        headers: {
                            Authorization: 'Basic ' + App.getApiAuthToken()
                        },
                        dictDefaultMessage: 'Для загрузки, перетащите файл сюда.',
                        dictFileTooBig: 'Недопустимый размер файла.',
                        dictMaxFilesExceeded: 'Нельзя загружать более одного файла.',
                    }, ... this.options}
            }
        },
        components: {
            YFile,
        },
    }
</script>
