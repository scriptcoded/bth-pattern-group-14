let intervalMap = null

export function resetInterval () {
  intervalMap = true
  console.log('hej', intervalMap)
}

// export async function rentedBikeUpdate (id) {
//   const rentedBike = await this.$api.get(`/bikes/${id}`)
//   const position = [rentedBike.latitude, rentedBike.longitude]
//   const mark = L.marker(position, { icon: this.locationMarkerRed })

//   mark.bindPopup(`
//       <h1>Bike id:${rentedBike.id}</h1>
//       <h2 class="dab">Hey!</h2>
//       <p>I'm riding along!</p>
//     `).addTo(this.mapContainer)
// }
