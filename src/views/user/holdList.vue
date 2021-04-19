<template>
    <div class="hold-list-container">
        <Header title="我的持仓"/>
        <van-pull-refresh v-model="isLoading"
                          success-text="刷新成功"
                          @refresh="onRefresh">
            <div class="list_bg">
                <div class="hold-userName">你好，{{this.userName}}</div>
            </div>
            <div class="content">
                <div class="hold-list-total">
                    <span class="placeholder_box"></span>
                    <van-row type="flex" justify="center">
                        <van-col>
                            <div class="total_amount_text">总金额（元）</div>
                            <div class="total_amount">{{formatMoney(totalHolds.totalAmount)}}</div>
                        </van-col>
                    </van-row>
                    <span class="placeholder_box"></span>
                    <van-row type="flex" justify="center">
                        <van-col span="15">
                            <div :class="[{'amount': Number(totalHolds.yesterdayIncome) > 0},{'amount_loss': Number(totalHolds.yesterdayIncome) < 0},{'amount_zero': Number(totalHolds.yesterdayIncome) === 0}]">{{formatMoney(totalHolds.yesterdayIncome)}}</div>
                            <div class="amount_text">昨日收益(元)</div>
                        </van-col>
                        <van-col span="15">
                            <div :class="[{'amount': Number(totalHolds.holdIncome) > 0},{'amount_loss': Number(totalHolds.holdIncome) < 0},{'amount_zero': Number(totalHolds.holdIncome) === 0}]">{{formatMoney(totalHolds.holdIncome)}}</div>
                            <div class="amount_text">持仓收益(元)</div>
                        </van-col>
                        <van-col span="15">
                            <div :class="[{'amount': Number(totalHolds.holdIncomeRate) > 0},{'amount_loss': Number(totalHolds.holdIncomeRate) < 0},{'amount_zero': Number(totalHolds.holdIncomeRate) === 0}]">{{totalHolds.holdIncomeRate}}%</div>
                            <div class="amount_text">持仓收益率</div>
                        </van-col>
                    </van-row>
                </div>

                <div class="hold-list" v-for="item in holdList" @click="jumpPage(item.fundCode)">
                    <van-row justify="left">
                            <div class="product-title">{{item.fundName}}</div>
                    </van-row>
                    <van-row type="flex" justify="center">
                        <van-col span="15">
                            <div class="prod_amount">{{formatMoney(item.amount)}}</div>
                            <div class="prod_amount_text">金额(元)</div>
                        </van-col>
                        <van-col span="15">
                            <div :class="[{'prod_amount_hold': Number(item.holdIncome) > 0},{'prod_amount_loss': Number(item.holdIncome) < 0},{'prod_amount_zero': Number(item.holdIncome) === 0}]">{{formatMoney(item.holdIncome)}}</div>
                            <div class="prod_amount_text">持仓收益(元)</div>
                        </van-col>
                        <van-col span="15">
                            <div :class="[{'prod_amount_hold': Number(item.holdIncomeRate) > 0},{'prod_amount_loss': Number(item.holdIncomeRate) < 0},{'prod_amount_zero': Number(item.holdIncomeRate) === 0}]">{{item.holdIncomeRate}}%</div>
                            <div class="prod_amount_text">持仓收益率</div>
                        </van-col>
                    </van-row>
                </div>
            </div>
        </van-pull-refresh>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {Row, Col, List, PullRefresh} from 'vant'
    import Header from '@/components/Header'
    import {formatMoney,fomatData} from '@/utils/index'
    import {getUserHoldList} from '@/api/user'

    export default {
        name: 'HoldList',
        components: {
            [Row.name]: Row,
            [Col.name]: Col,
            [PullRefresh.name]: PullRefresh,
            [List.name]: List,
            Header
        },
        data() {
            return {
                isLoading: false,
                totalHolds: {
                    totalAmount: 0,
                    yesterdayIncome: 0,
                    holdIncome: 0,
                    holdIncomeRate: '0.00',
                },
                holdList: [],
            }
        },
        computed: {
            ...mapGetters({
                userName: 'user/getUserName'
            })
        },
        mounted() {
            this.getData()
        },
        methods: {
            formatMoney,
            getData: function () {
                getUserHoldList({fundCode: this.productCode})
                    .then(res => {
                        if (res.code === 1) {
                            let total = res.data.total
                            this.totalHolds = {
                                totalAmount: total.totalAmount,
                                yesterdayIncome: total.lastEarnAmount,
                                holdIncome: total.earnAmount,
                                holdIncomeRate: fomatData(total.earnRatio * 100, 2),
                            }

                            let keys = Object.keys(res.data)
                            console.log(keys)
                            this.holdList.length = 0
                            for (let i = 0; i < keys.length; i++) {
                                if (keys[i] == 'total') continue
                                let userFund = {
                                    fundCode: res.data[keys[i]].fundcode,
                                    fundName: res.data[keys[i]].fundname,
                                    amount: res.data[keys[i]].totalAmount,
                                    holdIncome: res.data[keys[i]].earnAmount,
                                    holdIncomeRate: fomatData(res.data[keys[i]].earnRatio * 100,2),
                                }
                                this.holdList.push(userFund)
                            }
                        } else {
                            this.$toast({
                                message: res.error,
                                position: 'middle',
                                duration: 1500
                            })
                        }

                        setTimeout(() => {
                            this.isLoading = false
                        }, 1500)
                    })
                    .catch(error => {
                        this.isLoading = false
                        this.$toast({
                            message: error,
                            position: 'middle',
                            duration: 1500
                        })
                    })
            },
            onRefresh() {
                this.getData()
            },
            jumpPage(fundCode) {
                this.$router.push({path: `/product/${fundCode}`,});
            }
        }
    }
