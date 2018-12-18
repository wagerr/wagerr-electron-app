<template>

    <div class="second-nav">

        <ul class="row">

            <router-link class="col s4"  tag="li" to="tools/">

                <button class="btn waves-effect red darken-4 waves-light">Info</button>

            </router-link>

            <router-link class="col s4" tag="li" to="/peers">

                <button class="btn waves-effect red darken-4 waves-light">Peers</button>

            </router-link>

            <router-link class="col s4" tag="li" to="/wallet_repair">

                <button class="btn waves-effect red darken-4 waves-light">Wallet Repair</button>

            </router-link>

        </ul>

    </div>

</template>

<script>

    export default {
        name: 'ToolsNav'
    }

</script>

<style scoped>

</style>
