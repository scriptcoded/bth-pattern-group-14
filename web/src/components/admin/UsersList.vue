<template>
  <div>
    <table>
      <tr class="table-header">
        <th> ID </th>
        <th> Name </th>
        <th> Role </th>
        <th> Balance </th>
        <th> Created </th>
        <th> Updated </th>
        <th> Update </th>
        <th> Delete </th>
      </tr>
      <tr
        v-for="item in arr"
        :key="item.id"
        class="table-content"
        @click="onClick(item.id)"
      >
        <td> {{ item.id }} </td>
        <td>
          <input
            v-model="item.name"
            type="string"
          >
        </td>
        <td>
          <select
            v-model="item.role"
            type="string"
          >
            <option
              value="USER"
            >
              User
            </option>
            <option
              value="ADMIN"
            >
              Admin
            </option>
          </select>
        </td>
        <td>{{ item.balance }}</td>
        <td>{{ item.createdAt }}</td>
        <td> {{ item.updatedAt }} </td>
        <td class="update">
          <button @click="updateUser(item.id)">
            Update
          </button>
        </td>
        <td class="delete">
          <button @click="deleteUser(item.id)">
            X
          </button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>

export default {
  data () {
    return {
      arr: null,
      showUpdateForm: false,
      selectedItem: []
    }
  },
  mounted () {
    this.getAllUsers()
  },
  methods: {
    async getAllUsers () {
      this.arr = await this.$api.get('/users')
    },
    onClick (id) {
      this.selectedItem = this.arr.filter(e => e.id === id)[0]
    },
    async updateUser () {
      const id = this.selectedItem.id
      const data = {
        name: this.selectedItem.name,
        role: this.selectedItem.role
      }

      const res = await this.$api.patch(`/users/${id}`, data)
      // Find user to modify and modify it
      const user = this.arr.find(b => b.id === id)
      user.updatedAt = res.updatedAt

      // Replace the original user with the new one in the array and
      // *reassign the array*. This is important to trigger the
      // rectivity in Vue.
      this.arr = this.arr.map(b => b.id === id ? user : b)
    },
    async deleteUser (id) {
      const yes = confirm('You sure you wanna delete this user?')
      if (!yes) return
      await this.$api.delete(`/users/${id}`)
    }
  }
}
</script>
