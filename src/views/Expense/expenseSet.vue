<template>
    <div>
         <div>费用设置</div>
         <div>
            <el-upload
                class="avatar-uploader"
                action="http://localhost:8081/api/image/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="data.imageUrl" :src="data.imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            
         </div>
         <div>
            <el-button @click="up">上传</el-button>
            <label>ssss:   </label>
            <label v-text="data.uploadUrl"></label>
        </div>
        <div>
            <Uploadimg  :imgName.sync="data.imgName" :config="uploadImgConfig"></Uploadimg>
        </div>
    </div>
   <!--
                :http-request="selectPicUpload"
                :before-upload="beforeAvatarUpload"
   -->
</template>
<script>
import { reactive, onMounted } from '@vue/composition-api'
import service from "@/utils/request";

// 组件
import Uploadimg from "@/components/Uploadimg"
export default {
    name: "expenseSet",
    components: { Uploadimg },

    setup(props, {root}) {

        const data = reactive({
            uploadUrl: 'http://localhost:8081/api/image/upload',
            imageUrl: "",
            imgUrl: "",
            imgName: ""
        })

        // 图片上传配置
        const uploadImgConfig = reactive({
            action: "http://localhost:8081/api/image/upload",
            show: true
        });




        const handleAvatarSuccess = (res, file) => {
            console.log("res")
            console.log(res);
            console.log("file")
            console.log(file);
            data.imageUrl = `${res}`;
            // data.imageUrl = URL.createObjectURL(file.raw);
            console.log(URL.createObjectURL(file.raw))
        }
        const beforeAvatarUpload = (file) => {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            console.log("file:  ")
            console.log(file);
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
        const onchange = (file, fileList) => {
            let event = event || window.event;
            console.log("event");
            console.log(event)
                 event.target.files[0];
                console.log("file")
                console.log(event.target.files[0])
                let reader = new FileReader(); 
                //转base64
                reader.onload = function(e) {
                  data.imageUrl = e.target.result //将图片路径赋值给src
                }
                reader.readAsDataURL(event.target.files[0]);
                return true;
        }

        const selectPicUpload = (file) => {
            console.log("上传图片的接口")
            console.log(file)
        }

        const up = () => {
            console.log("imgName: " + data.imgName)
        }

        onMounted(() => {
            console.log("data.uploadUrl: " + data.uploadUrl);
            // data.imgName = "xbzr05.jpg"
        })
        return {
            data, uploadImgConfig,
            handleAvatarSuccess, beforeAvatarUpload, onchange, selectPicUpload, up
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