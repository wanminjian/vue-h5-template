<template>
    <!-- 一个公共的table组件，供其他开发者使用，组件支持分页、排序和过滤功能。（只能使用vue框架进行开发，不能使用任何第三方组件库） -->
    <div>
        <table>
            <thead>
            <tr>
                <th v-for="(item, index) in columnsList"
                    :key="'col' + index">
                    <div style="position: relative;"
                         :class="{flex: item.hasSort}">
                        <div v-if="item.hasFilter"
                             class="filter-area"
                             @click="filterBy(item, index)">
                            <img class="filter"
                                 src="@/assets/icons/search.png">
                        </div>
                        <span @click="sortBy(item, index)">{{ item.colName }}</span>
                        <div v-if="item.hasSort"
                             class="sort-area"
                             @click="sortBy(item, index)">
                            <span :class="[!item.sortFlag || item.sortFlag === 'desc'? 'inActive': '','arrow' ,'asc']"></span>
                            <span :class="[!item.sortFlag || item.sortFlag === 'asc'? 'inActive': '','arrow' ,'desc']"></span>
                        </div>
                        <!-- 下拉列表 -->
                        <check-box v-if="item.showFilter"
                                   :list="item.filterList"
                                   :field="item.field"
                                   :showBack="showBackData"
                                   @reload="filterFun"></check-box>
                    </div>
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in listData"
                :key="'table' + item.id">
                <td v-for="(key, index) in columnsList"
                    :key="'colInner' + index">
                    {{ item[key.field] }}
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import checkBox from './checkbox.vue'

    export default {
        name: 'v-table',
        props: ['columns', 'data'],
        components: { checkBox },
        data () {
            return {
                listData: [],
                columnsList: [],
                columnsFliterList: [], // 筛选列数据列表
                showBackData: [] // 需要回显到筛选下拉列表中的数据
            }
        },
        computed: {
        },
        created () {
            this.listData = this.data;
            this.columnsList = this.columns;
            this.columnsList.forEach(item => {
                if (item.hasFilter) {
                    item.showFilter = false
                    item.filterList = []
                    this.listData.forEach(it => {
                        // 去重
                        if (item.filterList.findIndex(i => i === it[item.field]) === -1) {
                            item.filterList.push(it[item.field])
                        }
                    })
                }
            })
        },
        methods: {
            // 点击表头，排序：如果当前升序图标高亮，则置灰，将降序图标点亮并排序，反之亦然。
            sortBy (colInfo, index) {
                if (colInfo.hasSort) {
                    if (!colInfo.sortFlag) {
                        // 默认不排序。如有，则添加 标识sortFlag,用以显示“正序 倒序”
                        if (this.columnsList.findIndex(it => it.hasSort) > -1) {
                            this.columnsList.forEach(item => {
                                if (item.hasSort) {
                                    item.sortFlag = 'asc'
                                }
                                // 置灰其他列排序图标
                                if ((item.field !== colInfo.field) && item.sortFlag) {
                                    item.sortFlag = false
                                }
                                // 关闭所有筛选弹窗
                                item.showFilter = false
                            })
                        }
                        // 升序
                        colInfo.sortFlag = 'asc'
                        this.order(index, 'asc')
                    } else if (colInfo.sortFlag === 'asc') {
                        // 降序
                        colInfo.sortFlag = 'desc'
                        this.order(index, 'desc')
                    } else if (colInfo.sortFlag === 'desc') {
                        // 升序
                        colInfo.sortFlag = 'asc'
                        this.order(index, 'asc')
                    }
                }
            },
            // 设置排序函数
            order (index, type) {
                let sortFunction
                let field = this.columnsList[index].field
                switch (type) {
                    case 'asc':
                        sortFunction = function (a, b) {
                            return a[field] > b[field] ? 1 : -1
                        };
                        break;
                    case 'desc':
                        sortFunction = function (a, b) {
                            return a[field] < b[field] ? 1 : -1
                        };
                        break;
                }
                this.listData.sort(sortFunction)
            },
            // 点击搜索按钮，展示当前列该字段的所有数据
            filterBy (colInfo, index) {
                colInfo.showFilter = !colInfo.showFilter
                this.columnsList.forEach(item => {
                    if (item.hasFilter && (item.field !== colInfo.field)) {
                        item.showFilter = false
                    }
                    // 清空所有排序
                    item.sortFlag = false
                })
                this.columnsList = [...this.columnsList]
            },
            // 设置筛选方法
            filterFun ({ field, selectArr }) {
                // 关闭弹窗
                this.columnsList.find(item => item.field === field).showFilter = false
                this.columnsList = [...this.columnsList]
                // 筛选数据
                if (selectArr.length > 0) {
                    this.showBackData = selectArr
                    let list = []
                    selectArr.forEach(sel => {
                        this.data.forEach(it => {
                            if (it[field] === sel) {
                                list.push(it)
                            }
                        })
                    })
                    this.listData = [...list]
                } else {
                    this.showBackData = []
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    table {
        font-size: 13px;
        border-spacing: 0;
        border-collapse: initial;
        .flex {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        thead {
            /*background-color: #b1a2a226;*/
            th {
                color: #af9090;
                height: 30px;
                font-weight: normal;
                cursor: pointer;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                position: relative;
                .filter-area {
                    position: absolute;
                    left: 0;
                    top: 3px;

                    .filter {
                        width: 15px;
                    }
                }

                // 排序区域样式
                .sort-area {
                    display: flex;
                    flex-direction: column;
                    margin-left: 5px;
                    width: 5px;


                    .arrow {
                        display: inline-block;
                        vertical-align: middle;
                        width: 0;
                        height: 0;
                    }

                    .arrow.asc {
                        border-left: 4px solid transparent;
                        border-right: 4px solid transparent;
                        border-bottom: 4px solid #bb8181;
                        margin-bottom: 5px;
                    }

                    .arrow.desc {
                        border-left: 4px solid transparent;
                        border-right: 4px solid transparent;
                        border-top: 4px solid #bb8181;
                    }

                    .inActive {
                        opacity: 0.6;
                    }
                }
            }

        }

        th,
        td {
            width: 15%;
            height: 30px;
        }

        th.active {
            color: #fff;
        }

        th.active .arrow {
            opacity: 1;
        }

        tbody {
            tr {
                height: 40px;
                line-height: 40px;
                text-align: center;
            }
            tr:nth-child(even) {
                background-color: #F7F7F7;
              }

            tr:nth-child(odd) {
                background-color: #FBFBFB;
            }
        }

    }

</style>
