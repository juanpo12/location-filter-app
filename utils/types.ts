export interface PhoneNumber {
    id: number
    number: string
    timestamp: Date
    latitude: number
    longitude: number
    caller: string
    called: string
    antennaId: string
    azimuth: number
    horizontalAperture: number
    coverageRadius: number
    duration: number
    datetime: Date
}