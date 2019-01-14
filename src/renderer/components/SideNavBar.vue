<template>

  <nav>

      <ul class="side-nav">

          <li @click="filterEvents()">

              <div class="parent">

                  <a>

                      <i class="icon-calendar-check"></i>

                      <span>All Events</span>

                  </a>

              </div>

          </li>

          <li @click="filterEvents('Football')">

              <div class="parent">

                  <a>

                      <i class="icon-football"></i>

                      <span>NFL</span>

                      <i class="icon-chevron-down pull-right"></i>

                  </a>

              </div>

              <!--<ul>

                  <li class="open-demo-dialog"><span>NFL</span></li>

                  <li class="open-demo-dialog"><span>NCAA</span></li>

              </ul>-->

          </li>

          <li @click="filterEvents('Basketball')">

              <div class="parent">

                  <a>

                      <i class="icon-basketball"></i>

                      <span>Basketball</span>

                      <i class="icon-chevron-down pull-right"></i>

                  </a>

              </div>

              <!--<ul>

                  <li class="open-demo-dialog"><span>NBA</span></li>

                  <li class="open-demo-dialog"><span>NCAA</span></li>

                  <li class="open-demo-dialog"><span>Eurobasket</span></li>

              </ul>-->

          </li>

          <!--<li>

              <div class="parent">

                  <a>

                      <i class="icon-baseball"></i>

                      <span>Baseball</span>

                      <i class="icon-chevron-down pull-right"></i>

                  </a>

              </div>

              <ul>

                  <li class="open-demo-dialog"><span>MLB</span></li>

                  <li class="open-demo-dialog"><span>NCAA</span></li>

                  <li class="open-demo-dialog"><span>WSOB</span></li>

              </ul>

          </li>-->

          <li @click="filterEvents('Hockey')">

              <div class="parent">

                  <a>

                      <i class="icon-hockey"></i>

                      <span>Hockey</span>

                      <i class="icon-chevron-down pull-right"></i>

                  </a>

              </div>

              <!--<ul>

                  <li class="open-demo-dialog"><span>NHL</span></li>

                  <li class="open-demo-dialog"><span>KHL</span></li>

                  <li class="open-demo-dialog"><span>AHL</span></li>

              </ul>-->

          </li>

          <!--<li>

              <div class="parent">

                  <a>

                      <i class="icon-golf"></i>

                      <span>Golf</span>

                      <i class="icon-chevron-down pull-right"></i>

                  </a>

              </div>

              <ul>

                  <li class="open-demo-dialog"><span>PGA</span></li>

                  <li class="open-demo-dialog"><span>ETOUR</span></li>

                  <li class="open-demo-dialog"><span>RYDERCUP</span></li>

              </ul>

          </li>-->

          <!--<li @click="filterEvents('Tennis')">

              <div class="parent">

                  <a>

                      <i class="icon-tennis2"></i>

                      <span>Tennis</span>

                      <i class="icon-chevron-down pull-right"></i>

                  </a>

              </div>

              <ul>

                  <li class="open-demo-dialog"><span>ATP</span></li>

                  <li class="open-demo-dialog"><span>DAVISC</span></li>

                  <li class="open-demo-dialog"><span>ITF</span></li>

                  <li class="open-demo-dialog"><span>GST</span></li>

              </ul>

          </li>-->

          <!--<li>

              <div class="parent">

                  <a>

                      <i class="icon-headset"></i>

                      <span>e-Sports</span>

                      <i class="icon-chevron-down pull-right"></i>

                  </a>

              </div>

              <ul>

                  <li class="open-demo-dialog"><span>CS:GO</span></li>

                  <li class="open-demo-dialog"><span>DOTA</span></li>

                  <li class="open-demo-dialog"><span>LoL</span></li>

                  <li class="open-demo-dialog"><span>OVERWATCH</span></li>

                  <li class="open-demo-dialog"><span>STARCRAFT</span></li>

                  <li class="open-demo-dialog"><span>HALO</span></li>

              </ul>

          </li>-->

          <li @click="filterEvents('Soccer')">

              <div class="parent">

                  <a>

                      <i class="icon-soccer"></i>

                      <span>Soccer</span>

                      <i class="icon-chevron-down pull-right"></i>

                  </a>

              </div>

              <!--<ul>

                  <li class="open-demo-dialog"><span>Champions League</span></li>

                  <li class="open-demo-dialog"><span>Europa League</span></li>

                  <li class="open-demo-dialog"><span>EPL</span></li>

                  <li class="open-demo-dialog"><span>La Liga</span></li>

                  <li class="open-demo-dialog"><span>Bundesliga</span></li>

                  <li class="open-demo-dialog"><span>MLS</span></li>

                  <li class="open-demo-dialog"><span>FIFA World Cup</span></li>

              </ul>-->

          </li>

      </ul>

  </nav>

</template>

<script>

    import Vuex from 'vuex'

    export default {
        name: 'SideNavBar',

        methods: {
            ...Vuex.mapActions([
                'listEvents',
            ]),

            filterEvents: function (filter) {
                this.listEvents(filter);
            }
        }
    }

</script>

<style lang="scss" scoped>

    @import "../assets/scss/_variables.scss";
    @import "../assets/scss/_fonts.scss";

    .side-nav{
        margin-top: 7px;
    }

    nav {
        position:fixed;
        top:0px;
        left:0px;
        width: 150px;
        height:100%;
        background-color: $dark_grey;
        padding-top:60px;
        z-index:1;
    }

    nav ul {
        margin:0px;
        padding:0px;
    }

    nav ul li {
        margin:0px;
        padding:0px;
        list-style:none;
        color:#fff;
        font-size:12px;
        line-height:18px;
        border-top:solid 1px #414141;
        display:block;
        cursor:pointer;
    }

    nav ul li.selected {
        background-color:#363738;
    }

    nav ul li:hover {
        color: $wagerr_red;
    }

    nav ul li span {
        display:inline-block;
        vertical-align:middle;
        padding:10px 0px;
        cursor:pointer;
    }

    nav ul li i {
        color: $wagerr_red;
        font-size:20px;
        vertical-align:middle;
        width:30px;
        display:inline-block;
        margin-left:10px;
    }

    nav ul li i.pull-right {
        font-size:13px;
        color:#686869;
        display:none;
    }

    nav ul li.selected i.pull-right {
        display:block;
    }

    nav ul li ul {
        display:none;
    }

    nav ul li ul li {
        display:block;
        padding-left:40px;
    }

</style>
