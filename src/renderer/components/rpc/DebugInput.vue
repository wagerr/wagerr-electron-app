<template>
  <div class="debug-container">
    <div class="debug-toolbar">
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
import ipcRender from '../../../common/ipc/ipcRender';
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
        const res = await ipcRender.runCommand(this.command);
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
.debug-container {
  position: fixed;
  top: 100px;
  width: 98%;
  left: 1%;
  height: calc(100% - 140px);
  overflow: hidden;
  background-color: rgba(0, 0, 0, 1);
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
      }
      .content {
        color: #fffcfd;
        flex: auto;
        white-space: pre-wrap;
        min-height: 0px;
      }
      .text-danger {
        color: red;
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
      line-height: 40px;
      background: #7a7b7c;
      color: #eeeeee;
      margin: 0;
      padding: 0 0 0 0px;
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
      background: #979899;
      color: #fefefe;
      text-align: center;
      cursor: pointer;
    }
  }
}
.debug-toolbar {
  background: white;
  height: 30px;
  width: 100%;
  justify-items: right;
  display: block;

  font-size: 20px;
  font-weight: bold;
  text-align: right;
  padding-right: 10px;
  a:hover {
    color: red;
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
    }
  }
}
</style>
