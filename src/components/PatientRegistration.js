import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Plus, X } from 'lucide-react';

const PatientRegistration = () => {
  const initialMedicalHistory = {
    conditions: [],
    allergies: [],
    medications: [],
    surgeries: [],
    familyHistory: [],
    bloodType: '',
    height: '',
    weight: '',
    smokingStatus: 'never',
    alcoholConsumption: 'none',
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    address: '',
    emergencyContact: {
      name: '',
      relation: '',
      phone: '',
    },
    medicalHistory: initialMedicalHistory,
  });

  // Common medical conditions for suggestions
  const commonConditions = [
    'Hypertension',
    'Diabetes Type 2',
    'Diabetes Type 1',
    'Asthma',
    'Arthritis',
    'Depression',
    'Anxiety',
    'Heart Disease',
    'High Cholesterol',
    'Thyroid Disorder',
  ];

  // Common allergies
  const commonAllergies = [
    'Penicillin',
    'Peanuts',
    'Latex',
    'Dust',
    'Pollen',
    'Milk',
    'Eggs',
    'Shellfish',
    'Soy',
    'Wheat',
  ];

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [name]: value,
      },
    }));
  };

  const handleMedicalHistoryChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [field]: value,
      },
    }));
  };

  const addListItem = (field, item) => {
    if (item && !formData.medicalHistory[field].includes(item)) {
      handleMedicalHistoryChange(field, [...formData.medicalHistory[field], item]);
    }
  };

  const removeListItem = (field, index) => {
    const newList = formData.medicalHistory[field].filter((_, i) => i !== index);
    handleMedicalHistoryChange(field, newList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'patients'), formData);
      alert('Patient registered successfully!');
      setFormData({
        name: '',
        email: '',
        dateOfBirth: '',
        gender: '',
        phone: '',
        address: '',
        emergencyContact: {
          name: '',
          relation: '',
          phone: '',
        },
        medicalHistory: initialMedicalHistory,
      });
    } catch (error) {
      console.error('Error registering patient:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-6">Patient Registration</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="dateOfBirth"
              type="date"
              placeholder="Date of Birth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
            <select
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <input
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="name"
              placeholder="Contact Name"
              value={formData.emergencyContact.name}
              onChange={handleEmergencyContactChange}
              required
            />
            <input
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="relation"
              placeholder="Relationship"
              value={formData.emergencyContact.relation}
              onChange={handleEmergencyContactChange}
              required
            />
            <input
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="phone"
              type="tel"
              placeholder="Contact Phone"
              value={formData.emergencyContact.phone}
              onChange={handleEmergencyContactChange}
              required
            />
          </div>
        </div>

        {/* Medical History */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Medical History</h3>
          
          {/* Basic Health Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              value={formData.medicalHistory.bloodType}
              onChange={(e) => handleMedicalHistoryChange('bloodType', e.target.value)}
            >
              <option value="">Blood Type</option>
              {bloodTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="number"
              placeholder="Height (cm)"
              value={formData.medicalHistory.height}
              onChange={(e) => handleMedicalHistoryChange('height', e.target.value)}
            />
            <input
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="number"
              placeholder="Weight (kg)"
              value={formData.medicalHistory.weight}
              onChange={(e) => handleMedicalHistoryChange('weight', e.target.value)}
            />
          </div>

          {/* Medical Conditions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medical Conditions
            </label>
            <div className="flex gap-2 mb-2">
              <select
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                onChange={(e) => {
                  if (e.target.value) addListItem('conditions', e.target.value);
                  e.target.value = '';
                }}
              >
                <option value="">Select or type condition</option>
                {commonConditions.map((condition) => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  const condition = prompt('Enter medical condition:');
                  if (condition) addListItem('conditions', condition);
                }}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.medicalHistory.conditions.map((condition, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
                >
                  {condition}
                  <button
                    type="button"
                    onClick={() => removeListItem('conditions', index)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allergies
            </label>
            <div className="flex gap-2 mb-2">
              <select
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                onChange={(e) => {
                  if (e.target.value) addListItem('allergies', e.target.value);
                  e.target.value = '';
                }}
              >
                <option value="">Select or type allergy</option>
                {commonAllergies.map((allergy) => (
                  <option key={allergy} value={allergy}>{allergy}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  const allergy = prompt('Enter allergy:');
                  if (allergy) addListItem('allergies', allergy);
                }}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.medicalHistory.allergies.map((allergy, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-700"
                >
                  {allergy}
                  <button
                    type="button"
                    onClick={() => removeListItem('allergies', index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Lifestyle Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              value={formData.medicalHistory.smokingStatus}
              onChange={(e) => handleMedicalHistoryChange('smokingStatus', e.target.value)}
            >
              <option value="never">Never Smoked</option>
              <option value="former">Former Smoker</option>
              <option value="current">Current Smoker</option>
            </select>
            <select
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              value={formData.medicalHistory.alcoholConsumption}
              onChange={(e) => handleMedicalHistoryChange('alcoholConsumption', e.target.value)}
            >
              <option value="none">No Alcohol</option>
              <option value="occasional">Occasional</option>
              <option value="moderate">Moderate</option>
              <option value="heavy">Heavy</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Register Patient
        </button>
      </form>
    </div>
  );
};

export default PatientRegistration;