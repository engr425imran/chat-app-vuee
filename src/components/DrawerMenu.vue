<template>
  <div class="sidebar">
    <div class="logo">
      <router-link to="/shipments" class="shipment-logo">
        <img src="@/assets/images/logo.png" alt="" />
      </router-link>
    </div>

    <ul class="links sidebarMenu">
      <li>
        <router-link to="/containers">
          <i class="ic-truckings"></i>
          Containers
        </router-link>
      </li>
      <li>
        <router-link
          to="/yards"
          v-bind:class="{
            'active-link': $store.state.page.currentPage == 'yards',
          }"
        >
          <i class="ic-yards"></i>
          Yards
        </router-link>
      </li>
      <!-- Settings Pop Over -->
      <div class="settings-popup-menu settings_bottom_menu">
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-width="200"
          offset-x
          content-class="drawer-menu-popover"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="settings-btn"
              :ripple="false"
              dark
              v-bind="attrs"
              v-on="on"
            >
              <router-link to="/settings">
                <div class="settings-menu-group">Settings</div>
              </router-link>
            </v-btn>
          </template>

          <v-card>
            <v-list>
              <v-list-item>
                <v-list-item-title>
                  <router-link to="/settings/?tab=users"> Users </router-link>
                </v-list-item-title>
              </v-list-item>

              <v-list-item>
                <v-list-item-title> </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>

      <div
        v-if="isMobile"
        style="height: 2px; background-color: #039ddc; margin: 12px"
      ></div>
      <li v-if="isMobile">
        <v-btn @click="userLogout" class="btn-logout-mobile">
          <img src="@/assets/images/sign-out.png" alt="" />
          Sign Out
        </v-btn>
      </li>
    </ul>

    <p class="footer">© 2021 Shifl. All rights reserved.</p>
  </div>
</template>

<script>
export default {
  name: "DrawerMenu",
  props: ["isMobile"],
  data: () => ({
    menu: false,
  }),
  methods: {},
  computed: {},
  updated() {},
};
</script>

<style lang="scss"></style>
