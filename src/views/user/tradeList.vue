<template>
    <div class="trade-list-container">
        <Header :title="title" :leftArrow="false"/>
        <van-pull-refresh v-model="isLoading" success-text="刷新成功" @refresh="onRefresh">
            <van-list
                    v-model="loading"
                    :finished="finished"
                    :offset="10"
                    loading-text="加载中"
                    finished-text="没有更多了"
                    @load="onLoad"
            >
                <div class="content">
                    <div class="trade_list" v-for="item in tradeList">
                        <van-row justify="left">
                            <div class="product-title">{{item.fundNameAbbr}} ({{item.fundCode}})</div>
                        </van-row>
                        <div class="trade_middle">
                            <van-row type="flex">
                                <van-col span="8">
                                    <div class="prod_amount_text">单位净值(元)</div>
                                    <div class="prod_amount">{{item.nav}}</div>
                                </van-col>
                                <van-col span="8">
                                    <div class="prod_amount_text">
                                        确认金额(元)
                                    </div>
                                    <div class="prod_amount">{{item.confirmAmount}}</div>
                                </van-col>
                                <van-col span="8">
                                    <div class="prod_amount_text">
                                        确认份额(份)
                                    </div>
                                    <div class="prod_amount">{{item.confirmVol}}</div>
                                </van-col>
                            </van-row>
                        </div>
                        <div class="trade_bottom">
                            <div class="trade_bottom_left"> {{item.cfmbusinessName}} ({{item.transactionDate | formatDate('yyyy-MM-dd')}})</div>
                            <div class="trade_bottom_right"> {{item.result}}</div>
                        </div>
                    </div>
                </div>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
    import {Col, List, PullRefresh, Row} from 'vant'
    import Header from '@/components/Header'
    import {getUserTradeList} from '@/api/user'
    import {formatMoney, fomatData} from "../../utils";

    export default {
        name: 'PayList',
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
                loading: false,
                finished: false,
                title: '交易记录',
                page: 0,
                size: 10,
                tradeList: []
            }
        },
        methods: {
            onRefresh() {
                this.page = 0;
                this.tradeList = [];
                this.onLoad();
                setTimeout(() => {
                    this.isLoading = false
                }, 1500)
            },
            onLoad() {
                getUserTradeList({page: this.page, size: this.size})
                    .then(res => {
                        if (res.code === 1) {
                            this.loading = false;
                            if (res.data == null || res.data.length < this.size) {
                                this.finished = true;
                            }
                            for (let i = 0; i < res.data.length; i++) {
                                let o = {
                                    fundNameAbbr: res.data[i].fundnameabbr,
                                    fundCode: res.data[i].fundcode,
                                    nav: fomatData(res.data[i].nav, 4),
                                    confirmAmount: formatMoney(res.data[i].confirmedamount),
                                    confirmVol: formatMoney(res.data[i].confirmedvol),
                                    cfmbusinessCode: res.data[i].cfmbusinesscode,
                                    cfmbusinessName: res.data[i].cfmbusinessname,
                                    transactionDate: res.data[i].transactiondate,
                                    result: res.data[i].result,
                                };
                                this.tradeList.push(o);
                            }
                            ++this.page
                        } else {
                            this.finished = true;
                            this.$toast({
                                message: res.error,
                                position: 'middle',
                                duration: 1500
                            })
                        }
                    })
                    .catch(error => {
                        this.finished = true;
                        this.$toast({
                            message: '服务器异常: ' + error,
                            position: 'middle',
                            duration: 1500
                        })
                    })
            },
        }
    }
</script>
<style lang="scss" scoped>
    .trade-list-container {
        width: 100%;
        .van-pull-refresh {
            height: calc(100vh - 96px);
            min-height: calc(100vh - 96px);
            overflow-y: scroll;
        }

        .content {
            .trade_list:last-child {
                margin-bottom: 30px;
            }

            .trade_list {
                margin-top: 20px;
                padding: 10px;
                font-size: 14px;
                border-radius: 10px;
                box-shadow: #42b983;
                background-color: #ffffff;

                .product-title {
                    text-align: left;
                    color: #9e7c13;
                    font-weight: 200;
                    font-size: medium;
                }

                .van-row {
                    text-align: center;
                    height: 40px;
                    line-height: 40px;
                }

                .trade_middle {
                    height: 80px;
                    line-height: 80px;
                    border-bottom: 1px solid #ab9eb52e;
                }

                .trade_bottom {
                    position: relative;
                    width: 100%;
                    height: 40px;

                    .trade_bottom_left {
                        display: inline-block;
                        position: absolute;
                        top: 25%;
                        left: 5%;
                        font-weight: 600;
                    }

                    .trade_bottom_right {
                        display: inline-block;
                        text-align: right;
                        position: absolute;
                        top: 25%;
                        right: 5%;
                        font-weight: 600;
                    }
                }
            }
        }
    }

</style>
