-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `githubId` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `balance` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `apiCalls` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `User_githubId_key`(`githubId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Applications` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `apiCalls` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bicycle` (
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

    UNIQUE INDEX `Bicycle_activeUserId_key`(`activeUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChargingStation` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `latitude` DECIMAL(8, 6) NOT NULL,
    `longitude` DECIMAL(8, 6) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ride` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NULL,
    `startLatitude` DECIMAL(8, 6) NOT NULL,
    `startLongitude` DECIMAL(8, 6) NOT NULL,
    `endLatitude` DECIMAL(8, 6) NULL,
    `endLongitude` DECIMAL(8, 6) NULL,
    `fromParkingZone` BOOLEAN NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `bicycleId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParkingZone` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `latitude` DECIMAL(8, 6) NOT NULL,
    `longitude` DECIMAL(8, 6) NOT NULL,
    `radius` DECIMAL(8, 6) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DrivingZone` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `latitude` DECIMAL(8, 6) NOT NULL,
    `longitude` DECIMAL(8, 6) NOT NULL,
    `radius` DECIMAL(8, 6) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bicycle` ADD CONSTRAINT `Bicycle_activeUserId_fkey` FOREIGN KEY (`activeUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bicycle` ADD CONSTRAINT `Bicycle_chargingStationId_fkey` FOREIGN KEY (`chargingStationId`) REFERENCES `ChargingStation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bicycle` ADD CONSTRAINT `Bicycle_parkingZoneId_fkey` FOREIGN KEY (`parkingZoneId`) REFERENCES `ParkingZone`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ride` ADD CONSTRAINT `Ride_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ride` ADD CONSTRAINT `Ride_bicycleId_fkey` FOREIGN KEY (`bicycleId`) REFERENCES `Bicycle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
