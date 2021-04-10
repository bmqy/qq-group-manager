<template>
  <el-card class="box-card bmqyQQGroupManagerBox">
    <div slot="header" class="clearfix">
      <span class="title">{{name}}
        <span style="color:#909399;font-size:12px;font-weight:normal;">{{`ver${$app.getVersion()}`}}</span>
      </span>
      <el-button style="float: right; padding: 3px 0" type="text" circle icon="el-icon-warning-outline" :title="moreTips"></el-button>
    </div>
    <fieldset>
      <legend>
        <b>1、选择一个QQ群：</b>
      </legend>
      <el-select v-model="currentGc" filterable size="mini" placeholder="请选择" @change="onChangeGc">
        <el-option-group
          key="create"
          label="创建的群">
          <el-option
            v-for="item in groupList['create']"
            :key="item.gc"
            :label="item.gn"
            :data-owner="item.owner"
            :value="item.gc">
          </el-option>
        </el-option-group>
        <el-option-group
          key="join"
          label="加入的群">
          <el-option
            v-for="item in groupList['join']"
            :key="item.gc"
            :label="htmlDecode(item.gn)"
            :data-owner="item.owner"
            :value="item.gc">
          </el-option>
        </el-option-group>
      </el-select>
    </fieldset>
    <fieldset>
      <legend>
        <b>群信息：</b>
      </legend>
      <p v-if="currentGc == ''" style="color:#f56c6c;">请先选择一个群！</p>
      <div v-if="currentGc != ''" class="bmqyQQGroupBaseInfo">
        <p>群名称：{{groupInfo.gn}}</p>
        <p>群号码：{{currentGc}}</p>
        <p>群主QQ：{{groupInfo.owner}}</p>
        <p>群成员数：{{`${groupInfo.count}/${groupInfo.max_count}`}}</p>
      </div>
    </fieldset>
    <fieldset>
      <legend>
        <b>2、选择导出项目：</b>
      </legend>
      <el-row :gutter="20">
        <el-col :span="12" :offset="0" v-for="(item, index) in exportField" :key="index">
          <el-checkbox v-model="item.checked" :value="item.name" :disabled="item.disabled">{{item.title}}</el-checkbox>
        </el-col>
      </el-row>
    </fieldset>
    <fieldset>
      <legend>
        <b>3、选择导出方式：</b>
      </legend>
      <el-select v-model="currentMode" size="mini" placeholder="请选择">
        <el-option
          v-for="item in exportMode"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </fieldset>
    <el-row class="margin-top">
      <el-button type="primary" :disabled="btnDisabled" :loading="btnLoading" @click="start">{{btnText}}</el-button>
    </el-row>
  </el-card>
</template>

