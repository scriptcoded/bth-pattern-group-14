/*
  Warnings:

  - You are about to drop the column `chargingStationId` on the `Bike` table. All the data in the column will be lost.
  - You are about to drop the column `parkingZoneId` on the `Bike` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `ChargingStation` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `ChargingStation` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `DrivingZone` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `DrivingZone` table. All the data in the column will be lost.
  - You are about to drop the column `radius` on the `DrivingZone` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `ParkingZone` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `ParkingZone` table. All the data in the column will be lost.
  - You are about to drop the column `radius` on the `ParkingZone` table. All the data in the column will be lost.
  - Added the required column `latitudeEnd` to the `ChargingStation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitudeStart` to the `ChargingStation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitudeEnd` to the `ChargingStation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitudeStart` to the `ChargingStation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitudeEnd` to the `DrivingZone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitudeStart` to the `DrivingZone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitudeEnd` to the `DrivingZone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitudeStart` to the `DrivingZone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitudeEnd` to the `ParkingZone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitudeStart` to the `ParkingZone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitudeEnd` to the `ParkingZone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitudeStart` to the `ParkingZone` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Bike` DROP FOREIGN KEY `Bike_chargingStationId_fkey`;

-- DropForeignKey
ALTER TABLE `Bike` DROP FOREIGN KEY `Bike_parkingZoneId_fkey`;

-- AlterTable
ALTER TABLE `Bike` DROP COLUMN `chargingStationId`,
    DROP COLUMN `parkingZoneId`;

-- AlterTable
ALTER TABLE `ChargingStation` DROP COLUMN `latitude`,
    DROP COLUMN `longitude`,
    ADD COLUMN `latitudeEnd` DECIMAL(8, 6) NOT NULL,
    ADD COLUMN `latitudeStart` DECIMAL(8, 6) NOT NULL,
    ADD COLUMN `longitudeEnd` DECIMAL(8, 6) NOT NULL,
    ADD COLUMN `longitudeStart` DECIMAL(8, 6) NOT NULL;

-- AlterTable
ALTER TABLE `DrivingZone` DROP COLUMN `latitude`,
    DROP COLUMN `longitude`,
    DROP COLUMN `radius`,
    ADD COLUMN `latitudeEnd` DECIMAL(8, 6) NOT NULL,
    ADD COLUMN `latitudeStart` DECIMAL(8, 6) NOT NULL,
    ADD COLUMN `longitudeEnd` DECIMAL(8, 6) NOT NULL,
    ADD COLUMN `longitudeStart` DECIMAL(8, 6) NOT NULL;

-- AlterTable
ALTER TABLE `ParkingZone` DROP COLUMN `latitude`,
    DROP COLUMN `longitude`,
    DROP COLUMN `radius`,
    ADD COLUMN `latitudeEnd` DECIMAL(8, 6) NOT NULL,
    ADD COLUMN `latitudeStart` DECIMAL(8, 6) NOT NULL,
    ADD COLUMN `longitudeEnd` DECIMAL(8, 6) NOT NULL,
    ADD COLUMN `longitudeStart` DECIMAL(8, 6) NOT NULL;
