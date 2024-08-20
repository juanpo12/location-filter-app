-- CreateTable
CREATE TABLE "CallRecord" (
    "id" SERIAL NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "caller" TEXT NOT NULL,
    "called" TEXT NOT NULL,
    "antennaId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "azimuth" INTEGER NOT NULL,
    "horizontalAperture" INTEGER NOT NULL,
    "coverageRadius" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "CallRecord_pkey" PRIMARY KEY ("id")
);
