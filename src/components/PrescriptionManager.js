import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Plus, X } from 'lucide-react';

const PrescriptionManager = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  
  // Common medications and dosage units for suggestions
  const commonMedications = [
    'Amoxicillin',
    'Ibuprofen',
    'Paracetamol',
    'Omeprazole',
    'Metformin',
    'Amlodipine',
    'Lisinopril',
    'Metoprolol',
    'Sertraline',
    'Gabapentin'
  ];

  const commonDosageUnits = [
    'mg',
    'mcg',
    'g',
    'ml',
    'tablets',
    'capsules',
    'drops',
    'puffs'
  ];

  const frequencyOptions = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 4 hours',
    'Every 6 hours',
    'Every 8 hours',
    'Every 12 hours',
    'As needed',
    'Before meals',
    'After meals',
    'At bedtime'
  ];

  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    doctorName: '',
    doctorId: '',
    medications: [{
      name: '',
      dosage: '',
      unit: 'mg',
      frequency: '',
      duration: '',
      instructions: ''
    }],
    generalInstructions: ''
  });

  const [medicationSuggestions, setMedicationSuggestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all necessary data
        const [prescriptionSnapshot, doctorSnapshot, patientSnapshot] = await Promise.all([
          getDocs(collection(db, 'prescriptions')),
          getDocs(collection(db, 'doctors')),
          getDocs(collection(db, 'patients'))
        ]);

        setPrescriptions(prescriptionSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
        setDoctors(doctorSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
        setPatients(patientSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'doctorId') {
      const selectedDoctor = doctors.find(doctor => doctor.id === value);
      setFormData({
        ...formData,
        doctorId: value,
        doctorName: selectedDoctor ? selectedDoctor.name : ''
      });
    } else if (name === 'patientId') {
      const selectedPatient = patients.find(patient => patient.id === value);
      setFormData({
        ...formData,
        patientId: value,
        patientName: selectedPatient ? selectedPatient.name : ''
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = formData.medications.map((medication, i) => {
      if (i === index) {
        return { ...medication, [field]: value };
      }
      return medication;
    });
    
    setFormData({ ...formData, medications: updatedMedications });

    // Show suggestions for medication names
    if (field === 'name' && value) {
      const suggestions = commonMedications.filter(med => 
        med.toLowerCase().includes(value.toLowerCase())
      );
      setMedicationSuggestions(suggestions);
    } else {
      setMedicationSuggestions([]);
    }
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [
        ...formData.medications,
        {
          name: '',
          dosage: '',
          unit: 'mg',
          frequency: '',
          duration: '',
          instructions: ''
        }
      ]
    });
  };

  const removeMedication = (index) => {
    if (formData.medications.length > 1) {
      const updatedMedications = formData.medications.filter((_, i) => i !== index);
      setFormData({ ...formData, medications: updatedMedications });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'prescriptions'), formData);
      alert('Prescription added successfully!');
      setFormData({
        patientName: '',
        patientId: '',
        doctorName: '',
        doctorId: '',
        medications: [{
          name: '',
          dosage: '',
          unit: 'mg',
          frequency: '',
          duration: '',
          instructions: ''
        }],
        generalInstructions: ''
      });
    } catch (error) {
      console.error('Error adding prescription:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Prescription Manager</h2>

      {/* Prescription Form */}
      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <div>
            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
              Patient Name
            </label>
            <select
              id="patientId"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700 mb-1">
              Doctor Name
            </label>
            <select
              id="doctorId"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Medications Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Medications</h3>
            <button
              type="button"
              onClick={addMedication}
              className="flex items-center px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Medication
            </button>
          </div>

          {formData.medications.map((medication, index) => (
            <div key={index} className="p-4 border rounded-md bg-white">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-md font-medium">Medication #{index + 1}</h4>
                {formData.medications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                <div className="relative">
                  <input
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="text"
                    placeholder="Medication Name"
                    value={medication.name}
                    onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                    required
                  />
                  {medicationSuggestions.length > 0 && medication.name && (
                    <div className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg">
                      {medicationSuggestions.map((suggestion) => (
                        <div
                          key={suggestion}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            handleMedicationChange(index, 'name', suggestion);
                            setMedicationSuggestions([]);
                          }}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    className="w-2/3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="text"
                    placeholder="Dosage"
                    value={medication.dosage}
                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                    required
                  />
                  <select
                    className="w-1/3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    value={medication.unit}
                    onChange={(e) => handleMedicationChange(index, 'unit', e.target.value)}
                    required
                  >
                    {commonDosageUnits.map((unit) => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>

                <select
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  value={medication.frequency}
                  onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                  required
                >
                  <option value="">Select Frequency</option>
                  {frequencyOptions.map((freq) => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>

                <input
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  type="text"
                  placeholder="Duration (e.g., 7 days, 2 weeks)"
                  value={medication.duration}
                  onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                  required
                />
              </div>

              <div className="mt-4">
                <textarea
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Special instructions for this medication"
                  value={medication.instructions}
                  onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                  rows="2"
                />
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            General Instructions
          </label>
          <textarea
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="generalInstructions"
            placeholder="Additional instructions or notes"
            value={formData.generalInstructions}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Add Prescription
        </button>
      </form>

      {/* Prescription List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Existing Prescriptions</h3>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {prescriptions.length === 0 ? (
            <p className="text-center text-gray-500">No prescriptions available.</p>
          ) : (
            prescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="p-4 bg-white border rounded-md shadow-sm hover:shadow-lg transition duration-200"
              >
                <h4 className="text-lg font-bold text-blue-600">
                  {prescription.patientName}
                </h4>
                <p className="text-gray-700">Doctor: {prescription.doctorName}</p>
                <div className="mt-2">
                  <p className="font-medium">Medications:</p>
                  {prescription.medications.map((med, index) => (
                    <div key={index} className="ml-4 mt-2">
                      <p className="text-gray-700">• {med.name} - {med.dosage}{med.unit}</p>
                      <p className="text-gray-500 text-sm">Frequency: {med.frequency}</p>
                      <p className="text-gray-500 text-sm">Duration: {med.duration}</p>
                      {med.instructions && (
                        <p className="text-gray-500 text-sm">Notes: {med.instructions}</p>
                      )}
                    </div>
                  ))}
                </div>
                {prescription.generalInstructions && (
                  <div className="mt-2">
                    <p className="font-medium">General Instructions:</p>
                    <p className="text-gray-500">{prescription.generalInstructions}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionManager;