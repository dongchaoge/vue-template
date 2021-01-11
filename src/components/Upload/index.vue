<template>
  <div class="my-upload" flex="wrap:wrap">
    <div v-for="(file, index) in value" :key="index" class="my-upload-item">
      <!-- 文件 -->
      <div
        v-if="isFile(file)"
        @click="previewImage(index, file)"
        flex="dir:top main:center"
        class="my-upload_file"
      >
        <a-icon class="fs28 mt8" type="file-pdf" />

        <p class="my-upload_file_name mt8 fs12 ellipsis">
          {{ getFileName(file) }}
        </p>
      </div>
      <!-- 文件 -->

      <!-- 图片 -->
      <img
        @click="previewImage(index, file)"
        v-else
        :src="file"
        class="my-upload_img"
      />
      <!-- 图片 -->

      <div class="file-cover" v-if="upload" flex="cross:center main:center">
        <a-icon
          type="eye"
          @click="previewImage(index, file)"
          :style="{ color: '#fff', fontSize: '24px', cursor: 'pointer' }"
        />
        <a-icon
          type="delete"
          class="ml8"
          :style="{ color: '#fff', fontSize: '24px', cursor: 'pointer' }"
          @click="removeFile(index)"
        />
      </div>
    </div>

    <viewer @inited="inited" :images="value" style="display:none">
      <img
        v-for="(image, index) in value"
        :ref="'image' + index"
        :key="index"
        :src="image"
      />
    </viewer>

    <!-- 上传 -->
    <div
      v-if="value.length < max && upload"
      class="my-upload-item my-upload-icon"
      flex="dir:top main:center cross:center"
    >
      <!-- <a-icon class="fs28" type="plus" />
      <p class="upload-text fs12 ellipsis">{{ uploadText }}</p> -->
      <a-icon class="fs28" :class="{mt8:uploadText}" type="plus" />

        <p  v-if="uploadText" class="my-upload_file_name mt8 fs12 ellipsis">
          {{ uploadText }}
        </p>

      <form ref="form" class="form">
        <input
          class="file-input"
          :accept="accept"
          type="file"
          :multiple="max > 1"
          @change="onChange"
        />
      </form>

      <div v-if="uploading" class="loading-tip" flex="main:center cross:center">
        <a-spin />
      </div>
    </div>
    <!-- 上传 -->
  </div>
</template>

<style lang="less" scoped>
.my-upload {
  display: inline-block;
  margin-top: -12px;
  --img-width: 65px;
}
.my-upload_img {
  cursor: pointer;
  object-fit: cover;
  border: 1px solid var(--divider-color);
}
.my-upload_file {
  width: 100%;
  height: 100%;
  border: 1px solid var(--divider-color);
  position: relative;
}
.my-upload_file_name {
    width: 100%;
    height: 20px;
    line-height: 20px;
    text-align: center;
    // position: absolute;
    // bottom: 0;
    // left:0;
    padding: 0 4px;
  }
.my-upload-item {
  position: relative;
  width: var(--img-width);
  height: var(--img-width);
  border-radius: 4px;
  margin-top: 12px;
  margin-right: 12px;
  img {
    height: 100%;
    width: 100%;
  }
  &.my-upload-icon {
    width: var(--img-width);
    height: var(--img-width);
    border: 1px dashed #d9d9d9;
    cursor: pointer;
  }
  .file-input {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    opacity: 0;
    cursor: pointer;
  }
  .loading-tip {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1;
    background: #fff;
    opacity: 0.8;
    color: #fff;
  }
  .file-cover {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1;
    background: #333;
    opacity: 0;
    &:hover {
      opacity: 0.8;
    }
  }
}

</style>

<script>
import { Icon, Spin } from 'ant-design-vue'
import { removeByIndex } from '@util'
import upload from './upload'

export default {
  props: {
    // 用于判断是上传还是预览
    upload: {
      type: Boolean,
      default: true
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    fileList: {
      type: Array,
      default: () => {
        return []
      }
    },
    max: {
      type: Number,
      default: 9
    },
    folder: String,
    flag: String,
    uploadText: {
      type: String,
      default: ''
    },
    accept: {
      type: String,
      default: 'image/gif, image/jpeg, image/jpg, image/png, image/webp, image/svg, .pdf'
    }
  },
  data () {
    return {
      uploading: false,
      tempList: []
    }
  },
  watch: {
    value (val) {
      this.tempList = this.value
    }
  },
  created () {
    this.tempList = this.value
  },
  methods: {
    onChange (event) {
      const files = event.target.files
      const len = files.length
      if (len + this.tempList.length > this.max) {
        this.$message.error(`最多上传${this.max}张图片`)
        return
      }
      let count = 0
      this.uploading = true

      for (let i = 0; i < len; i++) {
        const [date, time] = this.$fn
          .fmtdate(new Date(), 'yyyyMMdd hhmmss')
          .split(' ')
        const randomStr = Math.random()
          .toString(36)
          .substr(2, 6)

        const fileName = files[i].name

        let key =
          'itrade/' +
          this.folder +
          '/' +
          date +
          '/' +
          time +
          randomStr +
          fileName

        // 去除逗号 因为展示的时候根据逗号分割
        key = key.replace(/,/g, '')

        // 上传
        upload(files[i], key)
          .then(url => {
            count++
            if (count === len) {
              this.uploading = false
            }
            this.tempList.push(url)
            this.$emit('input', this.tempList)
            this.$emit('change')
            this.$emit('success', url, this.flag)

            this.$refs.form.reset()
          })
          .catch(err => {
            this.uploading = false
            this.$refs.form.reset()
            if (err) {
              this.$message.error(err.error || '上传图片失败，请稍后再试')
            }
            this.$message.error('上传图片失败，请稍后再试')
          })
      }
    },
    inited (viewer) {
      this.$viewer = viewer
    },
    isFile (url) {
      if (url && url.split('.').slice(-1)[0] === 'pdf') {
        return true
      }
      return false
    },
    getFileName (file) {
      try {
        return file.match('[^/]+(?!.*/)')[0].slice(12)
      } catch (err) {
        console.log(err)
        return 'xxxxx'
      }
    },
    previewImage (index, url) {
      if (this.isFile(url)) {
        window.open(url)
        return
      }
      this.$refs['image' + index][0].click()
    },
    removeFile (index) {
      this.tempList = removeByIndex(this.tempList, index)
      this.$emit('input', this.tempList)
      this.$emit('change')
      this.$emit('remove', index, this.flag)
    }
  },
  components: {
    'a-icon': Icon,
    'a-spin': Spin
  }
}
</script>
