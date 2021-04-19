<template>
    <div class="pay-list-container">
        <Header :title="title" :leftArrow="false"/>
        <van-pull-refresh v-model="isLoading" success-text="刷新成功" @refresh="onRefresh">
            <div class="pay_list">
                <van-list
                        v-model="loading"
                        :finished="finished"
                        :offset="10"
                        loading-text="加载中"
                        finished-text="没有更多了"
                        @load="onLoad"
                >
                    <v-table :data="payList"
                             :columns="columns"></v-table>

                </van-list>
            </div>
        </van-pull-refresh>
    </div>
</template>

<script>
    import {Col, List, PullRefresh, Row} from 'vant'
    import Header from '@/components/Header'
    import vTable from '@/components/table'
    import {getUserPaymentList} from '@/api/user'
    import {formatMoney} from "../../utils";

    export default {
        name: 'PayList',
        components: {
            [Row.name]: Row,
            [Col.name]: Col,
            [PullRefresh.name]: PullRefresh,
            [List.name]: List,
            Header,
            vTable
        },
        data() {
            return {
                isLoading: false,
                loading: false,
                finished: false,
                title: '入金记录',
                page: 0,
                size: 10,
                payList: [],
                columns: [{
                    colName: '入金日期',
                    field: 'subscribeTime',
                    hasSort: false
                }, {
                    colName: '导入时间',
                    field: 'importTime',
                    hasSort: false
                }, {
                    colName: '入金金额',
                    field: 'amount',
                    hasSort: false
                }, {
                    colName: '可用金额',
                    field: 'remainAmount',
                    hasSort: false
                }],
            }
        },
        methods: {
            onRefresh() {
                this.page = 0;
                this.payList = [];
                this.onLoad();
                setTimeout(() => {
                    this.isLoading = false
                }, 1500)
            },
            onLoad() {
                getUserPaymentList({page: this.page, size: this.size})
                    .then(res => {
                        if (res.code === 1) {
                            this.loading = false;
                            if (res.data == null || res.data.length < this.size ) {
                                this.finished = true;
                            }
                            for (let i = 0; i < res.data.length; i++) {
                                let o = {
                                    subscribeTime: res.data[i].subscribeTime.substring(0,10),
                                    importTime: res.data[i].importTime.substr(10),
                                    amount: formatMoney(res.data[i].amount),
                                    remainAmount: formatMoney(res.data[i].remainAmount),
                                };
                                this.payList.push(o);
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
    .pay-list-container {
        width: 100%;
        .van-pull-refresh {
            height: calc(100vh - 96px);
            min-height: calc(100vh - 96px);
            overflow-y: scroll;
        }
        .pay_list {
            height: 100%;
            font-size: 14px;
        }
    }

</style>
