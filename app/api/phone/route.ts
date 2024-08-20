import { PrismaClient } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export const GET = async (req: NextRequest) => {
  try {
    const phoneNumbers = await prisma.callRecord.findMany()

    if(!phoneNumbers) {
      return NextResponse.json({ error: 'No phone numbers found' }, { status: 404 })
    }

    return NextResponse.json(phoneNumbers as any, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const { number, timestamp, latitude, longitude, called, antennaId, azimuth, horizontalAperture, coverageRadius, duration } = await req.json()

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      return NextResponse.json({ error: 'Invalid latitude' }, { status: 400 })
    }
    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      return NextResponse.json({ error: 'Invalid longitude' }, { status: 400 })
    }
    
    if (!number || !timestamp 
      || called === undefined 
      || antennaId === undefined 
      || azimuth === undefined 
      || horizontalAperture === undefined 
      || coverageRadius === undefined 
      || duration === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existingRecord = await prisma.callRecord.findFirst({
      where: {
        caller: number,
        datetime: new Date(timestamp),
        latitude,
        longitude,
      },
    })
    
    if (existingRecord) {
      return NextResponse.json({ error: 'Record already exists' }, { status: 409 })
    }
    

    const phoneNumber = await prisma.callRecord.create({
      data: {
        caller: number,
        datetime: new Date(timestamp),
        latitude,
        longitude,
        called,
        antennaId,
        azimuth,
        horizontalAperture,
        coverageRadius,
        duration,
      },
    })

    return NextResponse.json(phoneNumber, { status: 201 })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
