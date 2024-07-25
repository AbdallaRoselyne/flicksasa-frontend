import React, { useEffect, useState } from 'react';
import api from '../../api';
import { FaTrash, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../context';

const AdminUsers = () => {
    const { user } = useUser();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/api/admin/users', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                setError('Failed to fetch users.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user.token]);

    const openModal = (userId) => {
        setSelectedUserId(userId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedUserId(null);
        setIsModalOpen(false);
    };

    const deleteUser = async () => {
        try {
            await api.delete(`/api/admin/users/${selectedUserId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setUsers(users.filter(user => user._id !== selectedUserId));
            toast.success('User deleted successfully.');
        } catch (error) {
            toast.error('Failed to delete user.');
        } finally {
            closeModal();
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen bg-black"><FaSpinner className="animate-spin h-12 w-12 text-gray-500" /></div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 pt-16">
            <h2 className="text-3xl font-extrabold text-red-600 mb-6 text-center">Admin - Users</h2>
            <div className="flex justify-center">
                <div className="overflow-x-auto w-full lg:w-3/4">
                    <table className="min-w-full bg-gray-800 border border-gray-700">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-700 text-center">Username</th>
                                <th className="py-2 px-4 border-b border-gray-700 text-center">Email</th>
                                <th className="py-2 px-4 border-b border-gray-700 text-center">Role</th>
                                <th className="py-2 px-4 border-b border-gray-700 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td className="py-2 px-4 border-b border-gray-700 text-center">{user.username}</td>
                                    <td className="py-2 px-4 border-b border-gray-700 text-center">{user.email}</td>
                                    <td className="py-2 px-4 border-b border-gray-700 text-center">{user.role}</td>
                                    <td className="py-2 px-4 border-b border-gray-700 text-center">
                                        <button 
                                            onClick={() => openModal(user._id)} 
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md">
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-900">Confirm Delete</h3>
                            <p className="mt-2 text-sm text-gray-600">Are you sure you want to delete this user? This action cannot be undone.</p>
                        </div>
                        <div className="flex justify-end p-4 border-t border-gray-200">
                            <button 
                                onClick={closeModal} 
                                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={deleteUser} 
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
