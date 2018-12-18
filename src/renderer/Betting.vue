<template>

    <div id="betting" class="content">

        <div class="row">

            <div class="">

                <side-nav-bar></side-nav-bar>

            </div>

            <div class="betting-main">

                <div class="col s12 betting-nav">

                    <betting-nav></betting-nav>

                </div>


                <div class="col s12 betting-content">

                    <router-view></router-view>

                </div>

            </div>

        </div>

    </div>

    <!--<div class="bets-50">

      <div class="block">

        <h2>Most Popular <i class="icon-basketball pull-right"></i></h2>

        <table cellpadding="0" cellspacing="0" border="0" width="100%">

          <tr>
            <td>Golden State Warriors</td>
            <td class="text-center">-3.5</td>
            <td class="text-center">1.98</td>
          </tr>

          <tr>
            <td>Cleveland Cavaliers</td>
            <td class="text-center">+3.5</td>
            <td class="text-center">1.98</td>
          </tr>

        </table>

        <table cellpadding="0" cellspacing="0" border="0" width="100%">

          <tr>
            <td>Golden State Warriors</td>
            <td class="text-center">-3.5</td>
            <td class="text-center">1.98</td>
          </tr>

          <tr>
            <td>Cleveland Cavaliers</td>
            <td class="text-center">+3.5</td>
            <td class="text-center">1.98</td>
          </tr>

        </table>

        <table cellpadding="0" cellspacing="0" border="0" width="100%">

          <tr>
            <td>Golden State Warriors</td>
            <td class="text-center">-3.5</td>
            <td class="text-center">1.98</td>
          </tr>

          <tr>
            <td>Cleveland Cavaliers</td>
            <td class="text-center">+3.5</td>
            <td class="text-center">1.98</td>
          </tr>

        </table>

      </div>

      <div class="block">
        <h2>Your Favorites <i class="icon-basketball pull-right"></i></h2>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td>Golden State Warriors</td>
            <td class="text-center">-3.5</td>
            <td class="text-center">1.98</td>
          </tr>
          <tr>
            <td>Cleveland Cavaliers</td>
            <td class="text-center">+3.5</td>
            <td class="text-center">1.98</td>
          </tr>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td>Golden State Warriors</td>
            <td class="text-center">-3.5</td>
            <td class="text-center">1.98</td>
          </tr>
          <tr>
            <td>Cleveland Cavaliers</td>
            <td class="text-center">+3.5</td>
            <td class="text-center">1.98</td>
          </tr>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td>Golden State Warriors</td>
            <td class="text-center">-3.5</td>
            <td class="text-center">1.98</td>
          </tr>
          <tr>
            <td>Cleveland Cavaliers</td>
            <td class="text-center">+3.5</td>
            <td class="text-center">1.98</td>
          </tr>
        </table>
      </div>

      <div class="clear"></div>
    </div>-->

</template>

<script>

    import bettingNav from './components/betting/bettingNav'
    import SideNavBar from "./components/SideNavBar";

    export default {
        name: 'Betting',
        components: {SideNavBar, bettingNav },

        data () {
            return {}
        }
    }

</script>

<style lang="scss" scoped>

    .content{
        padding: 10px;
    }

    .betting-main{
        margin-left: 150px;
    }

</style>
