/*
  Warnings:

  - You are about to drop the column `bicycleId` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the `Bicycle` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bikeId` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Bicycle` DROP FOREIGN KEY `Bicycle_activeUserId_fkey`;

-- DropForeignKey
ALTER TABLE `Bicycle` DROP FOREIGN KEY `Bicycle_chargingStationId_fkey`;

-- DropForeignKey
ALTER TABLE `Bicycle` DROP FOREIGN KEY `Bicycle_parkingZoneId_fkey`;

-- DropForeignKey
ALTER TABLE `Ride` DROP FOREIGN KEY `Ride_bicycleId_fkey`;

-- AlterTable
ALTER TABLE `Ride` DROP COLUMN `bicycleId`,
    ADD COLUMN `bikeId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Bicycle`;

-- CreateTable
CREATE TABLE `Bike` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `latitude` DECIMAL(8, 6) NOT NULL,
    `longitude` DECIMAL(8, 6) NOT NULL,
    `battery` INTEGER NOT NULL,
    `speed` DOUBLE NOT NULL,
    `disabled` BOOLEAN NOT NULL DEFAULT false,
    `activeUserId` VARCHAR(191) NULL,
    `chargingStationId` VARCHAR(191) NULL,
    `parkingZoneId` VARCHAR(191) NULL,

    UNIQUE INDEX `Bike_activeUserId_key`(`activeUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bike` ADD CONSTRAINT `Bike_activeUserId_fkey` FOREIGN KEY (`activeUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bike` ADD CONSTRAINT `Bike_chargingStationId_fkey` FOREIGN KEY (`chargingStationId`) REFERENCES `ChargingStation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bike` ADD CONSTRAINT `Bike_parkingZoneId_fkey` FOREIGN KEY (`parkingZoneId`) REFERENCES `ParkingZone`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ride` ADD CONSTRAINT `Ride_bikeId_fkey` FOREIGN KEY (`bikeId`) REFERENCES `Bike`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
