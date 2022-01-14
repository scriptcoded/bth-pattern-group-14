-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `githubId` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `balance` INTEGER NOT NULL DEFAULT 0,
    `apiCalls` INTEGER NOT NULL DEFAULT 0,
    `stripeCustomerId` VARCHAR(191) NULL,

    UNIQUE INDEX `User_githubId_key`(`githubId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `amount` INTEGER NOT NULL DEFAULT 0,
    `automatic` BOOLEAN NOT NULL DEFAULT false,
    `paid` BOOLEAN NOT NULL DEFAULT false,
    `checkoutId` VARCHAR(191) NULL,
    `invoiceId` VARCHAR(191) NULL,
    `invoiceLink` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Payment_checkoutId_key`(`checkoutId`),
    UNIQUE INDEX `Payment_invoiceId_key`(`invoiceId`),
    UNIQUE INDEX `Payment_invoiceLink_key`(`invoiceLink`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Applications` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `apiCalls` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bike` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `latitude` DECIMAL(8, 6) NOT NULL,
    `longitude` DECIMAL(8, 6) NOT NULL,
    `battery` INTEGER NOT NULL DEFAULT 0,
    `speed` DOUBLE NOT NULL DEFAULT 0,
    `disabled` BOOLEAN NOT NULL DEFAULT false,

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
    `toParkingZone` BOOLEAN NULL,
    `chargedAmount` INTEGER NULL,
    `userId` VARCHAR(191) NOT NULL,
    `bikeId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChargingStation` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `latitudeStart` DECIMAL(8, 6) NOT NULL,
    `longitudeStart` DECIMAL(8, 6) NOT NULL,
    `latitudeEnd` DECIMAL(8, 6) NOT NULL,
    `longitudeEnd` DECIMAL(8, 6) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParkingZone` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `latitudeStart` DECIMAL(8, 6) NOT NULL,
    `longitudeStart` DECIMAL(8, 6) NOT NULL,
    `latitudeEnd` DECIMAL(8, 6) NOT NULL,
    `longitudeEnd` DECIMAL(8, 6) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DrivingZone` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `latitudeStart` DECIMAL(8, 6) NOT NULL,
    `longitudeStart` DECIMAL(8, 6) NOT NULL,
    `latitudeEnd` DECIMAL(8, 6) NOT NULL,
    `longitudeEnd` DECIMAL(8, 6) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ride` ADD CONSTRAINT `Ride_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ride` ADD CONSTRAINT `Ride_bikeId_fkey` FOREIGN KEY (`bikeId`) REFERENCES `Bike`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
