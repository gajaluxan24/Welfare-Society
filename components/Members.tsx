import React, { useState } from 'react';
import { useWelfareData } from '../context/WelfareDataContext';
import Modal from './ui/Modal';
import { Member } from '../types';

const AddMemberForm: React.FC<{ onAdd: (member: Omit<Member, 'id'>) => void, onClose: () => void }> = ({ onAdd, onClose }) => {
    const [name, setName] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [designation, setDesignation] = useState('');
    const [nic, setNic] = useState('');
    const [dob, setDob] = useState('');
    const [address, setAddress] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);
    const [remark, setRemark] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !employeeId || !joiningDate || !designation || !nic || !dob || !address || !contactNo) {
            setError('All fields except remark are required.');
            return;
        }
        onAdd({ name, employeeId, joiningDate, designation, nic, dob, address, contactNo, remark });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                <div>
                    <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Employee ID</label>
                    <input type="text" id="employeeId" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                 <div>
                    <label htmlFor="designation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Designation</label>
                    <input type="text" id="designation" value={designation} onChange={(e) => setDesignation(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                 <div>
                    <label htmlFor="nic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">NIC Number</label>
                    <input type="text" id="nic" value={nic} onChange={(e) => setNic(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                 <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
                    <input type="date" id="dob" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                <div>
                    <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact No</label>
                    <input type="tel" id="contactNo" value={contactNo} onChange={(e) => setContactNo(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                 <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                    <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                <div>
                    <label htmlFor="joiningDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Joining Date</label>
                    <input type="date" id="joiningDate" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                 <div className="md:col-span-2">
                    <label htmlFor="remark" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Remark</label>
                    <textarea id="remark" value={remark} onChange={(e) => setRemark(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600" rows={2}></textarea>
                </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                    Cancel
                </button>
                <button type="submit" className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-indigo-800">
                    Add Member
                </button>
            </div>
        </form>
    );
};

const Members: React.FC = () => {
    const { state, dispatch } = useWelfareData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);

     const handleToggleExpand = (memberId: string) => {
        setExpandedMemberId(currentId => (currentId === memberId ? null : memberId));
    };

    const handleAddMember = (memberData: Omit<Member, 'id'>) => {
        const newMember: Member = {
            id: `mem-${Date.now()}`,
            ...memberData,
        };
        dispatch({ type: 'ADD_MEMBER', payload: newMember });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Members</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    aria-haspopup="dialog"
                >
                    Add New Member
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Member List</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-1 py-3 w-8"></th>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Employee ID</th>
                                <th scope="col" className="px-6 py-3">Designation</th>
                                <th scope="col" className="px-6 py-3">NIC Number</th>
                                <th scope="col" className="px-6 py-3">Date of Birth</th>
                                <th scope="col" className="px-6 py-3">Contact No.</th>
                                <th scope="col" className="px-6 py-3">Joining Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.members.map(member => {
                                const isExpanded = expandedMemberId === member.id;
                                return (
                                <React.Fragment key={member.id}>
                                    <tr 
                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                                        onClick={() => handleToggleExpand(member.id)}
                                        aria-expanded={isExpanded}
                                    >
                                        <td className="px-1 py-4">
                                            <svg className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{member.name}</td>
                                        <td className="px-6 py-4">{member.employeeId}</td>
                                        <td className="px-6 py-4">{member.designation}</td>
                                        <td className="px-6 py-4">{member.nic}</td>
                                        <td className="px-6 py-4">{new Date(member.dob).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">{member.contactNo}</td>
                                        <td className="px-6 py-4">{new Date(member.joiningDate).toLocaleDateString()}</td>
                                    </tr>
                                    {isExpanded && (
                                        <tr className="bg-gray-50 dark:bg-gray-900">
                                            <td colSpan={8} className="p-4">
                                                <div className="p-4 bg-white dark:bg-gray-800 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="md:col-span-2"><span className="font-semibold">Address:</span> {member.address}</div>
                                                    {member.remark && (
                                                        <div className="md:col-span-2"><span className="font-semibold">Remark:</span> {member.remark}</div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Member">
                <AddMemberForm onAdd={handleAddMember} onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default Members;