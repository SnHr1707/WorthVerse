import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For potential redirect after username change

const API_URL = 'http://localhost:5000/api/settings';

function Settings() {
    const navigate = useNavigate();

    // Main settings state
    const [settings, setSettings] = useState(null);
    const [initialSettings, setInitialSettings] = useState(null); // To track changes

    // Loading/Error/Success States
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // UI State
    const [activeTab, setActiveTab] = useState('account'); // 'account', 'security', 'privacy', 'notifications', 'theme'

    // Form States (Separate for clarity and independent submission)
    const [usernameFormData, setUsernameFormData] = useState({ newUsername: '', currentPasswordForUsername: '' });
    const [passwordFormData, setPasswordFormData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });

    // --- Fetch Initial Settings ---
    const fetchSettings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL, { withCredentials: true });
            // Ensure nested objects exist even if backend returns null/undefined for some
            const fetchedSettings = {
                ...response.data,
                account: response.data.account || {},
                security: response.data.security || {},
                privacy: response.data.privacy || { profileVisibility: 'Public', showOnlineStatus: true, allowConnectionRequests: true },
                notifications: response.data.notifications || { emailNotificationsEnabled: true, notifyNewConnections: true, notifyPostLikes: false, notifyPostComments: true },
                theme: response.data.theme || { mode: 'system' },
            };
            setSettings(fetchedSettings);
            setInitialSettings(JSON.parse(JSON.stringify(fetchedSettings))); // Deep copy for change detection
            console.log("Fetched settings:", fetchedSettings);
        } catch (err) {
            console.error('Error fetching settings:', err);
            setError(err.response?.data?.message || 'Failed to load settings. Please try refreshing.');
            setSettings(null); // Clear settings on error
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // --- Utility Functions ---
    const clearMessages = () => {
        setError(null);
        setSuccessMessage('');
    };

    const showSuccess = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 4000); // Auto-hide after 4 seconds
    };

    // Generic input handler for nested settings (privacy, notifications, theme)
    const handleSettingsChange = (section, key, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }));
        clearMessages(); // Clear messages when user starts typing/changing things
    };

     // Handler for specific forms (username, password)
     const handleFormChange = (formSetter, field, value) => {
        formSetter(prev => ({ ...prev, [field]: value }));
        clearMessages();
    };

    // Detect if general settings have changed
    const haveGeneralSettingsChanged = () => {
        if (!settings || !initialSettings) return false;
        // Compare only sections managed by handleSaveGeneralSettings
        const sectionsToCompare = ['privacy', 'notifications', 'theme'];
        for (const section of sectionsToCompare) {
            if (JSON.stringify(settings[section]) !== JSON.stringify(initialSettings[section])) {
                return true;
            }
        }
        return false;
    };


    // --- Submission Handlers ---

    // Save General Settings (Privacy, Notifications, Theme)
    const handleSaveGeneralSettings = async (e) => {
        e.preventDefault();
        if (!haveGeneralSettingsChanged()) {
            // setError("No changes detected in Privacy, Notifications, or Theme settings.");
            return; // Don't save if nothing changed
        }
        setSaving(true);
        clearMessages();
        try {
            const payload = {
                privacy: settings.privacy,
                notifications: settings.notifications,
                theme: settings.theme,
                // Add other general sections here if needed
            };
            const response = await axios.put(`${API_URL}/general`, payload, { withCredentials: true });
            const updatedSettings = response.data.settings;
             // Update local state to match saved state
             setSettings(prev => ({ ...prev, ...updatedSettings }));
             setInitialSettings(JSON.parse(JSON.stringify({ ...initialSettings, ...updatedSettings }))); // Update baseline
            showSuccess(response.data.message || 'General settings updated successfully!');
            console.log("General settings saved:", updatedSettings);
        } catch (err) {
            console.error('Error saving general settings:', err);
            setError(err.response?.data?.message || 'Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    // Change Username
    const handleChangeUsername = async (e) => {
        e.preventDefault();
        setSaving(true);
        clearMessages();
        try {
            const response = await axios.put(`${API_URL}/account/username`, usernameFormData, { withCredentials: true });
            showSuccess(response.data.message || 'Username changed successfully!');
            setUsernameFormData({ newUsername: '', currentPasswordForUsername: '' }); // Clear form
            // IMPORTANT: The backend sends back an updated JWT cookie.
            // We might need to update user context/state globally if username is stored there.
            // Simplest approach might be to force a reload or prompt user.
            // For now, just show success. Fetching settings again might reflect the change if needed.
            await fetchSettings(); // Re-fetch settings to get potentially updated username context from backend
            // Consider prompting the user about the change and potential need to re-login elsewhere.
            // navigate(0); // Force reload - might be jarring
            alert("Username changed successfully! You might need to log in again on other devices."); // Simple alert


        } catch (err) {
            console.error('Error changing username:', err);
            setError(err.response?.data?.message || 'Failed to change username.');
        } finally {
            setSaving(false);
        }
    };

    // Change Password
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setSaving(true);
        clearMessages();
        try {
            const response = await axios.put(`${API_URL}/security/password`, passwordFormData, { withCredentials: true });
            showSuccess(response.data.message || 'Password changed successfully!');
            setPasswordFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); // Clear form
            // Fetch settings again to update passwordLastChanged display
            await fetchSettings();
        } catch (err) {
            console.error('Error changing password:', err);
            setError(err.response?.data?.message || 'Failed to change password.');
        } finally {
            setSaving(false);
        }
    };


    // --- Render Logic ---

    // Loading State
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-gray-100">
                <div className="text-center p-10">
                    <i className="fas fa-spinner fa-spin text-indigo-500 text-4xl mb-4"></i>
                    <p className="text-lg text-gray-600">Loading settings...</p>
                </div>
            </div>
        );
    }

    // Error State (if settings couldn't be fetched)
    if (error && !settings) {
         return (
            <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-gray-100 p-4">
                 <div className="text-center p-10 max-w-md mx-auto bg-white rounded-lg shadow-xl border-t-4 border-red-500">
                     <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
                     <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Failed</h2>
                     <p className="text-red-600 mb-6">{error}</p>
                     <button onClick={fetchSettings} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150">
                        Retry
                     </button>
                 </div>
             </div>
         );
    }

    // If settings are null after loading without specific error (shouldn't happen often)
     if (!settings) {
         return (
            <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-gray-100 p-4">
                 <div className="text-center p-10 max-w-md mx-auto bg-white rounded-lg shadow-xl">
                    No settings data available. Please contact support if this persists.
                 </div>
            </div>
         );
     }


    // --- Tailwind Class Definitions (borrowed from MyProfile for consistency) ---
    const inputBaseClass = "block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 disabled:bg-gray-100";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";
    const buttonBase = "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out";
    const buttonPrimary = `${buttonBase} text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500`;
    const buttonSecondary = `${buttonBase} text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-indigo-500`;
    const buttonDanger = `${buttonBase} text-white bg-red-600 hover:bg-red-700 focus:ring-red-500`;
    const tabBase = "px-4 py-2 text-sm font-medium rounded-t-md cursor-pointer transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400";
    const tabActive = "bg-white text-indigo-600 border-b-2 border-indigo-500 shadow-sm";
    const tabInactive = "text-gray-500 hover:text-gray-700 hover:bg-gray-100 border-b-2 border-transparent";
    const toggleBase = "relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
    const toggleChecked = "bg-indigo-600";
    const toggleUnchecked = "bg-gray-300";
    const toggleHandle = "inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out";
    const toggleHandleChecked = "translate-x-6";
    const toggleHandleUnchecked = "translate-x-1";


    const renderTabContent = () => {
        switch (activeTab) {
            case 'account':
                return (
                    <div className="space-y-6">
                        {/* --- Change Username Section --- */}
                        <div className="p-5 border rounded-lg bg-gray-50">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-3">Change Username</h3>
                            <form onSubmit={handleChangeUsername} className="space-y-4">
                                <div>
                                    <label htmlFor="currentUsername" className={labelClass}>Current Username</label>
                                    <input type="text" id="currentUsername" value={settings.username || ''} disabled className={inputBaseClass} />
                                </div>
                                <div>
                                    <label htmlFor="newUsername" className={labelClass}>New Username</label>
                                    <input
                                        type="text" id="newUsername" name="newUsername"
                                        value={usernameFormData.newUsername}
                                        onChange={(e) => handleFormChange(setUsernameFormData, 'newUsername', e.target.value)}
                                        required
                                        className={inputBaseClass}
                                        placeholder="Enter new username"
                                        pattern="^[a-zA-Z0-9_]{3,20}$" // Match controller validation
                                        title="3-20 alphanumeric characters or underscores"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Must be 3-20 characters, letters, numbers, or underscores only.</p>
                                </div>
                                <div>
                                    <label htmlFor="currentPasswordForUsername" className={labelClass}>Current Password (for verification)</label>
                                    <input
                                        type="password" id="currentPasswordForUsername" name="currentPasswordForUsername"
                                        value={usernameFormData.currentPasswordForUsername}
                                         onChange={(e) => handleFormChange(setUsernameFormData, 'currentPasswordForUsername', e.target.value)}
                                        required
                                        className={inputBaseClass}
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div className="pt-2">
                                    <button type="submit" className={buttonPrimary} disabled={saving}>
                                        {saving ? (<><i className="fas fa-spinner fa-spin mr-2"></i>Saving...</>) : 'Change Username'}
                                    </button>
                                </div>
                            </form>
                            <p className="mt-4 text-xs text-yellow-700 bg-yellow-50 p-2 rounded border border-yellow-200"><i className="fas fa-exclamation-triangle mr-1"></i> Changing your username will update it across the platform. This might affect links and mentions.</p>
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-6">
                        {/* --- Change Password Section --- */}
                         <div className="p-5 border rounded-lg bg-gray-50">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-3">Change Password</h3>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                     <label htmlFor="currentPassword" className={labelClass}>Current Password</label>
                                     <input
                                        type="password" id="currentPassword" name="currentPassword"
                                        value={passwordFormData.currentPassword}
                                        onChange={(e) => handleFormChange(setPasswordFormData, 'currentPassword', e.target.value)}
                                        required className={inputBaseClass} placeholder="Enter current password"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="newPassword" className={labelClass}>New Password</label>
                                    <input
                                        type="password" id="newPassword" name="newPassword"
                                        value={passwordFormData.newPassword}
                                        onChange={(e) => handleFormChange(setPasswordFormData, 'newPassword', e.target.value)}
                                        required minLength="6" className={inputBaseClass} placeholder="Enter new password (min. 6 characters)"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmNewPassword" className={labelClass}>Confirm New Password</label>
                                    <input
                                        type="password" id="confirmNewPassword" name="confirmNewPassword"
                                        value={passwordFormData.confirmNewPassword}
                                        onChange={(e) => handleFormChange(setPasswordFormData, 'confirmNewPassword', e.target.value)}
                                        required minLength="6" className={inputBaseClass} placeholder="Confirm new password"
                                     />
                                </div>
                                <div className="pt-2">
                                     <button type="submit" className={buttonPrimary} disabled={saving}>
                                        {saving ? (<><i className="fas fa-spinner fa-spin mr-2"></i>Saving...</>) : 'Change Password'}
                                     </button>
                                </div>
                            </form>
                            {settings.security?.passwordLastChanged && (
                                <p className="mt-4 text-xs text-gray-500">Password last changed: {new Date(settings.security.passwordLastChanged).toLocaleDateString()}</p>
                            )}
                         </div>

                        {/* --- Two-Factor Authentication (Placeholder) --- */}
                         <div className="p-5 border rounded-lg bg-gray-50">
                             <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Two-Factor Authentication (2FA)</h3>
                             <p className="text-sm text-gray-600 mb-3">Add an extra layer of security to your account.</p>
                             <button className={buttonSecondary} disabled>
                                 Setup 2FA (Coming Soon)
                             </button>
                         </div>
                    </div>
                );

            case 'privacy':
                return (
                     <div className="space-y-6 p-5 border rounded-lg bg-gray-50">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 border-b pb-2">Privacy Settings</h3>
                         {/* Profile Visibility */}
                         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                 <label htmlFor="profileVisibility" className={labelClass}>Profile Visibility</label>
                                 <p className="text-xs text-gray-500 mb-1 sm:mb-0">Control who can see your full profile.</p>
                            </div>
                             <select
                                id="profileVisibility" name="profileVisibility"
                                value={settings.privacy?.profileVisibility || 'Public'}
                                onChange={(e) => handleSettingsChange('privacy', 'profileVisibility', e.target.value)}
                                className={`${inputBaseClass} mt-1 sm:mt-0 sm:w-auto`}
                             >
                                 <option value="Public">Public</option>
                                 <option value="ConnectionsOnly">Connections Only</option>
                                 <option value="Private">Private (Only You)</option>
                             </select>
                         </div>
                         <hr className="my-4"/>
                         {/* Show Online Status */}
                         <div className="flex items-center justify-between">
                             <div>
                                 <label htmlFor="showOnlineStatus" className={labelClass}>Show Online Status</label>
                                 <p className="text-xs text-gray-500">Let others see when you are active.</p>
                             </div>
                             <button
                                type="button" id="showOnlineStatus" role="switch" aria-checked={settings.privacy?.showOnlineStatus}
                                onClick={() => handleSettingsChange('privacy', 'showOnlineStatus', !settings.privacy?.showOnlineStatus)}
                                className={`${toggleBase} ${settings.privacy?.showOnlineStatus ? toggleChecked : toggleUnchecked}`}
                             >
                                 <span className={`${toggleHandle} ${settings.privacy?.showOnlineStatus ? toggleHandleChecked : toggleHandleUnchecked}`}/>
                             </button>
                         </div>
                          <hr className="my-4"/>
                         {/* Allow Connection Requests */}
                          <div className="flex items-center justify-between">
                             <div>
                                <label htmlFor="allowConnectionRequests" className={labelClass}>Allow Connection Requests</label>
                                <p className="text-xs text-gray-500">Allow others to send you connection requests.</p>
                              </div>
                             <button
                                type="button" id="allowConnectionRequests" role="switch" aria-checked={settings.privacy?.allowConnectionRequests}
                                onClick={() => handleSettingsChange('privacy', 'allowConnectionRequests', !settings.privacy?.allowConnectionRequests)}
                                className={`${toggleBase} ${settings.privacy?.allowConnectionRequests ? toggleChecked : toggleUnchecked}`}
                             >
                                 <span className={`${toggleHandle} ${settings.privacy?.allowConnectionRequests ? toggleHandleChecked : toggleHandleUnchecked}`}/>
                             </button>
                         </div>
                         {/* Add other privacy settings here */}
                         <div className="pt-4 border-t mt-6">
                            <button onClick={handleSaveGeneralSettings} className={buttonPrimary} disabled={saving || !haveGeneralSettingsChanged()}>
                                {saving ? (<><i className="fas fa-spinner fa-spin mr-2"></i>Saving...</>) : 'Save Privacy Settings'}
                            </button>
                         </div>
                     </div>
                 );

            case 'notifications':
                return (
                     <div className="space-y-6 p-5 border rounded-lg bg-gray-50">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 border-b pb-2">Notification Settings</h3>
                        {/* Email Notifications Enabled */}
                        <div className="flex items-center justify-between">
                             <div>
                                <label htmlFor="emailNotificationsEnabled" className={labelClass}>Enable Email Notifications</label>
                                <p className="text-xs text-gray-500">Receive important updates via email.</p>
                            </div>
                            <button
                                type="button" id="emailNotificationsEnabled" role="switch" aria-checked={settings.notifications?.emailNotificationsEnabled}
                                onClick={() => handleSettingsChange('notifications', 'emailNotificationsEnabled', !settings.notifications?.emailNotificationsEnabled)}
                                className={`${toggleBase} ${settings.notifications?.emailNotificationsEnabled ? toggleChecked : toggleUnchecked}`}
                            >
                                <span className={`${toggleHandle} ${settings.notifications?.emailNotificationsEnabled ? toggleHandleChecked : toggleHandleUnchecked}`}/>
                            </button>
                        </div>
                         <hr className="my-4"/>
                        <h4 className="text-md font-medium text-gray-800 mb-2">Specific Notifications:</h4>
                         {/* Notify New Connections */}
                         <div className="flex items-center justify-between pl-4">
                              <label htmlFor="notifyNewConnections" className={labelClass}>New Connections</label>
                              <button
                                 type="button" id="notifyNewConnections" role="switch" aria-checked={settings.notifications?.notifyNewConnections}
                                 onClick={() => handleSettingsChange('notifications', 'notifyNewConnections', !settings.notifications?.notifyNewConnections)}
                                 className={`${toggleBase} ${settings.notifications?.notifyNewConnections ? toggleChecked : toggleUnchecked}`}
                                 disabled={!settings.notifications?.emailNotificationsEnabled} // Disable if email is off
                             >
                                 <span className={`${toggleHandle} ${settings.notifications?.notifyNewConnections ? toggleHandleChecked : toggleHandleUnchecked}`}/>
                              </button>
                         </div>
                          {/* Notify Post Likes */}
                         <div className="flex items-center justify-between pl-4">
                              <label htmlFor="notifyPostLikes" className={labelClass}>Post Likes</label>
                              <button
                                 type="button" id="notifyPostLikes" role="switch" aria-checked={settings.notifications?.notifyPostLikes}
                                 onClick={() => handleSettingsChange('notifications', 'notifyPostLikes', !settings.notifications?.notifyPostLikes)}
                                 className={`${toggleBase} ${settings.notifications?.notifyPostLikes ? toggleChecked : toggleUnchecked}`}
                                  disabled={!settings.notifications?.emailNotificationsEnabled}
                             >
                                 <span className={`${toggleHandle} ${settings.notifications?.notifyPostLikes ? toggleHandleChecked : toggleHandleUnchecked}`}/>
                             </button>
                         </div>
                         {/* Notify Post Comments */}
                         <div className="flex items-center justify-between pl-4">
                              <label htmlFor="notifyPostComments" className={labelClass}>Post Comments</label>
                              <button
                                 type="button" id="notifyPostComments" role="switch" aria-checked={settings.notifications?.notifyPostComments}
                                 onClick={() => handleSettingsChange('notifications', 'notifyPostComments', !settings.notifications?.notifyPostComments)}
                                 className={`${toggleBase} ${settings.notifications?.notifyPostComments ? toggleChecked : toggleUnchecked}`}
                                  disabled={!settings.notifications?.emailNotificationsEnabled}
                              >
                                 <span className={`${toggleHandle} ${settings.notifications?.notifyPostComments ? toggleHandleChecked : toggleHandleUnchecked}`}/>
                             </button>
                         </div>
                         {/* Add other notification toggles */}
                         <div className="pt-4 border-t mt-6">
                             <button onClick={handleSaveGeneralSettings} className={buttonPrimary} disabled={saving || !haveGeneralSettingsChanged()}>
                                 {saving ? (<><i className="fas fa-spinner fa-spin mr-2"></i>Saving...</>) : 'Save Notification Settings'}
                             </button>
                         </div>
                     </div>
                 );

            case 'theme':
                 return (
                     <div className="space-y-6 p-5 border rounded-lg bg-gray-50">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 border-b pb-2">Theme Settings</h3>
                        {/* Theme Mode */}
                        <div>
                             <label className={labelClass}>Appearance Mode</label>
                             <p className="text-xs text-gray-500 mb-2">Choose your preferred theme.</p>
                             <fieldset className="mt-2">
                                <legend className="sr-only">Theme mode</legend>
                                <div className="space-y-2 sm:flex sm:items-center sm:space-y-0 sm:space-x-4">
                                    {['light', 'dark', 'system'].map((mode) => (
                                        <div key={mode} className="flex items-center">
                                            <input
                                                id={`theme-${mode}`} name="themeMode" type="radio"
                                                checked={settings.theme?.mode === mode}
                                                onChange={() => handleSettingsChange('theme', 'mode', mode)}
                                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                            />
                                            <label htmlFor={`theme-${mode}`} className="ml-2 block text-sm font-medium text-gray-700 capitalize">
                                                {mode}
                                             </label>
                                         </div>
                                     ))}
                                 </div>
                            </fieldset>
                         </div>
                         {/* Add other theme options like accent color if needed */}
                          <div className="pt-4 border-t mt-6">
                             <button onClick={handleSaveGeneralSettings} className={buttonPrimary} disabled={saving || !haveGeneralSettingsChanged()}>
                                 {saving ? (<><i className="fas fa-spinner fa-spin mr-2"></i>Saving...</>) : 'Save Theme Settings'}
                             </button>
                         </div>
                    </div>
                 );

            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-100 min-h-full p-3 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>

                {/* Sticky Tabs */}
                 <div className="sticky top-0 z-10 bg-gray-100 mb-1 -mx-3 sm:-mx-8 px-3 sm:px-8 py-2 border-b border-gray-200">
                     {/* Error & Success Messages */}
                     {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm relative" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span>{error}</span>
                             <button onClick={clearMessages} className="absolute top-0 bottom-0 right-0 px-3 py-2 text-red-500 hover:text-red-700 text-lg">
                                 ×
                            </button>
                        </div>
                     )}
                     {successMessage && (
                         <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-md text-sm relative" role="alert">
                             <strong className="font-bold">Success: </strong>
                             <span>{successMessage}</span>
                              <button onClick={clearMessages} className="absolute top-0 bottom-0 right-0 px-3 py-2 text-green-500 hover:text-green-700 text-lg">
                                  ×
                             </button>
                         </div>
                     )}

                    <div className="flex space-x-1 sm:space-x-2 border-b border-gray-200">
                        <button onClick={() => setActiveTab('account')} className={`${tabBase} ${activeTab === 'account' ? tabActive : tabInactive}`}>
                            <i className="fas fa-user-cog mr-1 hidden sm:inline"></i> Account
                        </button>
                         <button onClick={() => setActiveTab('security')} className={`${tabBase} ${activeTab === 'security' ? tabActive : tabInactive}`}>
                             <i className="fas fa-shield-alt mr-1 hidden sm:inline"></i> Security
                         </button>
                         <button onClick={() => setActiveTab('privacy')} className={`${tabBase} ${activeTab === 'privacy' ? tabActive : tabInactive}`}>
                              <i className="fas fa-user-secret mr-1 hidden sm:inline"></i> Privacy
                         </button>
                        <button onClick={() => setActiveTab('notifications')} className={`${tabBase} ${activeTab === 'notifications' ? tabActive : tabInactive}`}>
                            <i className="fas fa-bell mr-1 hidden sm:inline"></i> Notifications
                        </button>
                        <button onClick={() => setActiveTab('theme')} className={`${tabBase} ${activeTab === 'theme' ? tabActive : tabInactive}`}>
                            <i className="fas fa-palette mr-1 hidden sm:inline"></i> Theme
                        </button>
                    </div>
                </div>

                {/* Tab Content Area */}
                <div className="mt-6 bg-white p-5 sm:p-8 rounded-lg shadow-md">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
}

export default Settings;