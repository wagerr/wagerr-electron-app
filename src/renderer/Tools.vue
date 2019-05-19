<template>
  <div id="tools" class="content">
    <div class="row">
      <div class="tools-sidebar">
        <div class="tools-sidebar-container">
          <div class="sidebar-branding"></div>
          <tools-nav></tools-nav>
        </div>
      </div>

      <div class="tools-main">
        <div class="col s12">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ToolsNav from './components/tools/ToolsNav';

export default {
  name: 'Tools',
  components: { ToolsNav }
};
</script>
