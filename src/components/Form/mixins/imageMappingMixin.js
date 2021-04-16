import App from '@/App'
import EventBus from '@/eventBus'

const getSizeName = (src, size) => {

    size = size || 'sys';

    let imagePath = src.split('/');
    let imageName = imagePath[imagePath.length - 1];
    let parts = imageName.split('.');
    if (parts.length > 1) {
        parts[parts.length - 2] = parts[parts.length - 2] + '_' + size;
    }
    return parts.join('.');
};

const getWithAlbum = item => {
    let albums,
        album,
        src = '';
    ;

    EventBus.$emit('getAlbums', (_albums) => albums = _albums);

    if (albums) {
        album = albums.find(album => parseInt(album.id) === parseInt(item.album_id));
        if (album) {
            src = App.params.mediaServerDomain + '/image/photo/' + album.alias + '/' + getSizeName(item.image);
        }
    }

    return src;
};

export default {
    name: 'imageMappingMixin',
    methods: {
        // решение досталось в наследство. передавать moduleType как параметр в текущей реализации не получится - проверял дважды
        getImagePath(item, size) {
            let moduleType;

            if (item && item.album_id) {
                return getWithAlbum(item);
            }

            /* @TODO костыль
            иконки используются и в формах PageModule и в Directory в стикерах
            но в Directry нет привязки к модулям и EventBus.$emit('getModuleType' не поможет
             */
            if (item && item.icon) {
                return App.params.mediaServerDomain + '/image/sale-icon/' + getSizeName(item.icon, size);;
            }

            EventBus.$emit('getModuleType', result => moduleType = parseInt(result));

            switch (moduleType) {
                case 10:
                    if (item.image) {
                        return App.params.mediaServerDomain + '/image/illustrations/' + getSizeName(item.image, size);
                    }
                    break;
                case 17:
                case 18:
                    if (item.image_xs) {
                        // @TODO здесь надо переделать на image + xs
                        return App.params.mediaServerDomain + '/image/sale/' + getSizeName(item.image_xs, size);
                    }
                    break;
                case 13:
                case 14:
                    if (item.thumbnail) {
                        return App.params.mediaServerDomain + '/image/video/' + getSizeName(item.thumbnail, size);
                    }
                    break;
                case 29:
                    if (item.photo) {
                        return App.params.mediaServerDomain + '/image/light/' + getSizeName(item.photo, size);
                    }
                    break;
                case 36:
                    if (item.image) {
                        return App.params.mediaServerDomain + item.image;
                    }
                    break;
            }
        },
    },
}
