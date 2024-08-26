'use client'
import ModalConfirmDelete from "@/component/ModalConfirmDelete";
import NewPhone from "@/component/NewPhone";
import PhoneFilter from "@/component/PhoneFilter";
import { Alert, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
const MapComponent = dynamic(() => import('@/component/MapComponent'), { ssr: false });


export default function Home() {
  const [filter, setFilter] = useState({
    startDate: '',
    endDate: '',
    phoneNumbers: [],
    minLat: '',
    maxLat: '',
    minLon: '',
    maxLon: ''
  });
  const [phoneNumbers, setPhoneNumbers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>('');
  
  const [showMap, setShowMap] = useState({
    latitude: 0,
    longitude: 0
  });


  const formatDateToUTC = (date: string): string => {
    if (date.includes("T")) {
      return date.includes(":00Z") ? date : `${date}:00Z`;
    }
    return date;
  };

  const deletePhoneNumber = async (id: number) => {
    try {
      const res = await fetch(`/api/phone?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Error deleting phone number');
      }
      getPhoneNumbers();
    } catch (err: any) {
      if(err) {
        setError(err.message);
      }
    }
  }

  const getPhoneNumbers = async () => {
    try {
      const formattedStartDate = formatDateToUTC(filter.startDate);
      const formattedEndDate = formatDateToUTC(filter.endDate);
      const res = await fetch(`/api/phone?startDate=${formattedStartDate}&endDate=${formattedEndDate}&${
        filter.phoneNumbers
          ? filter.phoneNumbers.map((phoneNumber) => `phoneNumbers=${encodeURIComponent(phoneNumber)}`).join('&')
          : ''
      }&minLat=${filter.minLat}&maxLat=${filter.maxLat}&minLon=${filter.minLon}&maxLon=${filter.maxLon}`);
      if (!res.ok) {
        throw new Error('there are no phone numbers for this filter');
      }
      const data = await res.json();
      setPhoneNumbers(data);
      setError('');
    } catch (err: any) {
      if(err) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPhoneNumbers();

  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col md:flex-row p-4">
        <NewPhone/>
          {
            error &&
          <Alert severity="error">{error}</Alert>
          }
          <Button onClick={() => {
            setFilter({
              startDate: '',
              endDate: '',
              phoneNumbers: [],
              minLat: '',
              maxLat: '',
              minLon: '',
              maxLon: ''
            }
          )
          setError('')
          }}>Clear Filter</Button>
      </div>
      <div >
        <PhoneFilter getPhoneNumbers={getPhoneNumbers}  setFilter={setFilter} filter={filter}></PhoneFilter>
      </div>
      <TableContainer>
        <Table>
        <TableHead>
           <TableRow>
             <TableCell>datetime</TableCell>
             <TableCell>called</TableCell>
             <TableCell>Caller</TableCell>
             <TableCell>Latitude</TableCell>
             <TableCell>Longitude</TableCell>
             <TableCell>azimuth</TableCell>
             <TableCell>horizontalAperture</TableCell>
             <TableCell>coverageRadius</TableCell>
             <TableCell>Duration</TableCell>
             <TableCell>Antenna Id</TableCell>
           </TableRow>
        </TableHead>
        <TableBody>
          {phoneNumbers && phoneNumbers?.map((phoneNumber) => (
            <TableRow key={phoneNumber.id}>
              <TableCell>{phoneNumber?.datetime}</TableCell>
              <TableCell>{phoneNumber?.called}</TableCell>
              <TableCell>{phoneNumber?.caller}</TableCell>
              <TableCell>{phoneNumber?.latitude}</TableCell>
              <TableCell>{phoneNumber?.longitude}</TableCell>
              <TableCell>{phoneNumber?.azimuth}</TableCell>
              <TableCell>{phoneNumber?.horizontalAperture}</TableCell>
              <TableCell>{phoneNumber?.coverageRadius}</TableCell>
              <TableCell>{phoneNumber?.duration}</TableCell>
              <TableCell>{phoneNumber?.antennaId}</TableCell>
              <TableCell sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" onClick={() => setShowMap({latitude: phoneNumber?.latitude, longitude: phoneNumber?.longitude})}>Show</Button>
                <ModalConfirmDelete deletePhoneNumber={deletePhoneNumber} id={phoneNumber?.id}></ModalConfirmDelete>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </TableContainer>
      <MapComponent latitude={showMap.latitude} longitude={showMap.longitude}></MapComponent>
    </main>
  );
}
