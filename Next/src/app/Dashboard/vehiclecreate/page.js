'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function VehicleCreate() {
    const [vehicleName, setVehicleName] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [model, setModel] = useState('');
    const [yearOfManufacture, setYearOfManufacture] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [engineType, setEngineType] = useState('');
    const [engineCapacity, setEngineCapacity] = useState('');
    const [mileage, setMileage] = useState('');
    const [fuelCapacity, setFuelCapacity] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!vehicleName.trim()) {
            setErrorMsg('Vehicle Name is required.');
            setSuccessMsg('');
            return;
        }
        if (!/^[A-Z0-9]{0,13}$/.test(vehicleNumber)) {
            setErrorMsg('Invalid vehicle number format.');
            setSuccessMsg('');
            return;
        }
        if (!/^[a-zA-Z0-9\s\-]{0,30}$/.test(model)) {
            setErrorMsg('Model should be a maximum of 30 characters.');
            setSuccessMsg('');
            return;
        }
        const currentYear = new Date().getFullYear();
        if (!/^\d{0,4}$/.test(yearOfManufacture) && (+yearOfManufacture >= 1900 && +yearOfManufacture <= currentYear)) {
            setErrorMsg('Invalid year of manufacture.');
            setSuccessMsg('');
            return;
        }
        if (!/^[A-Z0-9]{0,13}$/.test(registrationNumber)) {
            setErrorMsg('Invalid registration number format.');
            setSuccessMsg('');
            return;
        }
        if (!/^\d{0,4}$/.test(engineCapacity)) {
            setErrorMsg('Invalid engine capacity format.');
            setSuccessMsg('');
            return;
        }
        if (!/^\d{0,3}(\.\d{0,2})?$/.test(mileage)) {
            setErrorMsg('Invalid mileage format.');
            setSuccessMsg('');
            return;
        }
        if (!/^\d{0,3}(\.\d{0,2})?$/.test(fuelCapacity)) {
            setErrorMsg('Invalid fuel capacity format.');
            setSuccessMsg('');
            return;
        }

        try {
            await api.post('vehicle-store', {
                VehicleName: vehicleName,
                VehicleNumber: vehicleNumber,
                Make: manufacturer,
                Model: model,
                YearofManufacture: yearOfManufacture,
                VehicleType: vehicleType,
                RegistrationNumber: registrationNumber,
                EngineType: engineType,
                EngineCapacity: engineCapacity,
                Mileage: mileage,
                FuelCapacity: fuelCapacity
            });

            setSuccessMsg('Vehicle created successfully! 🎉');
            setErrorMsg('');
            setVehicleName('');
            setVehicleNumber('');
            setManufacturer('');
            setModel('');
            setYearOfManufacture('');
            setVehicleType('');
            setRegistrationNumber('');
            setEngineType('');
            setEngineCapacity('');
            setMileage('');
            setFuelCapacity('');
        } catch (error) {
            console.error('Error creating vehicle:', error);
            setErrorMsg('Failed to create vehicle. Please try again.');
            setSuccessMsg('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Create New Vehicle</h2>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className="form-label fw-bold">
                            Vehicle Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={vehicleName}
                            onChange={(e) => setVehicleName(e.target.value)}
                            placeholder='Enter vehicle name'
                            required
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                        <label className="form-label fw-bold">
                            Vehicle Number <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={vehicleNumber}
                            onChange={(e) => {
                                const input = e.target.value.toUpperCase();
                                if (/^[A-Z0-9]{0,13}$/.test(input)) {
                                    setVehicleNumber(input);
                                }
                            }}
                            required
                            placeholder='Enter vehicle number'
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className="form-label fw-bold">Manufacturer <span className='text-danger'>*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            value={manufacturer}
                            onChange={(e) => setManufacturer(e.target.value)}
                            required
                            placeholder='Enter manufacturer name'
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                        <label className='form-label fw-bold'>Model <span className='text-danger'>*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            value={model}
                            onChange={(e) => {
                                const input = e.target.value;
                                if (/^[a-zA-Z0-9\s\-]{0,30}$/.test(input)) {
                                    setModel(input);
                                }
                            }}
                            required
                            placeholder='Enter model name'
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className='form-label fw-bold'>Year Of Manufacture <span className='text-danger'>*</span></label>
                        <input
                            type="number"
                            min="1900"
                            max={new Date().getFullYear()}
                            className="form-control"
                            value={yearOfManufacture}
                            onChange={(e) => {
                                const input = e.target.value;
                                const currentYear = new Date().getFullYear();
                                if (/^\d{0,4}$/.test(input)) {
                                    setYearOfManufacture(input);
                                }
                            }}
                            required
                            placeholder='Enter year of manufacture'
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                        <label className='form-label fw-bold'>Vehicle Type</label>
                        <select
                            className='form-select'
                            name="VehicleType"
                            value={vehicleType}
                            onChange={(e) => setVehicleType(e.target.value)}
                        >
                            <option value="">-- Select Vehicle Type --</option>
                            <option value="Auto">Auto</option>
                            <option value="E-Rickshaw">E-Rickshaw</option>
                            <option value="Mini-Truck">Mini-Truck</option>
                            <option value="Two-Wheeler">Two-Wheeler</option>
                            <option value="Van">Van</option>
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className='form-label fw-bold'>Registration Number <span className='text-danger'>*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            value={registrationNumber}
                            onChange={(e) => {
                                const input = e.target.value.toUpperCase();
                                if (/^[A-Z0-9]{0,13}$/.test(input)) {
                                    setRegistrationNumber(input);
                                }
                            }}
                            required
                            placeholder='Enter registration number'
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className='form-label fw-bold'>Engine Type</label>
                        <select
                            className='form-select'
                            name="EngineType"
                            value={engineType}
                            onChange={(e) => setEngineType(e.target.value)}
                        >
                            <option value="">-- Select Engine Type --</option>
                            <option value="CNG">CNG</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Electric">Electric</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="LPG">LPG</option>
                            <option value="Petrol">Petrol</option>
                        </select>
                    </div>
                    <div className="mb-3 col-md-6">
                        <label className='form-label fw-bold'>Engine Capacity</label>
                        <input
                            type="text"
                            className="form-control"
                            value={engineCapacity}
                            placeholder='Enter engine capacity in CC'
                            onChange={(e) => {
                                const input = e.target.value;
                                if (/^\d{0,4}$/.test(input)) {
                                    setEngineCapacity(input);
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className='form-label fw-bold'>Mileage</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter mileage (e.g. 45.5)"
                            value={mileage}
                            onChange={(e) => {
                                const input = e.target.value;
                                if (/^\d{0,3}(\.\d{0,2})?$/.test(input)) {
                                    setMileage(input);
                                }
                            }}
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                        <label className='form-label fw-bold'>Fuel Capacity</label>
                        <input
                            type="text"
                            className="form-control"
                            value={fuelCapacity}
                            placeholder="Enter fuel capacity (e.g. 45.5)"
                            onChange={(e) => {
                                const input = e.target.value;
                                if (/^\d{0,3}(\.\d{0,2})?$/.test(input)) {
                                    setFuelCapacity(input);
                                }
                            }}
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading && (
                        <span
                            className="spinner-border spinner-border-sm text-light"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    )}
                    {loading ? ' Creating...' : 'Create Vehicle'}
                </button>
            </form>
        </div>
    );
}
