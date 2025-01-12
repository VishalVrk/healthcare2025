import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { ChevronDown, ChevronUp } from "lucide-react";

const AppointmentScheduler = () => {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    notes: '',
  });

  const [isReasonDropdownOpen, setIsReasonDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [minDate, setMinDate] = useState('');

  const commonReasons = [
    "Annual Check-up",
    "Follow-up Appointment",
    "Vaccination",
    "Illness or Infection",
    "Prescription Renewal",
    "Specialist Consultation",
    "Physical Therapy",
    "Review Lab Results",
    "Health Screening",
    "Other (Please Specify)"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsSnap = await getDocs(collection(db, 'patients'));
        const doctorsSnap = await getDocs(collection(db, 'doctors'));

        setPatients(patientsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setDoctors(doctorsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setMinDate(formattedDate);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'appointments'), formData);
      alert('Appointment scheduled successfully!');
      setFormData({
        patientId: '',
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error scheduling appointment:', error);
    }
  };

  const filteredReasons = commonReasons.filter(reason =>
    reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Schedule Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Patient</label>
          <select
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select a Patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Doctor</label>
          <select
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select a Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            name="appointmentDate"
            type="date"
            value={formData.appointmentDate}
            onChange={handleChange}
            min={minDate}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Time</label>
          <input
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            name="appointmentTime"
            type="time"
            value={formData.appointmentTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium mb-1">Reason for Visit</label>
          <div className="relative">
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              onClick={() => setIsReasonDropdownOpen(true)}
              placeholder="Select or type reason..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <button
              type="button"
              onClick={() => setIsReasonDropdownOpen(!isReasonDropdownOpen)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              {isReasonDropdownOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
          {isReasonDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
              <input
                type="text"
                placeholder="Search reasons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border-b focus:outline-none"
              />
              <div className="max-h-48 overflow-y-auto">
                {filteredReasons.map((reason) => (
                  <div
                    key={reason}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      if (reason === "Other (Please Specify)") {
                        setFormData({ ...formData, reason: "" });
                      } else {
                        setFormData({ ...formData, reason });
                      }
                      setIsReasonDropdownOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    {reason}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            name="notes"
            rows="3"
            placeholder="Additional notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Schedule
        </button>
      </form>
    </div>
  );
};

export default AppointmentScheduler;