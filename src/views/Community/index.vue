<template>
    <div>
        <template v-for="item in data.contentTop">
            <div class="main-top" :key="item.id">
                <div class="iBox">
                    <div class="iBox-title">
                        <span>总数</span>
                        <h5>业主</h5>
                    </div>
                </div>
            </div>
        </template>
        
    </div>
</template>
<script>
import { reactive } from '@vue/composition-api'
export default {
    name: "main",

    setup(props, { root }) {

        const data = reactive({
            contentTop:[
                {id: 1},
                {id: 2},
                {id: 3},
                {id: 4},
            ]
        })

        return {
            data
        }

    }
}
</script>
<style lang="scss" scoped>

.main-top {
    float: left;
    // position: fixed;
    z-index: 8999;
    height: 162px;
    width: 300px;
    // margin-bottom: 30px;
    margin: 0 20px;
    border-top: 2px solid #e7eaec;
    background-color: #fff;
    @include webkit(box-sizing,border-box); 
    .iBox {
        height: 100%;
        width: 100%;
        margin-bottom: 30px;
        .iBox-title {
            
        }
    }
    .search-title{
        line-height: 25px;
        font-weight:600;
        color: rgb(104, 107, 109);
        padding: 12px 20px 12px 20px;
        border-bottom: 1px solid #e7eaec;
       .moreButton {
           padding: 0 12px;
           float: right;
           line-height: 25px;
       }
        
    }
    .search-content {
        padding: 18px 20px 12px 20px;
        
        .searchButton {
            float: right;
        }

        .el_col_hidden {
            padding-top: 18px;
        }
    }
    
}
</style>