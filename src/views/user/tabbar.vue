<template>
    <div>
        <van-tabbar v-model="active" class="active_tab">
            <van-tabbar-item
                    v-for="(item,index) in tabbars"
                    :key="index" :icon="item.icon"
                    @click="tab(index,item.path)"
                    placeholder="true"
            >
                <span :class="currIndex === index ? active:''">{{item.title}}</span>
                <!--                <template slot="icon" slot-scope="props">-->
                <!--                    <img :src="props.active ? item.active : item.normal">-->
                <!--                </template>-->
            </van-tabbar-item>
        </van-tabbar>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "tabbar",
        data() {
            return {
                currIndex: 0,
                active: 0,
                tabbars: [
                    {
                        title: '我的持仓',
                        path: '/holders',
                        name: 'holdList',
                        icon: 'home-o'
                    },
                    {
                        title: '入金记录',
                        path: '/user/pay',
                        name: 'pay',
                        icon: 'orders-o'
                    },

                    {
                        title: '交易记录',
                        path: '/user/trade',
                        name: 'trade',
                        icon: 'balance-list-o'
                        // normal: require("../common/icon/mine.png"),
                        // active: require("../common/icon/mine_ac.png")
                    }
                ]
            };
        },
        created() {
            const path = this.$route.path;
            for (let i = 0; i < this.tabbars.length; i++) {
                if (this.tabbars[i].path === path) {
                    this.currIndex = i;
                    this.active = i;
                    break;
                }
            }
        },
        methods: {
            tab(index, val) {
                this.currIndex = index;
                this.$router.push(val);
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>
