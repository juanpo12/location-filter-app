import { PhoneNumber } from "@/utils/types"
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from "next/server"

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

        if (!startDate || !endDate || !phoneNumbers.length || !minLat || !maxLat || !minLon || !maxLon) {
          return NextResponse.json({ error: 'Missing required query parameters' }, { status: 400 });
        }

        const phoneRecords = await prisma.callRecord.findMany({
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
        })

        if (phoneRecords.length === 0) {
            return NextResponse.json({ error: 'No phone numbers found' }, { status: 404 })
        }

        const response = phoneRecords.map(record => ({
            phone: record.caller,
            date: record.datetime,
            location: {
              lat: record.latitude,
              lon: record.longitude,
            },
            antennaId: record.antennaId,
          }))

        return NextResponse.json(phoneRecords, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
    }
}