</script>
<style lang="scss" scoped>
    .hold-list-container {
        .van-pull-refresh {
            overflow: initial;
            background-color: #4f629d;
        }

        .list_bg {
            width: 100%;
            height: 198px;
            margin-top: -1px;
            display: inline-block;
            background-image: url('~@/assets/img/hold_bg.jpg');
            background-position: center 0;
            background-repeat: no-repeat;
            background-size: 100% auto;
        }

        .hold-userName {
            display: inline-block;
            margin-top: 30px;
            margin-left: 35px;
            font-size: 14px;
            color: #ffffff;
        }

        .content {
            width: 90%;
            height: auto;
            display: inline-block;
            position: absolute;
            top: 35%;
            left: 5%;

            .hold-list-total {
                height: 170px;
                border-radius: 10px;
                box-shadow: #42b983;
                background-color: #ffffff;
                text-align: center;

                .placeholder_box {
                    display: inline-block;
                    height: 30px;
                }

                .total_amount_text {
                    font-size: 10px;
                    height: 20px;
                }

                .total_amount {
                    height: 20px;
                    font-size: 20px;
                    color: #000;
                }

                .amount_text {
                    height: 30px;
                    font-size: 10px;
                }

                .amount {
                    height: 30px;
                    font-size: 16px;
                    color: #FF0000;
                }
                .amount_zero {
                    height: 30px;
                    font-size: 16px;
                    color: #008000;
                }
                .amount_loss {
                    height: 30px;
                    font-size: 16px;
                    color: #008000;
                }
            }
            .hold-list:last-child {
                /*margin-bottom: 20px;*/
                margin-bottom: 60px;
            }
            .hold-list {
                height: 120px;
                margin-top: 20px;
                border-radius: 10px;
                box-shadow: #42b983;
                background-color: #ffffff;
                text-align: center;

                .product-title {
                    text-align: left;
                    display: inline-block;
                    width: 100%;
                    margin: 20px 0 10px 10px;
                    font-size: 16px;
                    color: #000000;
                    height: 30px;
                }

                .prod_amount_text {
                    height: 30px;
                    font-size: 10px;
                }

                .prod_amount {
                    height: 30px;
                    font-size: 16px;
                }

                .prod_amount_hold {
                    height: 30px;
                    font-size: 16px;
                    color: #FF0000;
                }
                .prod_amount_zero {
                    height: 30px;
                    font-size: 16px;
                    color: #008000;
                }
                .prod_amount_loss {
                    height: 30px;
                    font-size: 16px;
                    color: #008000;
                }
            }
        }

    }
</style>
