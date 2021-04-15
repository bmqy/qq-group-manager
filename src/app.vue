<template>
  <el-card class="box-card bmqyQQGroupManagerBox animate__animated animate__bounce">
    <div slot="header" class="clearfix">
      <span class="title">{{name}}
        <span style="color:#909399;font-size:12px;font-weight:normal;">{{`ver${$app.getVersion()}`}}</span>
      </span>
      <el-button style="float: right; padding: 3px 0" type="text" circle icon="el-icon-warning-outline" :title="moreTips"></el-button>
    </div>
    <div v-if="qqbkn == ''" style="color:#f56c6c;">请先登录你的QQ账号！</div>
    <div v-if="qqbkn != ''">        
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
              :label="$app.htmlDecode(item.gn)"
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
            v-for="(item, index) in exportMode"
            :key="index"
            :label="item.val"
            :value="item.key"
            :v-model="currentMode">
          </el-option>
        </el-select>
      </fieldset>
      <el-progress :percentage="percentage" :show-text="false" status="success"></el-progress>

      <el-row class="margin-top">        
        <el-button-group>
          <el-button type="primary" round :disabled="btnDisabled" :loading="btnLoading" @click="start">{{btnText}}</el-button>
          <el-button type="info" round icon="el-icon-download" v-if="percentage == 100" :title="currentMode=='plain' ? '已复制到剪贴板！' : '已导出点击下载！'" :disabled="currentMode=='plain'" @click="download">{{currentMode=='plain' ? '已复制' : '请下载'}}</el-button>
        </el-button-group>
      </el-row>
    </div>
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
        {
          key: 'plain',
          val: '纯文本'
        },
        {
          key: 'xlsx',
          val: '电子表格'
        }
      ],
      currentMode: 'plain',
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
      qqbkn: '',
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
      percentage: 0
    }
  },
  created() {
    this.getqqbkn();
    this.queryGroupList();
  },
  methods: {
    getqqbkn(){
      let vm = this;
      let skey = vm.$cookie.get("skey");
      if (!skey) {
          vm.qqbkn = '';
          return false;
      };
      let bkn = null;
      for (var e = skey, t = 5381, n = 0, o = e.length; o > n; ++n) {
          t += (t << 5) + e.charAt(n).charCodeAt()
      }
      bkn = 2147483647 & t;
      vm.qqbkn = bkn;
    },
    queryGroupList(){
      let vm = this;

      $.ajax({
        url: vm.api.queryGroupList,
        type: 'post',
        data: {
            bkn: vm.qqbkn
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
      this.setGroupBaseInfo();
      this.queryGroupInfo();
      this.percentage = 0;
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
            bkn: vm.qqbkn
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

    async start(){
      this.doQueryGroupMemberList()
    },

    async doQueryGroupMemberList() {
      let vm = this;
      let arr = [];
      let maxCount = vm.groupInfo.count;
      let ps = 40;

      vm.btnText = '加载中...';
      vm.btnLoading = true;

      for(let i=0; i*ps<maxCount; i++){
        let b = i*ps + (i==0?i:1),
            e = (i*ps + ps)>maxCount ? maxCount : i*ps + ps;
        
        await vm.$app.delay();
        let r = await vm.queryGroupMemberList(b, e);
        arr.push(...r);
        vm.percentage = parseInt(e/maxCount*100);
      }

      vm.btnText = '开始';
      vm.btnLoading = false;
      vm.$set(vm.groupInfo, 'mems', arr);
    },

    async queryGroupMemberList(b, e){
      let vm = this;
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
            bkn: vm.qqbkn
          },
          dataType: 'json',
          success: (res) => {
            if (res.ec == 0) {
              resolve(res.mems);
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
      let vm = this;
      let oExportMode = $('#exportMode');
      let oExportMemberList = [];
      vm.groupInfo.members.forEach((item, i) => {
        let oMember = {};
        for (let key in vm.options.fields) {
          if (vm.options.fields[key].switch) {
            switch (key) {
              case 'g':
                oMember[key] = vm.getGenderText(item[key]);
                break;
              case 'role':
                oMember[key] = vm.getRoleText(item[key]);
                break;
              case 'lv':
                oMember[key] = vm.getLvText(item[key]);
                break;
              case 'join_time':
                oMember[key] = vm.$app.formatDateTime(item[key], 'YYYY-mm-dd HH:MM');
              case 'last_speak_time':
                oMember[key] = vm.$app.formatDateTime(item[key], 'YYYY-mm-dd HH:MM');
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
        vm.exportGroupMemberListToXlsx(oExportMemberList);
      } else {
        vm.exportGroupMemberListToPlain(oExportMemberList);
      }
    },
    
    exportGroupMemberListToPlain: (memberList) => {
      let oShowResult = $('#showResult');
      let sResult = '';
      let len = memberList.length;
      let k = QQGroup.getIncludFieldCount();
      for (let i = 0; i < len; i++) {
        for (let key in QQGroup.options.fields) {
          let j = 1;
          if (QQGroup.options.fields[key].switch) {
            if (j < k) {
              sResult += memberList[i][key] + '\t';
            } else {
              sResult += memberList[i][key];
            }
            j++;
          }
        }
        if (i < len - 1) {
          sResult += '\r\n';
        }
      }

      GM_setClipboard(sResult, {
        type: 'text',
        mimetype: 'text/plain'
      });

      oShowResult.html('已复制到剪贴板！');
      setTimeout(() => {
        QQGroup.clearHistory();
      }, 2000);
    },

    exportGroupMemberListToXlsx: (memberList) => {
      let oShowResult = $('#showResult');
      let oTable = $('<talbe></talbe>');
      for (let i = 0; i < memberList.length; i++) {
        let oTableTr = $('<tr></tr>');
        for (let key in QQGroup.options.fields) {
          if (QQGroup.options.fields[key].switch) {
            let oTableTd = $('<td>' + memberList[i][key] + '</td>');
            oTableTr.append(oTableTd);
          }
        }
        oTable.append(oTableTr);
      }

      let str = ``;
      //增加\t为了不让表格显示科学计数法或者其他格式
      for (let i = 0; i < memberList.length; i++) {
          for (let item in memberList[i]) {
              str += `"${memberList[i][item] + '"\t'},`;
          }
          str += '\n';
      }
      //encodeURIComponent解决中文乱码
      let uri = 'data:text/xlsx;charset=utf-8,\ufeff' + encodeURIComponent(str);
      let oAlink = $('<a></a>').attr('href', uri).attr('download', `QQ群成员列表-${QQGroup.groupInfo.gn}.xlsx`).attr('title', `QQ群成员列表-${QQGroup.groupInfo.gn}.xlsx`).text('已导出：点此下载');
      oShowResult.append(oAlink);
    },

    download(){
      console.log('xiazai');
    },
    
    getGenderText(val){
      if (val == 0) {
        return '男';
      } else if (val == 1) {
        return '女';
      } else {
        return '未知';
      }
    },

    getRoleText(val){
      if (val == 0) {
        return '群主';
      } else if (val == 1) {
        return '管理员';
      } else {
        return '群员';
      }
    },

    getLvText(json){
      return vm.groupInfo.levelname[json.level] + '(' + json.point + ')';
    },
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
    top:110px;
    right:100px;
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
    p, ::v-deep .el-checkbox__label{
      font-size: 12px;
      line-height: 28px;
    }
    .el-button-group {
      display: flex;
    }
    .el-button--primary{
      flex: 1;
    }
    .el-progress {
      position: absolute;
      line-height: 1;
      bottom: 0px;
      z-index: 9;
      left: 0;
      right: 0;
    }
  }
</style>