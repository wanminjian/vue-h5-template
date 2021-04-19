<template>
    <div>
        <van-nav-bar :border="false"
                     fixed
                     placeholder
                     @click-right="onClickRight" @click-left="onClickLeft">
            <template #title>
                <dl v-html="title">
                    {{title}}
                </dl>
            </template>
            <template #left v-if="leftArrow">
                <van-icon name="arrow-left" size="20" color="#ffffff"/>
            </template>
            <template #right>
                <van-icon name="ellipsis" size="20" color="#ffffff"/>
            </template>
        </van-nav-bar>
        <van-action-sheet
                v-model="showAction"
                :actions="actions"
                cancel-text="取消"
                :round="false"
                close-on-click-action
                @cancel="onCancel"
                @select="onSelect"
        />
    </div>
</template>
<script>
    import {mapActions} from 'vuex'
    import {ActionSheet, Button, Icon, NavBar} from 'vant'

    export default {
        name: 'Header',
        components: {
            [Icon.name]: Icon,
            [Button.name]: Button,
            [NavBar.name]: NavBar,
            [ActionSheet.name]: ActionSheet,
        },
        props: {
            title: String,
            leftText: String,
            rightText: String,
            leftArrow: Boolean,
        },
        data() {
            return {
                showAction: false,
                actions: [
                    {
                        name: '退出登录'
                    }
                    ],
            }
        },
        computed: {},
        methods: {
            ...mapActions({
                deleteUser: 'user/logOut'
            }),
            onClickRight() {
                this.showAction = true
            },
            onClickLeft() {
                this.$router.go(-1)
            },
            onCancel() {
            },
            onSelect(action, index) {
                this.deleteUser()
            }
        }
    }
</script>

<style lang="scss">
    .van-nav-bar {
        background-color: #4f629d;

        .van-nav-bar__title {
            color: #ffffff;
        }
    }

    .nav-bar-name {
        font-weight: 500;
        font-size: 16px;
    }

    .nav-bar-code {
        font-weight: 500;
        font-size: 12px;
    }

    .van-action-sheet__item {
        color: #ffffff;
        background-color: #4f629d;
    }

</style>
