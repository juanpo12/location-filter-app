import { PrismaClient } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams

    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const phoneNumbers = searchParams.getAll('phoneNumbers');
    const minLat = searchParams.get('minLat');
    const maxLat = searchParams.get('maxLat');
    const minLon = searchParams.get('minLon');
    const maxLon = searchParams.get('maxLon');

    let phoneRecords;

    if (startDate && endDate && phoneNumbers.length && minLat && maxLat && minLon && maxLon) {
      phoneRecords = await prisma.callRecord.findMany({
        where: {
          datetime: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
          caller: {
            in: phoneNumbers,
          },
          latitude: {
            gte: parseFloat(minLat),
            lte: parseFloat(maxLat),
          },
          longitude: {
            gte: parseFloat(minLon),
            lte: parseFloat(maxLon),
          }
        }
      });

      if (phoneRecords.length <= 0) {
        return NextResponse.json({ error: 'No records found with the given filters'}, { status: 404 });
      }
    } else {
      phoneRecords = await prisma.callRecord.findMany();
      if (!phoneRecords.length) {
        return NextResponse.json({ error: 'No phone numbers found' }, { status: 404 });
      }
    }

    return NextResponse.json(phoneRecords, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const { caller, datetime, latitude, longitude, called, antennaId, azimuth, horizontalAperture, coverageRadius, duration } = await req.json()

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      return NextResponse.json({ error: 'Invalid latitude' }, { status: 400 })
    }
    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      return NextResponse.json({ error: 'Invalid longitude' }, { status: 400 })
    }
    
    if (!caller || !datetime 
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
        caller: caller,
        datetime: new Date(datetime),
        latitude,
        longitude,
      },
    })
    
    if (existingRecord) {
      return NextResponse.json({ error: 'Record already exists' }, { status: 409 })
    }
    

    const phoneNumber = await prisma.callRecord.create({
      data: {
        caller: caller,
        datetime: new Date(datetime),
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

export const DELETE = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await prisma.callRecord.delete({
      where: {
        id: +id
      }
    })

    return NextResponse.json({ message: 'Record deleted successfully' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}