import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const DoctorProfiles = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'doctors'));
        const doctorList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDoctors(doctorList);
      } catch (error) {
        console.error('Error fetching doctor profiles:', error);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Doctor Profiles</h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {doctors.length === 0 ? (
          <p className="text-center col-span-2 text-gray-500">No doctors found.</p>
        ) : (
          doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="p-4 bg-white border rounded-md shadow-sm hover:shadow-lg transition duration-200"
            >
              <h3 className="text-lg font-semibold text-blue-600">
                {doctor.name}
              </h3>
              <p className="text-gray-700">Specialization: {doctor.specialization}</p>
              <p className="text-gray-500">Email: {doctor.email}</p>
              <p className="text-gray-500">Phone: {doctor.phone}</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => alert(`Contacting Dr. ${doctor.name}`)}
              >
                Contact
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorProfiles;
