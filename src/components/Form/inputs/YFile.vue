<template>
  <v-card flat>
    <p>{{label}}</p>

    <div class="mb-2">
      <draggable v-model="dItems"
                 flat
                 @end="emitInput()"
      >
        <v-card v-for="(item, key) in dItems" :key="key"
                class="d-inline-block mr-1"
        >
          <v-img v-if="fileType === 'image'"
                 :src="getPreviewUrl(item)"
                 :width="thumbnailWidth"
                 :height="thumbnailHeight"
                 contain
          />
          <video v-else-if="fileType === 'video'"
                 :src="getPreviewUrl(item)"
                 :width="videoWidth"
                 :height="videoHeight"
                 controls
          ></video>
          <v-icon v-else
                  class="mx-auto my-3 c-document-preview-icon"
          >
            {{ getFilePreview(item) }}
          </v-icon>

          <v-card-actions>
            <v-btn small @click="removeItem(key)" class="mt-auto">Удалить</v-btn>
          </v-card-actions>
        </v-card>
      </draggable>
    </div>

    <div v-if="dShowDropzone">
      <v-card flat>
        <vue-dropzone ref="dropzone"
                      v-bind="$props"
                      id="dropzone"
                      :options="dDropzoneOptions"
                      @vdropzone-file-added="setDropzoneActionsState(true)"
                      @vdropzone-error="errorFile"
                      @vdropzone-removed-file="removeFile"
                      @vdropzone-success="uploadSuccessHandler"
                      @vdropzone-queue-complete="uploadSuccessMultipleHandler"
        />
        <v-card-actions>
          <v-btn color="primary" :disabled="!dEnableDropzoneUploadButton" @click="uploadFiles">Загрузить</v-btn>
          <v-btn color="primary" :disabled="!dEnableDropzoneClearButton" @click="clearFiles">Очистить</v-btn>
          <v-btn color="primary" @click="dShowDropzone=!dShowDropzone">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <v-card-actions v-else>
      <v-btn color="primary" @click="dShowDropzone=!dShowDropzone">Загрузить</v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
    import draggable from 'vuedraggable';
    import vue2Dropzone from 'vue2-dropzone';
    import 'vue2-dropzone/dist/vue2Dropzone.min.css';
    import imageMappingMixin from '@/components/Form/mixins/imageMappingMixin';
    import fileMixin from '../mixins/fileMixin';

    export default {
        name: 'YFile',
        mixins: [fileMixin, imageMappingMixin],
        data: function () {
            return {
                dItems: [],
                dShowDropzone: false,
                dEnableDropzoneUploadButton: false,
                dEnableDropzoneClearButton: false,
                dDropzoneOptions: {
                    ...{
                        paramName: this.name,
                        acceptedFiles: this.acceptedFiles,
                        autoProcessQueue: this.autoProcessQueue,
                        addRemoveLinks: this.addRemoveLinks,
                        params: this.params,
                        url: this.url,
                        thumbnailWidth: this.thumbnailWidth,
                        thumbnailHeight: this.thumbnailHeight,
                        maxFilesize: this.maxFilesize,
                        maxFiles: this.maxFiles,
                        timeout : () => this.timeout * 1000 ,
                    }, ...this.options
                }
            }
        },
        computed: {},
        watch: {
            value: {
                immediate: true,
                handler(value) {
                    this.dItems = this.normalizeItems(value);
                },
            }
        },
        methods: {
            normalizeItems(items) {
                let result = [];

                if (items) {
                    if (Array.isArray(items)) {
                        result = items;
                    }
                    else{
                        result.push(items);
                    }
                }

                return result;
            },
            getPreviewUrl(item) {
                if (item) {
                    return item.url || item.src || item;
                }
            },
            // @TODO - в дальнейшем можно допилить иконки сразу по типу файла зашитого в itmem
            getFilePreview(item) {
                let result;

                switch (this.fileType) {
                    case 'file':
                        result = 'widgets';
                        break;
                    case 'bar':
                        break;
                    default:
                        result = this.fileType;
                }

                return result;
            },
            clearFiles() {
                if (this.$refs.dropzone) {
                    this.$refs.dropzone.removeAllFiles();
                }
                this.setDropzoneActionsState(false);
            },
            removeFile(file, error, xhr) {
                if (this.$refs.dropzone.getAcceptedFiles().length === 0) {
                    this.setDropzoneActionsState(false);
                }
            },
            uploadFiles() {
                this.$refs.dropzone.processQueue();
            },
            removeItem(key) {
                this.dItems.splice(key, 1);
                //this.emitInput();
            },
            errorFile(file, message, xhr) {
                console.error('dropzone file Error: ', message);
                this.$refs.dropzone.removeFile(file);
            },
            setDropzoneActionsState(state) {
                if (state) {
                    this.dEnableDropzoneClearButton = true;
                    this.dEnableDropzoneUploadButton = true;
                } else {
                    this.dEnableDropzoneClearButton = false;
                    this.dEnableDropzoneUploadButton = false;
                }
            },
            uploadSuccessMultipleHandler(files, response) {
                if (this.clearDropzoneAfterUpload) {
                    this.clearFiles();
                }

                if (this.closeDropzoneAfterUpload) {
                    this.dShowDropzone = false;
                }
            },
            uploadSuccessHandler(file, response) {
                let data = [],
                    debug = false
                ;

                !debug || console.log('success', file, response);

                this.setDropzoneActionsState(false);

                /*
                 если ответ сождержит свойство совпадающее с именем текущего input-а,
                 например потому что FileController обрабатывает все input-ы сразу и результат возвращает в разрезе каждого intput-а
                 тогда берем результат из этого свойства
                 */
                if (response[this.name]) {
                    !debug || console.log('case 1');
                    // если вернулся массив файлов
                    if (Array.isArray(response[this.name])) {
                        !debug || console.log('case 2');
                        data = response[this.name];
                    }
                    // если это не массив и точно содержит свойство name
                    else if (response[this.name]['name']) {
                        !debug || console.log('case 3');
                        data.push(response[this.name]['name']);
                    }
                // если результат - сразу файл без оберток и массива результатов
                } else if (response['name']) {
                    !debug || console.log('case 4');
                    data.push(response['name']);
                // прислали непонятно что, главное чтобы был массив
                } else if (Array.isArray(response)) {
                    !debug || console.log('case 5');
                    data = response;
                } else {
                    console.log('Dropzone upload error');
                }

                !debug || console.log('result',
                    this.name,
                    response[this.name],
                    this.dItems, data,
                    this.dItems.concat(data)
                );

                if (this.multiple) {
                    this.dItems = this.dItems.concat(data);
                } else {
                    this.dItems = [data[0] || []];
                }

                this.emitInput();
            },
            emitInput() {
                this.$emit('input', this.dItems, this);
            },
        },
        components: {
            vueDropzone: vue2Dropzone,
            draggable
        }
    }
</script>

<style scoped>
  img {
    max-width: 300px;
    max-height: 100px;
    display: inline-block;
  }

  .c-document-preview-icon{
    font-size: 80px;
    margin: auto
  }
</style>

<style>
  .vue-dropzone .dz-preview .dz-remove {
    margin: 0;
    z-index: 2000;
    background: red;
    width: 100%;
    text-transform: none;
    font-weight: normal;
    border-radius: 15px;
    bottom: 101%;
    letter-spacing: normal;
    padding: 0;
  }
</style>
