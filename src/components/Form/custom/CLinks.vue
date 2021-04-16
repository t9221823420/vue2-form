<template>
    <v-container>
        <v-container style="max-height: 340px; overflow-y: scroll" v-if="dItems.length && !dShowForm">
            <v-row v-for="(item, i) in dItems" :key="i">
                <v-col cols="12">
                    <v-card>
                        <v-row>
                            <v-col cols="2">
                                <v-img v-if="item.photo && item.photo.image"
                                       :src="getImagePath(item.photo)"
                                       height="50px"
                                       width="50px"
                                />
                            </v-col>
                            <v-col cols="10">
                                <div><b>Заголовок:</b> {{item.title}}</div>
                                <div><b>Ссылка:</b> {{item.url}}</div>
                                <div><b>Описание:</b> {{item.description}}</div>
                            </v-col>
                        </v-row>

                        <v-card-actions>
                            <div class="flex-grow-1"></div>
                            <v-btn x-small @click="editItem(i)">Редактировать</v-btn>
                            <v-btn x-small @click="removeItem(i)">Удалить</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <v-container>
            <v-container v-if="dShowForm">
                <YText
                    v-model="dTitle"
                    name="title"
                    label="Заголовок"
                />

                <YText
                    v-model="dUrl"
                    name="url"
                    label="Ссылка"
                />

                <YTextarea
                    v-model="dDescription"
                    name="description"
                    label="Описание"
                />

                <CTableImages
                    v-model="dImage"
                    :headers="dCTableImagesHeaders"
                    :itemsUrl="dImageItemsUrl"
                />

                <v-btn @click="saveItem">Сохранить</v-btn>
                <v-btn @click="dShowForm = false">Закрыть</v-btn>
            </v-container>
            <v-btn v-else @click="addItem">Добавить</v-btn>
        </v-container>

    </v-container>
</template>

<script>
    import App from '@/App';
    import {request} from '@/helpers/requestHelper';
    import {setUrlParams} from '@/helpers/requestHelper';
    import baseMixin from '../mixins/baseMixin';
    import imageMappingMixin from '../mixins/imageMappingMixin';

    import YText from '../inputs/YText';
    import YTextarea from '../inputs/YTextarea';

    import CTableImages from './CTableImages';

    export default {
        name: 'CLinks',
        mixins: [baseMixin, imageMappingMixin],
        data: () => ({
            dItems: [],
            dShowForm: false,
            dTitle: null,
            dUrl: null,
            dDescription: null,
            dImage: null,
            dImageItemsUrl: setUrlParams(App.params.api.controllers.photos, {'per-page': 100, '@filter[album_id]': 0, '@expand': 'album'}),
            dCTableImagesHeaders: [
                {text: 'Наименование', value: 'title'},
                {text: 'Фотография', sortable: false, value: 'image'},
            ],
            dEditItemId: false,
        }),
        methods: {
            clearForm() {
                this.dEditItemId = false;
                this.dTitle = null;
                this.dUrl = null;
                this.dDescription = null;
                this.dSelectedAlbumId = null;
                this.dImage = null;
            },
            addItem() {
                this.clearForm();
                this.dShowForm = true;
            },
            editItem(i) {
                if (this.dItems[i]) {
                    let item = this.dItems[i];

                    this.dEditItemId = i;

                    this.dTitle = item.title;
                    this.dUrl = item.url;
                    this.dDescription = item.description;
                    this.dSelectedAlbumId = parseInt(item.album);

                    if(item.photo){
                        request({url: App.params.api.controllers.photos + '/' + item.photo.id}, true)
                            .then(({data}) => {
                                this.dImage = [data];
                            });
                    } else {
                        this.dImage = null;
                    }

                    this.dShowForm = true;
                }
            },
            saveItem() {
                let item,
                    i = this.dEditItemId
                ;

                if (i !== false && this.dItems[i]) {
                    item = this.dItems[i];
                    item.title = this.dTitle;
                    item.url = this.dUrl;
                    item.description = this.dDescription;
                    item.album = this.dSelectedAlbumId;
                } else {
                    item = {
                        title: this.dTitle,
                        url: this.dUrl,
                        description: this.dDescription,
                        album: this.dSelectedAlbumId,
                    };
                }

                if (this.dImage) {
                    item.photo = {
                        id: this.dImage.id,
                        image: App.params.imagePaths.staticList + this.dImage.image,
                    };
                }

                if (i === false) {
                    this.dItems.push(item);
                }

                this.emitInput();
            },
            removeItem(i) {
                if (this.dItems[i]) {
                    this.dItems.splice(i, 1);
                }
                this.emitInput();
            },
            emitInput() {
                this.dShowForm = false;
                this.$emit('input', this.dItems, this);
            }
        },
        watch: {
            value: {
                immediate: true,
                handler(val) {
                    if (typeof val === 'object') {
                        this.dItems = val;
                    }
                }
            },
        },
        components: {
            YText,
            YTextarea,
            CTableImages,
        },
    }
</script>
