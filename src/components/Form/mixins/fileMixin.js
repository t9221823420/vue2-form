import baseMixin from './baseMixin';

export default {
  name: 'fileMixin',
  mixins: [baseMixin],
  props: {
    fileType: String,
    multiple: {
      type: Boolean,
      default: true,
    },
    clearDropzoneAfterUpload: {
      type: Boolean,
      default: false,
    },
    closeDropzoneAfterUpload: {
      type: Boolean,
      default: false,
    },
    videoWidth: {
      type: Number,
      default: 300,
    },
    videoHeight: {
      type: Number,
      default: 150,
    },

    options: Object, // настройки оригинального плагина Dropzone
    params: Object, // дополнительные параметры, которые будут передаваться при аплоаде файлов
    acceptedFiles: String,
    autoProcessQueue: {
      type: Boolean,
      default: false,
    },
    addRemoveLinks: {
      type: Boolean,
      default: true,
    },
    url: {
      type: String,
      default: 'https://httpbin.org/post',
    },
    maxFiles: {
      type: Number,
      default: 1,
    },
    timeout : {
      type: Number,
      default: 90,
    },
    maxFilesize: {
      type: Number,
      default: 10,
    },
    thumbnailWidth: {
      type: Number,
      default: 120,
    },
    thumbnailHeight: {
      type: Number,
      default: 120,
    },
    thumbnailMethod: {
      type: String,
      default: 'contain',
    },
  }
}
