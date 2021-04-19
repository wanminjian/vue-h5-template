<template>
    <div class="hold-list-container">
        <Header :title="title" :leftArrow="true"/>
        <van-pull-refresh v-model="isLoading" success-text="刷新成功" @refresh="onRefresh">
            <div class="hold-list-content" v-if="isShow">
                <div class="product_data_info">
                    <van-row type="flex" justify="center">
                        <van-col span="10">
                            <div :class="[{'total_amount': Number(product.dailyRiseFall) > 0},{'total_amount_loss': Number(product.dailyRiseFall) < 0},{'total_amount_zero': Number(product.dailyRiseFall) === 0}]">
                                {{product.dailyRiseFall}}%
                            </div>
                            <div class="total_amount_text">日涨跌幅</div>
                        </van-col>
                        <van-col span="10">
                            <div :class="[{'total_amount': Number(product.oneWeekIncomeRate) > 0},{'total_amount_loss': Number(product.oneWeekIncomeRate) < 0},{'total_amount_zero': Number(product.oneWeekIncomeRate) === 0}]">
                                {{product.oneWeekIncomeRate}}%
                            </div>
                            <div class="total_amount_text">近一周收益率</div>
                        </van-col>
                        <van-col span="10">
                            <div class="total_amount">{{product.nav}}</div>
                            <div class="total_amount_text">最新净值({{product.tradeTime| formatDate('MM-dd')}})</div>
                        </van-col>
                    </van-row>
                    <div class="line"></div>
                    <div class="product_risk_info">
                            <span>
                                {{product.fundType}}
                            </span>
                        <span>
                                {{product.riskLevel}}
                            </span>
                        <span>
                                {{product.minBuyAmtByIndi}}
                            </span>
                    </div>
                </div>
                <div class="nav_list">
                    <div class="nav_title">历史净值</div>
                    <van-list
                            v-model="loading"
                            :finished="finished"
                            :offset="10"
                            loading-text="加载中"
                            finished-text="没有更多了"
                            @load="onLoad"
                    >
                        <van-row type="flex" justify="center" class="data-list-title">
                            <van-col span="6" offset="1">
                                日期
                            </van-col>
                            <van-col span="6">
                                单位净值
                            </van-col>
                            <van-col span="6">
                                累计净值
                            </van-col>
                            <van-col span="6">
                                日涨跌幅
                            </van-col>
                        </van-row>
                        <van-row type="flex" justify="center" v-if="navList" v-for="item in navList" class="data-list">
                            <van-col span="6" offset="1">
                                {{item.navDate}}
                            </van-col>
                            <van-col span="6">
                                {{item.nav}}
                            </van-col>
                            <van-col span="6">
                                {{item.totalNav}}
                            </van-col>
                            <van-col span="6"
                                     :style="{ 'color': (Number(item.dailyRiseFall) <= 0 ? Number(item.dailyRiseFall) === 0? '': '#008000' : '#FF0000')}">
                                {{item.dailyRiseFall}}%
                            </van-col>
                        </van-row>
                    </van-list>
                </div>
            </div>
        </van-pull-refresh>
    </div>
</template>

<script>
    import {Row, Col, List, PullRefresh} from 'vant'
    import Header from '@/components/Header'
    import {getProductInfo, getFundNavList} from '@/api/user'
    import {fomatData} from "../../utils";

    export default {
        name: 'HoldDetail',
        components: {
            [Row.name]: Row,
            [Col.name]: Col,
            [PullRefresh.name]: PullRefresh,
            [List.name]: List,
            Header
        },
        data() {
            return {
                productCode: '',
                isShow: false,
                isLoading: false, //下拉状态
                loading: false,
                finished: false,
                title: '',
                product: {},
                navListCount: 0,
                page: 0,
                size: 10,
                navList: []
            }
        },
        created() {
            this.productCode = this.$route.params && this.$route.params.id;
            this.initData()
        },
        methods: {
            initData() {
                getProductInfo({fundCode: this.productCode})
                    .then(res => {
                        if (res.code === 1) {
                            this.isShow = true
                            this.product.fundCode = res.data.fundCode
                            this.product.fundName = res.data.fundName
                            this.product.fundType = res.data.fundType
                            this.product.riskLevel = res.data.riskLevel
                            this.product.nav = fomatData(res.data.nav, 4)
                            this.product.dailyRiseFall = fomatData((res.data.dailyrisefall || 0) * 100, 2)
                            this.product.tradeTime = res.data.tradeTime
                            this.product.oneWeekIncomeRate = fomatData(res.data.oneWeekIncomeRate * 100, 2) || '0.00'
                            this.product.minBuyAmtByIndi = '首次购买' + (res.data.minBuyAmtByIndi || '0.00') + '元'

                            this.title = '<div class="nav-bar-name">' + this.product.fundName + '</div><div class="nav-bar-code">' + this.product.fundCode + '</div>'
                        } else {
                            this.$toast({
                                message: res.error,
                                position: 'middle',
                                duration: 1500
                            })
                        }
                    })
                    .catch(error => {
                        this.$toast({
                            message: '服务器异常: ' + error,
                            position: 'middle',
                            duration: 1500
                        })
                    })

            },
            onRefresh() {
                this.page = 0;
                this.navList = [];
                this.initData()
                this.onLoad()
                setTimeout(() => {
                    this.isLoading = false
                }, 1500)
            },
            onLoad() {
                getFundNavList({fundCode: this.productCode, page: this.page, size: this.size})
                    .then(res => {
                        if (res.code === 1) {
                            let navs = res.data
                            this.loading = false;
                            if (navs == null || navs.length === 0) {
                                this.finished = true;
                            }
                            for (let i = 0; i < navs.length; i++) {
                                let o = {
                                    navDate: navs[i].occurtime,
                                    nav: fomatData(navs[i].nav, 4),
                                    totalNav: fomatData(navs[i].accumulativeNav, 4),
                                    dailyRiseFall: fomatData(navs[i].dailyrisefall * 100, 2)
                                }
                                this.navList.push(o)
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

    .hold-list-container {
        .hold-list-content {
            width: 100%;

            .product_data_info {
                height: 120px;
                padding-top: 30px;
                background-color: #ffffff;
                text-align: center;

                .total_amount_text {
                    height: 30px;
                    font-size: 13px;
                }

                .total_amount {
                    height: 30px;
                    font-size: 20px;
                    color: #FF0000;
                }

                .total_amount_zero {
                    height: 30px;
                    font-size: 20px;
                    color: #008000;
                }

                .total_amount_loss {
                    height: 30px;
                    font-size: 20px;
                    color: #008000;
                }

                .line {
                    width: 90%;
                    margin: 0 auto;
                    border-bottom: 1px solid #d4deda;
                }

                .product_risk_info {
                    margin-top: 20px;
                    color: #e0885e;
                    font-size: 14px;

                    span {
                        display: inline-block;
                        padding: 0 20px;
                        border-right: 1px solid #d4deda;
                    }

                    span:nth-last-child(1) {
                        border: none;
                    }
                }
            }

            .nav_list {
                font-size: 14px;

                .nav_title {
                    width: 100%;
                    height: 40px;
                    padding-left: 30px;
                    line-height: 40px;
                    color: #dc7070;
                    background-color: #F9ECD9;
                }

                .data-list-title {
                    color: #af9090;
                }

                .van-row {
                    text-align: center;
                    height: 40px;
                    line-height: 40px;
                }

                .van-row:nth-child(even) {
                    background-color: #F7F7F7;
                }

                .van-row:nth-child(odd) {
                    background-color: #FBFBFB;
                }
            }
        }

    }
</style>
