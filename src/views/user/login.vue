<template>
    <div class="login-container">
        <div class="header">
            <div class="login-title">
                <!--     <van-icon name="cross" />-->
                <span>登录</span>
            </div>
        </div>
        <div class="content">
            <van-form @submit="doLogin"
                      validate-first
                      :show-error="false">
                <van-field
                        label="手机号"
                        placeholder="请输入手机号码"
                        type="tel"
                        name="mobileNo"
                        size="large"
                        clearable
                        v-model="phoneNumber"
                        :rules="[{ required: true, message: '请输入手机号码' },{ pattern: phoneNumberPattern, message: '请输入正确的手机号码' }]"></van-field>
                <van-field
                        label="验证码"
                        placeholder="验证码"
                        name="code"
                        v-model="code"
                        size="large"
                        :rules="[{ required: true, message: '请输入验证码' }]"
                >
                    <div slot="button" @click.prevent="getVerifyCode" class="verify-code-btn">
                        <ValidationCode :identifyCode="validationCode" :contentWidth="85" :contentHeight="30"/>
                    </div>
                </van-field>

                <van-field
                        label="动态码"
                        placeholder="短信验证码"
                        name="messageCode"
                        v-model="messageCode"
                        type="number"
                        size="large"
                        :rules="[{ required: true, message: '短信验证码不能为空' },{ pattern: codePattern, message: '请输入4位短信验证码' }]"
                >
                    <van-button
                            slot="button"
                            type="primary"
                            size="small"
                            class="verify-mess-btn"
                            @click.prevent="sendMessageCode"
                            :disabled="!!codeRestTime"
                    >{{codeRestTime ? `${codeRestTime}s重新获取` : '获取动态码'}}
                    </van-button>
                </van-field>

                <div class="button-wrap">
                    <van-button round block type="info" native-type="submit">登录</van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>
<script>
    import {Button, Field, Form, Icon} from 'vant'
    import ValidationCode from '@/components/ValidationCode'
    import {mapActions} from 'vuex'
    import {getValidationCode, getMessageCode, login} from '@/api/user'

    export default {
        name: 'Login',
        props: {
            restTime: {
                type: Number,
                default: 30
            }
        },
        components: {
            [Field.name]: Field,
            [Icon.name]: Icon,
            [Button.name]: Button,
            [Form.name]: Form,
            ValidationCode
        },
        data() {
            return {
                validationCode: '',
                codeRestTime: 0,
                phoneNumber: '',
                code: '',
                messageCode: '',
                phoneNumberPattern: /^1[34578][0-9]\d{8}$/, //修改手机的正则/^1[34578][0-9]\d{8}$/
                codePattern: /^\d{4}$/,
            }
        },
        mounted() {
            this.getVerifyCode()
        },
        methods: {
            ...mapActions({
                saveUser: 'user/login'
            }),
            getVerifyCode() {
                //获取验证码
                getValidationCode().then(res => {
                    if(res.code === 1) {
                        this.validationCode = res.data
                    } else {
                        this.$toast(res.error)
                    }
                })
            },
            sendMessageCode() {
                if (!this.phoneNumber || !this.phoneNumberPattern.test(this.phoneNumber)) {
                    this.$toast('您输入正确的手机号码！')
                    return
                }

                if (!this.code || this.code.toLowerCase() != this.validationCode.toLowerCase()) {
                    this.$toast('您输入的验证码不正确，请重新输入！')
                    return
                }

                getMessageCode({mobileNo: this.phoneNumber, code: this.code})
                    .then(res => {
                        if(res.code === 1) {
                            this.$dialog.alert({
                                title: '提示',
                                message: res.data,
                            });
                            this.codeRestTime = this.restTime
                            let timer = setInterval(() => {
                                --this.codeRestTime
                                if (!this.codeRestTime) {
                                    clearInterval(timer)
                                    timer = null
                                }
                            }, 1000)
                        } else {
                            this.$toast(res.error)
                        }
                    })
                    .catch(error => {
                        this.$toast('短信验证码发送失败: ' + error)
                    })
            },
            doLogin(values) {
                login(values)
                    .then(res => {
                        if(res.code === 1) {
                            this.saveUser({
                                mobileTelNo : res.data.mobiletelno,
                                userName : res.data.investorname,
                                sex : res.data.sex,
                            })
                            this.$toast({
                                message: '登录成功',
                                position: 'middle',
                                duration: 1500
                            })
                            try {
                                setTimeout(() => {
                                    const redirect = this.$route.query.redirect || '/holders'
                                    this.$router.replace({
                                        path: redirect
                                    })
                                }, 1500)
                            }catch (e) {
                                this.$router.push({
                                    path: '/holders'
                                })
                            }
                        } else {
                            this.$toast('登录失败: ' + res.error)
                            setTimeout(() => {
                                this.getVerifyCode()
                            }, 1000)
                        }
                    })
                    .catch(error => {
                        this.$toast('登录失败:' + error)
                        setTimeout(() => {
                            this.getVerifyCode()
                        }, 1000)
                    })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .header {
        width: 100%;
        height: 300px;
        display: block;
        background-image: url('~@/assets/img/login.jpg');
        background-position: center 0;
        background-repeat: no-repeat;
        background-size: 100% auto;

        .login-title {
            font-size: 18px;
            font-weight: 500;
            color: #f8f8f8;
            /*i{*/
            /*    position: absolute;*/
            /*    top: 3%;*/
            /*    left: 5%;*/
            /*}*/
            span {
                position: absolute;
                top: 10%;
                left: 45%;

            }
        }
    }

    .content {
        width: 100%;
        height: auto;
        padding: 0 15px;
        box-sizing: border-box;

        .button-wrap {
            width: 100%;
            height: auto;
            margin-top: 15px;
            button {
                background-color: #4f629d;
                border: 1px solid #4f629d;
                font-size: 18px;
            }
        }
    }

    .verify-mess-btn {
        padding: 0 5px;
        min-width: 6.5em;
        background-color: #4f629d;
        border: 1px solid #4f629d;
        border-radius: 5px;
        /*background-color: #1989fa;*/
        /*border: 1px solid #1989fa;*/
    }

    .van-button--info {
    }
</style>
