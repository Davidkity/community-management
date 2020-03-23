
<template>
    <div>
        <div>房屋费用向设置</div>
        <div>
            
            <CityPicker/>
        </div>
    </div>
    
</template>
<script>
import { reactive } from '@vue/composition-api';

//组件
import CityPicker from "@/components/CityPicker";
export default {
    name: "costItemSet",
    components: { CityPicker },

    setup(props, { root }) {
        const house_id = root.$route.params.houeId;
        const data = reactive({
            houseId: house_id
        })


        return {
            data
        }
    }
}
</script>
<style lang="scss" scoped>

</style>