<template>
    <ImageForm
            :index="2"
            :item="value"
            :fromBuffer="cFromBuffer"
             @input="inputHandler"
    >
        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope"/>
        </template>
    </ImageForm>
</template>

<script>
    import baseMixin from '../mixins/baseMixin';
    import ImageForm from '@/components/FormData/partial/ImageForm.vue';

    export default {
        name: "CImageForm",
        mixins: [baseMixin],
        computed: {
            cFromBuffer() {
                if(this.value.image){
                    return true;
                }
                else{
                    return false;
                }
            }
        },
        components: {
            ImageForm,
        },
    }
</script>
