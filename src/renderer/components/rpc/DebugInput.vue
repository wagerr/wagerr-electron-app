<template>
  <div class="debug-container">
    <div class="debug-toolbar">
      <div class="rpctitle">WAGERR RPC Console</div>
      <a @click="clearRecHistoryList">
        <i class="icon-trash" />
      </a>
      <a @click="updadteConsoleVisible">
        <i class="icon-cross" />
      </a>
    </div>

    <ul class="command-list" ref="historyPanel">
      <li
        v-for="(history, index) in getrecHistoryList"
        class="command-item"
        :key="index"
      >
        <div class="time">{{ history.date }}</div>
        <div class="content">
          <span v-if="history.command" style="color:white"
            >>{{ history.command }}</span
          >
          <span v-if="history.welcomeMessage">{{
            history.welcomeMessage
          }}</span>
          <span v-if="history.message">{{ history.message }}</span>
          <!--
          <div v-if="history.message && history.message.length > 0">
            <span v-for="(message,index) in history.message" :key="index">
              <br>
              {{ message }}
            </span>
          </div>
          !-->
          <span class="text-danger" v-if="history.error">{{
            history.error
          }}</span>
        </div>
      </li>
    </ul>
    <div class="input-container">
      <el-autocomplete
        popper-class="command-popup"
        class="command"
        v-model="command"
        :fetch-suggestions="querySearch"
        placeholder="Type a Command"
        :trigger-on-focus="false"
        @keyup.enter.native="onRunCommand"
      ></el-autocomplete>
      <div @click="onRunCommand" class="button">Enter</div>
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex';
import moment from 'moment';
import ipcRenderer from '../../../common/ipc/ipcRenderer';
import { commands as commandSuggestions } from './command';
// Get rpc credentials from the main process. These values are read from the wagerr.conf file in the main
// process when the app is initialising. Default values are used if the wagerr.conf does not exist or doesnt
// have the values set.

// Check if testnet=1 in wagerr.conf

export default {
  name: 'DebugInput',
  data() {
    return {
      command: ''
    };
  },
  computed: {
    ...Vuex.mapGetters(['getrecHistoryList'])
  },
  created() {
    if (this.getrecHistoryList.length === 0) {
      this.addCommand('Welcome to WAGERR RPC Console.');
    }
  },
  beforeCreate: function() {
    document.body.className = 'lightbox';
  },
  destroyed: function() {
    document.body.className = '';
  },
  methods: {
    ...Vuex.mapActions([
      'updateCommands',
      'clearRecHistoryList',
      'updadteConsoleVisible'
    ]),
    addCommand(cmd, message = '') {
      this.updateCommands({
        date: moment().format('hh:mm:ss'),
        command: cmd,
        message: message
      });
    },
    querySearch(queryString, cb) {
      var results = queryString
        ? commandSuggestions.filter(item => {
            return (
              item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
            );
          })
        : commandSuggestions;
      cb(results);
    },
    async onRunCommand() {
      if (this.command === '') return;
      this.addCommand(this.command);

      try {
        const cmd = this.command.split(/\s/);
        const res = await ipcRenderer.runCommand(cmd);
        console.log(res);
        this.addCommand('', res);
      } catch (error) {
        console.log(error);
        this.addCommand('', error);
      }
      this.command = '';
      setTimeout(() => {
        this.$refs.historyPanel.scrollTop = this.$refs.historyPanel.scrollHeight;
        console.log(this.$refs.historyPanel);
      });
    }
  }
};
</script>
<style scoped lang="scss">
@import '../../assets/scss/_variables';

body.lightbox .debug-container {
  position: fixed;
  top: 5%;
  width: 90%;
  left: 5%;
  height: 90%;
  z-index: 999;
  overflow: hidden;
  background-color: $white;
  color: $gray-900;
  border-radius: 3px;
  //   margin-left: 35px;
  //   margin-right: 35px;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  .command-list {
    padding: 0 18px;
    flex: auto;
    overflow-y: auto;
    .command-item {
      display: flex;
      .time {
        color: #9a999a;
        width: 80px;
        flex: 0 0 80px;
        font-weight: 600;
      }
      .content {
        color: $gray-900;
        flex: auto;
        white-space: pre-wrap;
        min-height: 0px;
        font-weight: 600;
        span {
          color: $gray-900 !important;
          font-weight: 600;
        }
      }
      .text-danger {
        color: $wagerr-red;
        font-weight: 600;
      }
    }
  }
  .input-container {
    height: 40px;
    line-height: 40px;
    display: flex;
    font-size: 16px;
    flex: 0 0 40px;
    .command {
      height: 40px;
      line-height: 34px;
      background: $gray-300;
      color: $gray-900;
      margin: 0;
      padding: 0 0 0 15px;
      border: none;
      flex: auto;

      &:focus {
        outline: none;
      }
      &::placeholder {
        color: rgba(255, 255, 255, 0.4);
      }
    }
    div.button {
      flex: 0 0 80px;
      display: inline-block;
      width: 80px;
      line-height: 40px;
      color: $white;
      text-align: center;
      cursor: pointer;
      background-color: $wagerr-red;
      font-weight: 600;
      height: 41px;
      letter-spacing: 0.5px;
      &:hover {
        background-color: $wagerr-red-dark;
      }
    }
  }
}
.debug-toolbar {
  position: relative;
  color: #fff;
  background-image: url(../../assets/images/bg-header.png);
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: $wagerr-red;

  height: 40px;
  width: 100%;
  justify-items: right;
  display: block;

  font-size: 20px;
  font-weight: 600;
  text-align: right;
  padding-right: 15px;
  padding-top: 7px;
  .rpctitle {
    position: absolute;
    left: 15px;
    top: 9px;
    font-size: 15px;
  }

  a {
    display: inline-block;
    margin-left: 15px;
    i {
      font-weight: 900;
      color: $white;
    }
    &:hover {
      cursor: pointer;
      i {
        color: $wagerr-red;
      }
    }
  }
}
</style>
<style lang="scss">
:global {
  .el-autocomplete-suggestion__wrap {
    background: #979899;
    color: black;
    border: 1px solid #979899;
    li {
      color: #ffffff;
    }
  }
  .el-autocomplete-suggestion li:hover {
    color: #000000;
    background-color: #f5f7fa;
  }
  .el-input {
    input {
      color: white;
      height: 40px !important;
    }
  }
}
</style>
