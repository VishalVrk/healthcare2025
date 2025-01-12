import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, UserPlus, CalendarDays, Stethoscope } from 'lucide-react';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalPrescriptions: 0,
  });

  const [monthlyAppointments, setMonthlyAppointments] = useState([]);
  const [specialtyDistribution, setSpecialtyDistribution] = useState([]);
  const [appointmentStatus, setAppointmentStatus] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsSnap, doctorsSnap, appointmentsSnap, prescriptionsSnap] =
          await Promise.all([
            getDocs(collection(db, 'patients')),
            getDocs(collection(db, 'doctors')),
            getDocs(collection(db, 'appointments')),
            getDocs(collection(db, 'prescriptions')),
          ]);

        setStats({
          totalPatients: patientsSnap.size,
          totalDoctors: doctorsSnap.size,
          totalAppointments: appointmentsSnap.size,
          totalPrescriptions: prescriptionsSnap.size,
        });

        // Process specialties distribution
        const specialties = {};
        doctorsSnap.forEach(doc => {
          const specialty = doc.data().specialization;
          specialties[specialty] = (specialties[specialty] || 0) + 1;
        });
        setSpecialtyDistribution(
          Object.entries(specialties).map(([name, value]) => ({ name, value }))
        );

        // Process monthly appointments with status breakdown
        const monthlyData = {};
        appointmentsSnap.forEach(doc => {
          const { appointmentDate, status } = doc.data();
          const month = new Date(appointmentDate).toLocaleString('default', { month: 'short' });
          
          if (!monthlyData[month]) {
            monthlyData[month] = {
              month,
              completed: 0,
              cancelled: 0,
              pending: 0,
              total: 0
            };
          }
          
          monthlyData[month][status?.toLowerCase() || 'pending']++;
          monthlyData[month].total++;
        });

        setMonthlyAppointments(Object.values(monthlyData));

        // Calculate appointment status distribution
        const statusCount = {
          Completed: 0,
          Cancelled: 0,
          Pending: 0
        };

        appointmentsSnap.forEach(doc => {
          const status = doc.data().status || 'Pending';
          statusCount[status]++;
        });

        setAppointmentStatus(
          Object.entries(statusCount).map(([status, value]) => ({
            name: status,
            value
          }))
        );

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  const STATUS_COLORS = {
    completed: '#00C49F',
    cancelled: '#FF8042',
    pending: '#FFBB28'
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Patients</p>
              <h3 className="text-2xl font-bold">{stats.totalPatients}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <Stethoscope className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Doctors</p>
              <h3 className="text-2xl font-bold">{stats.totalDoctors}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <CalendarDays className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Appointments</p>
              <h3 className="text-2xl font-bold">{stats.totalAppointments}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <UserPlus className="w-8 h-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Prescriptions</p>
              <h3 className="text-2xl font-bold">{stats.totalPrescriptions}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">Appointment Status Distribution</h2>
          </div>
          <div className="p-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appointmentStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {appointmentStatus.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={STATUS_COLORS[entry.name.toLowerCase()] || COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">Monthly Appointments Breakdown</h2>
          </div>
          <div className="p-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyAppointments}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" stackId="a" fill={STATUS_COLORS.completed} name="Completed" />
                  <Bar dataKey="pending" stackId="a" fill={STATUS_COLORS.pending} name="Pending" />
                  <Bar dataKey="cancelled" stackId="a" fill={STATUS_COLORS.cancelled} name="Cancelled" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg lg:col-span-2">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">Doctor Specialization Distribution</h2>
          </div>
          <div className="p-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={specialtyDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {specialtyDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;