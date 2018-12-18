<template>

    <div id="tools" class="content">

        <div class="row">

            <div class="col s12">

                <tools-nav></tools-nav>

            </div>


            <div class="col s12">

                <router-view></router-view>

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
      padding: 10px;
  }

  .router-link-active{
      background-color: red;
  }

</style>
