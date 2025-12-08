import React, { useState } from 'react';
import { User } from '../types';
import { Save, User as UserIcon, Mail, Phone, Lock, Trash2, Camera } from 'lucide-react';

interface UserSettingsProps {
  user: User;
  onUpdateProfile: (updatedData: Partial<User>) => void;
  onDeleteAccount: () => void;
}

export const UserSettings: React.FC<UserSettingsProps> = ({ user, onUpdateProfile, onDeleteAccount }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    password: user.password || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // Admin Check to Hide Button
  // Requirement: Admin Must NOT See Delete Account Button
  const isAdmin = user.role === 'admin' || user.email === 'admin@myapp.com';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API save
    setTimeout(() => {
        onUpdateProfile(formData);
        setIsSaving(false);
        alert("Profile updated successfully!");
    }, 1000);
  };

  const handleDelete = () => {
      // Requirement: Show a confirmation popup
      const confirm = window.confirm("Are you sure you want to delete your account?");
      if (confirm) {
          onDeleteAccount();
      }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Account Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4 group cursor-pointer">
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover border-4 border-gray-50 dark:border-gray-700" />
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                    <p className="text-gray-500 text-sm">{user.role === 'admin' ? 'Administrator' : 'Client Account'}</p>
                    <div className="mt-4 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full inline-flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span> Verified
                    </div>
                </div>
            </div>

            {/* Edit Form */}
            <div className="col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4 mb-6">
                            Profile Information
                        </h3>

                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="pl-10 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-premium-royal focus:border-premium-royal p-2.5 border transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="pl-10 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-premium-royal focus:border-premium-royal p-2.5 border transition-colors"
                                    />
                                </div>
                                <p className="text-xs text-yellow-600 mt-1">Changing email will require re-verification.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="pl-10 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-premium-royal focus:border-premium-royal p-2.5 border transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4 mb-6 mt-8">
                            Security
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Leave blank to keep current password"
                                    className="pl-10 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-premium-royal focus:border-premium-royal p-2.5 border transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-6">
                            {/* Requirement: Admin Must NOT See Delete Account Button */}
                            {!isAdmin && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete Account
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-gradient-to-r from-premium-royal to-premium-indigo text-white px-6 py-2.5 rounded-full font-bold hover:shadow-[0_0_20px_rgba(6,214,160,0.5)] transition-all shadow-lg flex items-center gap-2 ml-auto"
                            >
                                {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
};