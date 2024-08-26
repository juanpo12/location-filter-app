import { Button, TextField } from "@mui/material"

const PhoneFilter = ({setFilter, filter, getPhoneNumbers}: any) => {
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter({
          ...filter,
          [e.target.name]: e.target.value
        });
    };

    const handlePhoneNumbersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const phoneNumbersArray = e.target.value.split(',').map((num) => num.trim());
        setFilter({
          ...filter,
          phoneNumbers: phoneNumbersArray,
        });
      };

    return (
        <div className="flex flex-col w-full p-6">
            <h1 className="text-center">Phone Filter</h1>
            <div className="md:grid grid-cols-2 border p-4 gap-4">

                <TextField
                name="startDate"
                label="Start Date"
                type="datetime-local"
                value={filter.startDate}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
                />
                <TextField
                name="endDate"
                label="End Date"
                type="datetime-local"
                value={filter.endDate}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
                />
                <TextField
                name="minLat"
                label="Min Latitude"
                type="number"
                value={filter.minLat}
                onChange={handleFilterChange}
                />
                <TextField
                name="maxLat"
                label="Max Latitude"
                type="number"
                value={filter.maxLat}
                onChange={handleFilterChange}
                />
                <TextField
                name="minLon"
                label="Min Longitude"
                type="number"
                value={filter.minLon}
                onChange={handleFilterChange}
                />
                <TextField
                name="maxLon"
                label="Max Longitude"
                type="number"
                value={filter.maxLon}
                onChange={handleFilterChange}
                />
                <TextField
                name="phoneNumbers"
                label="Phone Numbers (comma separated)"
                value={filter.phoneNumbers.join(',')}
                onChange={handlePhoneNumbersChange}
                />
            </div>
            <Button variant="contained" disabled={!filter.startDate || !filter.endDate || !filter.phoneNumbers || !filter.minLat || !filter.maxLat || !filter.minLon || !filter.maxLon} onClick={getPhoneNumbers}>Apply</Button>
        </div>
    )
}

export default PhoneFilter