<template>

    <div id="tools" class="content">

        <div class="row">

            <div class="col s12">

                <tools-nav></tools-nav>

            </div>

            <div class="col s12">

                <transition name="fade" mode="out-in">

                    <router-view></router-view>

                </transition>

            </div>

        </div>

    </div>

</template>

<script>

    import ToolsNav from './components/tools/ToolsNav'

    export default {
        name: 'Tools',
        components: { ToolsNav }
    }

</script>

<style scoped>

  .content{
      min-height: 650px;
      padding: 10px;
  }

</style>
