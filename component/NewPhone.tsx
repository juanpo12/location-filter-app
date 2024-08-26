'use client'
import { Button, Dialog, DialogTitle } from "@mui/material";
import { useState } from "react";

const NewPhone = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    datetime: '',
    caller: '',
    called: '',
    antennaId: '',
    latitude: 0,
    longitude: 0,
    azimuth: 0,
    horizontalAperture: 0,
    coverageRadius: 0,
    duration: 0,
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.datetime) newErrors.push("Datetime is required.");
    if (!formData.caller || !/^\d+$/.test(formData.caller)) newErrors.push("Caller must be a valid phone number.");
    if (!formData.called || !/^\d+$/.test(formData.called)) newErrors.push("Called must be a valid phone number.");

    const latitude = parseFloat(formData.latitude.toString());
    const longitude = parseFloat(formData.longitude.toString());
    if (isNaN(latitude) || latitude < -90 || latitude > 90) newErrors.push("Latitude must be between -90 and 90.");
    if (isNaN(longitude) || longitude < -180 || longitude > 180) newErrors.push("Longitude must be between -180 and 180.");

    if (parseInt(formData.azimuth.toString(), 10) <= 0) newErrors.push("Azimuth must be a positive number.");
    if (parseInt(formData.horizontalAperture.toString(), 10) <= 0) newErrors.push("Horizontal Aperture must be a positive number.");
    if (parseFloat(formData.coverageRadius.toString()) <= 0) newErrors.push("Coverage Radius must be a positive number.");
    if (parseInt(formData.duration.toString(), 10) <= 0) newErrors.push("Duration must be a positive number.");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const datetimeISO = new Date(formData.datetime).toISOString();
    const payload = {
      ...formData,
      datetime: datetimeISO,
      latitude: parseFloat(formData.latitude.toString()),
      longitude: parseFloat(formData.longitude.toString()),
      azimuth: parseInt(formData.azimuth.toString(), 10),
      horizontalAperture: parseInt(formData.horizontalAperture.toString(), 10),
      coverageRadius: parseFloat(formData.coverageRadius.toString()),
      duration: parseInt(formData.duration.toString(), 10),
    };

    fetch('/api/phone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        alert('Phone added successfully!');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
      >
        Add Phone
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle className="text-xl font-semibold text-gray-800">
          Add Phone
        </DialogTitle>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.length > 0 && (
            <div className="bg-red-100 text-red-800 p-3 rounded-md">
              <ul className="list-disc pl-5">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Datetime:</label>
            <input
              type="datetime-local"
              name="datetime"
              value={formData.datetime}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Caller:</label>
            <input
              type="text"
              name="caller"
              value={formData.caller}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Called:</label>
            <input
              type="text"
              name="called"
              value={formData.called}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Antenna ID:</label>
            <input
              type="text"
              name="antennaId"
              value={formData.antennaId}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Latitude:</label>
            <input
              type="number"
              step="any"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Longitude:</label>
            <input
              type="number"
              step="any"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Azimuth:</label>
            <input
              type="number"
              name="azimuth"
              value={formData.azimuth}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Horizontal Aperture:</label>
            <input
              type="number"
              name="horizontalAperture"
              value={formData.horizontalAperture}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Coverage Radius:</label>
            <input
              type="number"
              step="any"
              name="coverageRadius"
              value={formData.coverageRadius}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Duration (seconds):</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </Dialog>
    </div>
  );
};

export default NewPhone;
