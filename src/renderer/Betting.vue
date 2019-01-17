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

                    <transition name="fade" mode="out-in">

                        <router-view></router-view>

                    </transition>

                </div>

            </div>

        </div>

    </div>

</template>

<script>

    import bettingNav from './components/betting/bettingNav'
    import SideNavBar from "./components/SideNavBar";

    export default {
        name: 'Betting',
        components: {SideNavBar, bettingNav },
    }

</script>

<style lang="scss" scoped>

    .content{
        padding: 10px;
        min-height: 650px;
    }

    .betting-main{
        margin-left: 150px;
    }

</style>
