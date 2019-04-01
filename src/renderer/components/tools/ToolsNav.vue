<template>

    <div class="second-nav tools-types">
		<h5>Tools &amp; Info</h5>
        <ul class="row">

            <router-link class="col s4"  tag="li" to="/tools/info">

                <a>Info</a>

            </router-link>

            <router-link class="col s4" tag="li" to="/tools/peers">

                <a>Peers</a>

            </router-link>

            <router-link class="col s4" tag="li" to="/tools/wallet_repair">

                <a>Wallet Repair</a>

            </router-link>

        </ul>

    </div>

</template>

<script>

    export default {
        name: 'ToolsNav'
    }

</script>