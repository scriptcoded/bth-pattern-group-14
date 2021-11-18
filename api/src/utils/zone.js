/**
 * Finds a parking zone at a specific point. Useful for checking if a bike is
 * inside a parking zone.
 * @param {import("@prisma/client").PrismaClient} db Prisma instance
 * @param {Number} latitude Point latitude
 * @param {Number} longitude Point Longitude
 */
module.exports.findParkingZoneAtPoint = async function findParkingZoneAtPoint (db, latitude, longitude) {
  return await db.parkingZone.findFirst({
    where: {
      latitudeStart: { lte: latitude },
      latitudeEnd: { gte: latitude },
      longitudeStart: { lte: longitude },
      longitudeEnd: { gte: longitude }
    }
  })
}

/**
 * Finds a charging station at a specific point. Useful for checking if a bike
 * is inside a charging station.
 * @param {import("@prisma/client").PrismaClient} db Prisma instance
 * @param {Number} latitude Point latitude
 * @param {Number} longitude Point Longitude
 */
module.exports.findChargingStationAtPoint = async function findChargingStationAtPoint (db, latitude, longitude) {
  return await db.chargingStation.findFirst({
    where: {
      latitudeStart: { lte: latitude },
      latitudeEnd: { gte: latitude },
      longitudeStart: { lte: longitude },
      longitudeEnd: { gte: longitude }
    }
  })
}

/**
 * Finds a driving zone at a specific point. Useful for checking if a bike is
 * inside a driving zone.
 * @param {import("@prisma/client").PrismaClient} db Prisma instance
 * @param {Number} latitude Point latitude
 * @param {Number} longitude Point Longitude
 */
module.exports.findDrivingZoneAtPoint = async function findDrivingZoneAtPoint (db, latitude, longitude) {
  return await db.drivingZone.findFirst({
    where: {
      latitudeStart: { lte: latitude },
      latitudeEnd: { gte: latitude },
      longitudeStart: { lte: longitude },
      longitudeEnd: { gte: longitude }
    }
  })
}