<script>
export default {
  data(){
    return {
      name: this.$app.getName(),
      moreTips: '如果对您有帮助，\n感谢您打赏^_^',
      checked: false,
      exportField: [
        {
          name: 'uin',
          title: 'QQ号',
          checked: true,
          disabled: true
        },
        {
          name: 'role',
          title: '群职务',
          checked: false
        },
        {
          name: 'nick',
          title: '昵称',
          checked: false
        },
        {
          name: 'card',
          title: '群名片',
          checked: false
        },
        {
          name: 'g',
          title: '性别',
          checked: false
        },
        {
          name: 'qage',
          title: 'Q龄',
          checked: false
        },
        {
          name: 'join_time',
          title: '入群时间',
          checked: false
        },
        {
          name: 'lv',
          title: '等级(积分)',
          checked: false,
          disabled: true
        },
        {
          name: 'last_speak_time',
          title: '最后发言',
          checked: false
        }
      ],
      exportMode: [
        '纯文本',
        '电子表格'
      ],
      currentMode: '纯文本',
      btnText: '开始',
      btnLoading: false,
      api: {
        queryGroupList: 'https://qun.qq.com/cgi-bin/qun_mgr/get_group_list',
        queryGrouopInfo: 'https://qun.qq.com/cgi-bin/qun_mgr/search_group_members',
        queryGrouopMemberList: 'https://qun.qq.com/cgi-bin/qun_mgr/search_group_members',
        //queryGrouopMemberList: 'https://apinew.bmqy.net/api/qq/',
        //queryGrouopPublish: 'https://qun.qq.com/cgi-bin/qiandao/sign/publish',
        //queryGrouopGalleryTemplate: 'https://qun.qq.com/cgi-bin/qiandao/gallery_template?gc=authorQGroup&time=替换文本',
        //queryFriendList: 'https://qun.qq.com/cgi-bin/qun_mgr/get_friend_list'
      },
      queryData: {
        bkn: ''
      },      
      groupList: {},
      currentGc: '',
      groupInfo: {
          gc: 0,
          gn: '',
          owner: 0,
          max_count: 0,
          count: 0,
          adm_num: 0,
          levelname: null,
          mems: []
      },
    }
  },
  created() {
    this.getQQbkn();
    this.queryGroupList();
  },
  methods: {
    getQQbkn(){
      let vm = this;
      let skey = vm.$cookie.get("skey");
      if (!skey) {
          QQGroup.postData.bkn = '';
          return false;
      };
      let bkn = null;
      for (var e = skey, t = 5381, n = 0, o = e.length; o > n; ++n) {
          t += (t << 5) + e.charAt(n).charCodeAt()
      }
      bkn = 2147483647 & t;
      vm.queryData.bkn = bkn;
    },
    queryGroupList(){
      let vm = this;

      $.ajax({
        url: vm.api.queryGroupList,
        type: 'post',
        data: {
            bkn: vm.queryData.bkn
        },
        success: (res) => {
          if(res.errcode == 0){
            vm.groupList = res;
          }
        },
        error: (err) => console.log('BmqyQQGroup: error!')
      });
    },

    onChangeGc(){
      //this.initExportField();
      this.setGroupBaseInfo();
      this.queryGroupInfo();
    },

    initExportField(){
      let vm = this;
      for(let i=1; i<vm.exportField.length; i++){        
        vm.$set(vm.exportField[i], 'checked', false);
      }
    },

    setGroupBaseInfo(){
      let vm = this;
      if(vm.currentGc == ''){
        return false;
      }

      for(let k in this.groupList){
        if(k=='create' || k=='join'){
          let gl = this.groupList[k];
          gl.forEach(e => {
            if(e.gc == vm.currentGc){
              vm.$set(vm.groupInfo, 'owner', e.owner);
              vm.$set(vm.groupInfo, 'gn', e.gn);
              return false;
            }
          });
        };
      }
    },

    queryGroupInfo(){
      let vm = this;
      $.ajax({
          url: vm.api.queryGrouopInfo,
          type: 'post',
          data: {
            gc: vm.currentGc,
            st: 0,
            end: 0,
            sort: 0,
            bkn: vm.queryData.bkn
          },
          success: (res) => {
            if (res.ec === 0) {
              vm.$set(vm.groupInfo, 'max_count', res.max_count);
              vm.$set(vm.groupInfo, 'count', res.count);
              vm.$set(vm.groupInfo, 'adm_num', res.adm_num);
              //vm.$set(vm.groupInfo, 'mems', res.mems);
              if (res.levelname) {
                vm.$set(vm.groupInfo, 'levelname', res.levelname);
                vm.$set(vm.exportField[7], 'disabled', false);
              } else {
                vm.$set(vm.exportField[7], 'checked', false);
                vm.$set(vm.exportField[7], 'disabled', true);
              }
            }
          },
          error: (err) => console.log('BmqyQQGroup: error!')
      });
    },

    start(){
      let vm = this;
      vm.btnText = '加载中...';
      vm.btnLoading = true;

      console.log(vm.doQueryGroupMemberList());
    },

    async doQueryGroupMemberList() {
      let arr = [];
      let maxThread = vm.groupInfo.count;
      let ps = 40;
      let promiseArr = [];

      //QQGroup.clearHistory();

      for(let i=0; i*ps<maxThread; i++){
        let b = i*ps + (i==0?i:1),
            e = (i*ps + ps)>maxThread ? maxThread : i*ps + ps;
        promiseArr.push(vm.queryGroupMemberList(b, e));

      }
      return await Promise.all(promiseArr);
      /* await Promise.all(promiseArr).then(datas=>{
        datas.forEach((item, i)=>{
          arr = arr.concat(item);
        });

        if(arr.length>0){
          vm.groupInfo.members = arr;
          vm.exportGroupMemberList();
          oBtnStart.removeAttr('disabled').text('开始');
        } else {
          oBtnStart.text('未登录');
          console.log('BmqyQQGroup: 请重新登录！');
        }
      }); */
    },

    async queryGroupMemberList(b, e){
      let begin = b;
      let end = e;
      return new Promise(await function(resolve, reject){
        let api = vm.api.queryGrouopMemberList;

        $.ajax({
          url: api,
          type: 'post',
          async: false,
          data: {
            gc: vm.currentGc,
            st: begin,
            end: end,
            sort: 0,
            bkn: vm.queryData.bkn
          },
          dataType: 'json',
          success: (res) => {
            if (res.ec == 0) {
              return res.mems;
            } else {              
              console.log('BmqyQQGroupError:', res);
              reject('BmqyQQGroupError!');
            }
          },
          error: (err) => {
            console.log('BmqyQQGroupError:', err);
            reject('BmqyQQGroupError!');
          }
        });
      });
    },

    exportGroupMemberList(){
      let oExportMode = $('#exportMode');
      let oExportMemberList = [];
      QQGroup.groupInfo.members.forEach((item, i) => {
        let oMember = {};
        for (let key in QQGroup.options.fields) {
          if (QQGroup.options.fields[key].switch) {
            switch (key) {
              case 'g':
                oMember[key] = QQGroup.getGenderText(item[key]);
                break;
              case 'role':
                oMember[key] = QQGroup.getRoleText(item[key]);
                break;
              case 'lv':
                oMember[key] = QQGroup.getLvText(item[key]);
                break;
              case 'join_time':
                oMember[key] = QQGroup.formatDateTime(item[key], 'YYYY-mm-dd HH:MM');
              case 'last_speak_time':
                oMember[key] = QQGroup.formatDateTime(item[key], 'YYYY-mm-dd HH:MM');
                break;
              default:
                oMember[key] = item[key];
                break;
            }
          }
        };
        oExportMemberList.push(oMember);
      });

      if (oExportMode.val() == 1) {
        QQGroup.exportGroupMemberListToTable(oExportMemberList);
      } else {
        QQGroup.exportGroupMemberListToPlaintext(oExportMemberList);
      }
    },

    htmlDecode(html){
      if (html.length == 0) return "";
      html = html.replace(/&amp;/g, "&");
      html = html.replace(/&lt;/g, "<");
      html = html.replace(/&gt;/g, ">");
      html = html.replace(/&nbsp;/g, " ");
      html = html.replace(/&quot/g, "'");
      return html;
    }
  },
  computed: {    
    btnDisabled(){
      return this.currentGc == '';
    },
  },
  watch: {
    currentGc(val, oldVal){
      //console.log(val);
    }
  }
}
</script>

<style lang="scss" scoped>
  .bmqyQQGroupManagerBox {
    width: 300px;
    position:fixed;
    top:30px;
    left:30px;
    border-radius: 10px;
    .margin-top{
      margin-top: 15px;
    }
    .el-card__header{        
      .title {
        font-size: 14px;
        font-weight: 600;
      }
    }
    fieldset{
      margin-top:10px;
      padding:10px;
      border:1px solid #ddd;
    }
    p, /deep/ .el-checkbox__label{
      font-size: 12px;
      line-height: 28px;
    }
    .el-button--primary{
      width: 100%;
    }
  }
</style>