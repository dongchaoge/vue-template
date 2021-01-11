<template>
  <div class="login-wrap" flex="dir:top box:last">
    <div flex="box:mean">
      <div
        class="login-image over_hide"
        flex="cross:center main:center"
        :style="{
          background: `url(${$root.companyConfig.FE_M_LOGIN_BACNGROUND}) top/cover  no-repeat`
        }"
      >
        <img class="platform-logo" src="~@image/logo_gm.png" />
        <div class="login-txt" flex="dir:top cross:center main:center">
          <p class="fs60">{{ $root.companyConfig.FE_M_LOGIN_TEXT }}</p>
          <p class="mt8 fs30 text_c">{{ $root.companyConfig.FE_M_LOGIN_SLOG }}</p>
        </div>
      </div>
      <div class="login-box position_r" flex="dir:top main:center">
        <div class="login-content">
          <div flex="cross:center">
            <div class="logo-image">
              <img
                v-if="$root.companyConfig.FE_M_LOGIN_LOGO"
                :src="$root.companyConfig.FE_M_LOGIN_LOGO"
              />
            </div>
            <div class="ml16 login-tip">
              <p>登入您的账号</p>
              <p>进入数字化管理</p>
            </div>
          </div>
          <div class="input-item mt32">
            <div class="input-label">
              <a-icon type="user" />
            </div>
            <span class="input-clear" v-if="account" @click="clearInput('account')">
              <a-icon type="close" class="pointer" />
            </span>
            <input placeholder="请输入账号" maxlength="11" v-model="account" />
          </div>
          <div class="input-item mt32">
            <div class="input-label">
              <a-icon type="lock" />
            </div>
            <span class="input-clear" v-if="password" @click="clearInput('password')">
              <a-icon type="close" class="pointer" />
            </span>
            <input
              type="password"
              @keyup.enter="login"
              placeholder="请输入密码"
              v-model="password"
            />
          </div>
          <div class="mt48" flex="cross:center">
            <a-button block :loading="loading" class="fs16 login-btn w100" @click="login"
              >登录</a-button
            >
            <!-- <p class="color_info text_c cursor_p ml36" @click="handlePassword">忘记密码？</p> -->
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">
      <p class="site-info fs12">{{ $root.companyConfig.FE_M_LOGIN_COPYRIGHT }}</p>
    </div>
  </div>
</template>

<script>
import { Button, Icon } from 'ant-design-vue'
export default {
  name: 'Login',
  data () {
    return {
      account: '',
      password: '',
      loading: false
    }
  },
  created () {
    // 移除所有的二级页面
    document.querySelectorAll('.dui-slide-wrap').forEach(_ => _.remove())
  },
  methods: {
    handlePassword () {
      this.$message.info('请联系客服找回密码。')
    },
    clearInput (field) {
      this[field] = ''
    },
    login () {
      if (!this.account) {
        this.$message.error('请输入用户账号')
        return
      }
      if (!this.password) {
        this.$message.error('请输入密码')
        return
      }
      this.loading = true
      this.$store
        .dispatch('user/login', {
          account: this.account,
          password: this.password
        })
        .then(() => {
          this.$router.push({ path: '/' }).catch(() => {
            // 这个就很恶心~我确实需要重定向，但router也确实会报错
          })
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  components: {
    'a-button': Button,
    'a-icon': Icon
  }
}
</script>

<style lang="less" scoped>
.login-wrap {
  width: 100%;
  height: 100vh;
  background: var(--dark-disabled-color-bg);
}
.copyright {
  height: 32px;
  line-height: 32px;
  background: var(--dark-color-bg);
  text-align: center;
}
.login-image {
  position: relative;
  .login-txt {
    color: #fff;
  }
  .platform-logo {
    position: absolute;
    top: 32px;
    left: 32px;
    height: 40px;
    z-index: 3;
    color: #fff;
  }
}
.login-box {
  height: 100%;
  min-width: 400px;
}
.login-content {
  width: 380px;
  margin: 0 auto;
}
.system-title {
  font-size: 42px;
  padding: 50px 0 0 50px;
}
.sub-title {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
}
.logo-image {
  padding: 8px;
  width: 84px;
  height: 84px;
  font-size: 24px;
  background: var(--dark-color-bg);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.16);
  img {
    height: 100%;
  }
}
.login-tip {
  color: #fff;
  font-size: 30px;
}
.company-name {
  position: absolute;
  width: 1em;
  height: 1em;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  letter-spacing: 16px;
  &:before {
    content: attr(data-text);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) rotate(90deg);
  }
}
.input-item {
  position: relative;
  background: var(--dark-color-bg);
  .input-label {
    position: absolute;
    top: 50%;
    margin-left: 16px;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.65);
  }
  .input-clear {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.65);
  }
  input {
    width: 100%;
    padding: 7px 26px 7px 48px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.65);
    border-radius: 4px;
    // &:focus {
    //   border-color: rgba(0, 0, 0, 0.45);
    // }
  }
}
.login-btn {
  background: #1890ff;
  height: 40px;
  border: none;
  color: #fff;
}
.site-info {
  color: #999;
  text-align: center;
}
input:-webkit-autofill {
  -webkit-transition-delay: 99999s;
  -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
}
</style>
