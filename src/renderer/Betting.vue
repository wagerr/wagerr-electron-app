<template>

    <div id="betting" class="content">

        <div class="row">

           <div class="betting-sidebar">
            	<div class="betting-sidebar-container">
            		<div class="sidebar-branding"></div>
					<betting-nav></betting-nav>
					<side-nav-bar></side-nav-bar>
				</div>
            </div>

            <div class="betting-main">

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

    import bettingNav from './components/betting/bettingNav';
    import SideNavBar from './components/SideNavBar';

    export default {
        name: 'Betting',
        components: {SideNavBar, bettingNav },
    }

</script>