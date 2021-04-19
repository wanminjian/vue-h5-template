<template>
    <div class="filter-pop-area">
        <ul>
            <li v-for="(item, index) in list"
                :key="'colFilter' + index">
                <input type="checkbox"
                       :id="'check' + index"
                       :checked="showBack.findIndex(i => i === item) > -1">
                <span>{{item}}</span>
            </li>
        </ul>
        <!-- 操作按钮 -->
        <div class="btns">
            <button @click="save">确认</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'check-box',
        props: ['list', 'field', 'showBack'],
        data() {
            return {
                selectArr: []
            }
        },
        created() {
        },
        methods: {
            // 将勾选的数据传到父组件，并且关闭弹窗
            save() {
                this.selectArr = []
                for (let i = 0; i < this.list.length; i++) {
                    if (document.getElementById(`check${i}`).checked) {
                        this.selectArr.push(this.list[i])
                    }
                }
                this.$emit('reload', {
                    field: this.field,
                    selectArr: this.selectArr
                })
            }
        }
    }
</script>

<style lang="scss" scoped>

    .filter-pop-area {
        position: absolute;
        top: 20px;
        background: #fff;
        border: 1px solid #aaa;
        border-radius: 5px;

        ul {
            color: #777;
            list-style: none;
            padding: 0 10px;
            min-width: 80px;
            text-align: left;
            font-size: 14px;
        }

        .btns {
            padding: 0 7px 7px 0;
            text-align: right;
        }
    }
</style>
