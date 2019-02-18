<template>

    <div class="second-nav">

        <ul class="row">

            <router-link class="col s4" tag="li" to="betting/">

                <button class="btn waves-effect red darken-4 waves-light">PEERLESS</button>

            </router-link>

            <router-link class="col s4" tag="li" to="/chain_games">

                <button class="btn waves-effect red darken-4 waves-light">CHAIN GAMES</button>

            </router-link>

            <router-link class="col s4" tag="li" to="/h2h">

                <button class="btn waves-effect red darken-4 waves-light">HEAD TO HEAD</button>

            </router-link>

        </ul>

    </div>

</template>

<script>

    export default {
        name: 'bettingNav'
    }

</script>

<style lang="scss" scoped>

    @import "../../assets/scss/_variables.scss";
    @import "../../assets/scss/_fonts.scss";

</style>
