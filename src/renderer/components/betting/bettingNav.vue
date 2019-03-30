<template>

    <div class="second-nav">

        <ul class="row">

            <router-link class="col s4" tag="li" to="/betting/peerless">

                <button class="btn waves-effect red darken-4 waves-light">PEERLESS</button>

            </router-link>

            <router-link class="col s4" tag="li" to="/betting/chain_games">

                <button class="btn waves-effect red darken-4 waves-light">CHAIN GAMES</button>

            </router-link>

            <router-link class="col s4" tag="li" to="/betting/h2h">

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

</style>
