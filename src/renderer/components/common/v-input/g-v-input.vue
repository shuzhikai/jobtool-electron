/*
    创建者：shuxiaokai
    创建时间：2020-07-08 13:14
    模块名称：带验证规则的input输入框
    备注：xxxx
*/
<template>
    <div class="v-input" :class="{'valid-error': error}">
        <el-input v-if="!remote" :value="value" v-bind="$attrs"  v-on="$listeners">
            <template slot="prepend">
                <slot name="prepend"/>
            </template>
        </el-input>
        <el-autocomplete 
                v-else :value="value"
                v-bind="$attrs"
                value-key="key"
                popper-class="g-v-autocomplete"
                class="w-100"
                v-on="$listeners"
                :fetch-suggestions="querySearchAsync"
                :trigger-on-focus="false"
                :highlight-first-item="true"
                @select="handleSelect"
                @input="handleAutocompleteInput"
        >

            <template slot-scope="{ item }">
                <!-- <div>{{ item.key }}</div> -->
                <s-emphasize :value="item.key" :keyword="currentQuerystring" class="d-flex"></s-emphasize>
                <span class="f-sm gray-500">{{ item.type }}</span>
            </template>
        </el-autocomplete>
        <span v-show="error" class="error-tip">
            <span v-if="tip">{{ tip.message ? tip.message : tip }}</span>
            <span v-show="tip && tip.reference" class="theme-color ml-2" @click="handleJumpToStander">查看规范</span>
            <slot name="tip" />
        </span>
    </div>
</template>

<script>
export default {
    props: {
        value: { //-----------v-model的值
            type: [String, Number],
            default: ""
        },
        tip: { //-------------错误提示信息
            type: [Object, String],
            default() {
                return null;
            }
        },
        error: { //-----------是否错误
            type: Boolean,
            default: false
        },
        remote: { //---------是否远程搜索
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            mindParams: [], //-------------联想参数
            currentQuerystring: "", //-----当前键入的查询字符串
            couldGetMindParams: false, //--是否允许联想查询
            cancelTimer: null
        };
    },
    computed: {
        mindRequestParams() {
            return this.$store.state.apidoc.mindParams.mindRequestParams
        },
        mindResponseParams() {
            return this.$store.state.apidoc.mindParams.mindResponseParams
        },
    },
    mounted() {
        
    },
    methods: {
        //初始化联想参数
        initMindParams() {
            // const projectId = this.$route.query.id;
            // let reqMindParams = localStorage.getItem("pages/mindParams/request") || "{}";
            // let resMindParams = localStorage.getItem("pages/mindParams/response") || "{}";
            // reqMindParams = JSON.parse(reqMindParams);
            // resMindParams = JSON.parse(resMindParams);
            // reqMindParams[projectId] || (reqMindParams[projectId] = []) 
            // resMindParams[projectId] || (resMindParams[projectId] = []) 
            // this.mindParams = [...reqMindParams[projectId], ...resMindParams[projectId]];
        },
        //=====================================组件间交互====================================//  
        //查看规范
        handleJumpToStander() {
            window.open(this.tip.reference)
        },
        //联想输入
        querySearchAsync(queryString, cb) {
            // if (!this.couldGetMindParams) { //必须在输入的时候才允许联想
            //     cb([]);
            // }
            const mindParams = this.mindRequestParams.concat(this.mindResponseParams)
            this.currentQuerystring = queryString;
            const matchedParams = mindParams.filter(val => val.key.toLocaleLowerCase().includes(queryString))
            // console.log(matchedParams, this.mindParams, queryString)
            if (queryString.trim() === "") {
                cb([]);
            } else if (matchedParams.length > 0) {
                cb(matchedParams);
            } else {
                cb([])
            }
        },
        //选择
        handleSelect(val) {
            this.$emit("mindParamsSelect", val);
        },
        handleAutocompleteInput() {
            // this.couldGetMindParams = true;
            // clearTimeout(this.cancelTimer);
            // this.cancelTimer = setTimeout(() => {
            //     this.couldGetMindParams = false;
            // }, 1000)
        },
        //=====================================其他操作=====================================//

    }
};
</script>



<style lang="scss">
.v-input {
    width: 100%;
    position: relative;
    &.valid-error {
        .el-input__inner {
            animation: flash 2s infinite alternate;
            border-bottom: 1px solid $red!important;
        }
    }
    .error-tip {
        text-indent: size(12);
        font-size: size(12);
        position: absolute;
        top: size(30);
        line-height: size(12);
        left: 0;
        color: $orange;
    }
    @keyframes flash {
        0% {
            opacity: 1;
            background: mix($orange, $white, 30%);
        }
        100% {
            background: $white;
        }
    }
}
.g-v-autocomplete {
    li {
        line-height: 1.3;
        margin-bottom: size(10);
    }
}
</style>
