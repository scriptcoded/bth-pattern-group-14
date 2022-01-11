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
          <button @click="updateApplication(item.id)">
            Update
          </button>
        </td>
        <td class="delete">
          <button @click="deleteApplication(item.id)">
            X
          </button>
        </td>
      </tr>
    </table>
    <!-- <button @click="createApplication()">
      Create application
    </button> -->
  </div>
</template>

<script>
// router.get('/applications', auth('ADMIN'), applicationController.getAllApplications)
// router.post('/applications', auth('ADMIN'), applicationController.createApplication)
// router.delete('/applications/:id', auth('ADMIN'), applicationController.deleteApplication)
// router.get('/applications/:id', auth('ADMIN'), applicationController.getOneApplication)
// router.patch('/applications/:id', auth('ADMIN'), applicationController.updateApplication)

export default {
  data () {
    return {
      arr: null,
      showUpdateForm: false,
      selectedItem: []
    }
  },
  mounted () {
    this.getAllApplications()
  },
  methods: {
    async getAllApplications () {
      this.arr = await this.$api.get('/applications')
    },
    onClick (id) {
      this.selectedItem = this.arr.filter(e => e.id === id)[0]
    },
    // async createApplication () {
    //   const name = prompt('What is the application name?')
    //   if (!name) return
    //   const data = {
    //     name: name
    //   }
    //   const res = await this.$api.post('/applications', data)
    //   this.arr.push(res)
    // },
    async updateApplication () {
      const id = this.selectedItem.id
      const data = {
        name: this.selectedItem.name,
        role: this.selectedItem.role
      }

      const res = await this.$api.patch(`/applications/${id}`, data)
      // Find application to modify and modify it
      const application = this.arr.find(b => b.id === id)
      application.updatedAt = res.updatedAt

      // Replace the original application with the new one in the array and
      // *reassign the array*. This is important to trigger the
      // rectivity in Vue.
      this.arr = this.arr.map(b => b.id === id ? application : b)
    },
    async deleteApplication (id) {
      const yes = confirm('You sure you wanna delete this user?')
      if (!yes) return
      await this.$api.delete(`/applications/${id}`)
    }
  }
}
</script>
