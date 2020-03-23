
<template>
    <div>
        <el-upload :disabled="!config.show"
            class="avatar-uploader"
            :action="config.action"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="data.imgUrl" :src="data.imgUrl" class="avatar">
            <i v-else-if="config.show" class="el-icon-plus avatar-uploader-icon"></i>
            <i v-else class="el-icon-picture avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>
<script>
import { reactive, watch, onMounted } from '@vue/composition-api'
export default {
    name: "Uploadimg",
    props: {
        imgUrl: {
            type: String,
            default: ""
        },
        imgName: {
            type: String,
            default: ""
        },
        config: {
            type: Object,
            default: () => {}
        }
    },
    setup(props, { root, emit }) {
        
        const data = reactive({
            action: root.$store.getters["common/uploadUrl"],
            imgUrl: "",
            imgUrlInfo: ""
        })
        

        /**
         * 监听
         */
        watch(() => props.imgName, (value) => {
            data.imgUrlInfo = value
            console.log(data.imgUrlInfo);
            if(data.imgUrlInfo != "" && data.imgUrlInfo != null){
                data.imgUrl = data.action + value
            }else{
                data.imgUrl = data.action + "u7ee4t.jpg"
            }
        })

        const handleAvatarSuccess = (res, file) => {
            
            let responseData = res.data;
            let image = `${data.action}${responseData.imgName}`;
            data.imgUrl = image;
            emit("update:imgName",responseData.imgName)
            // data.imageUrl = URL.createObjectURL(file.raw);
        }
        const beforeAvatarUpload = (file) => {
            console.log("file")
            console.log(file)
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                root.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                root.$message.error('上传头像图片大小不能超过 2MB!');
            }
            // let reader = new FileReader()
            // reader.readAsDataURL(file)
            // reader.onload = () => {
            //     let _base64 = reader.result
            //     data.imageUrl = _base64 //将_base64赋值给图片的src，实现图片预览
            // }
            // return false;
            return isJPG && isLt2M;
        }
        onMounted(() => {
            console.log(data.action)
        })
        return {
            data,
            handleAvatarSuccess, beforeAvatarUpload
        }
    }

}
</script>
<style lang="scss" scoped>
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>