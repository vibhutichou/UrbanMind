import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getThemeForRole } from '../../../styles/theme';
import { colors } from '../../../styles/colors';
import ResponsiveLayout from '../ResponsiveLayout';
import { useTheme } from '../../../context/ThemeContext';
import {
    User, Bell, Lock, Globe, Moon, Sun, Shield, Eye, EyeOff, ChevronRight,
    Check, LogOut, Trash2, HelpCircle, FileText, Heart,

    RefreshCw
} from 'lucide-react';
import profileService from '../../../services/profileService';
import AlertModal from '../AlertModal';
import ConfirmationModal from '../ConfirmationModal';

const Settings = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [realUser, setRealUser] = useState(null);





    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    });

    const [confirmConfig, setConfirmConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        isDanger: false,
        confirmText: 'Confirm'
    });

    const showAlert = (title, message, type = 'info') => {
        setAlertConfig({ isOpen: true, title, message, type });
    };

    const showConfirm = ({ title, message, onConfirm, isDanger = false, confirmText = 'Confirm' }) => {
        setConfirmConfig({ isOpen: true, title, message, onConfirm, isDanger, confirmText });
    };

    const closeAlert = () => setAlertConfig({ ...alertConfig, isOpen: false });
    const closeConfirm = () => setConfirmConfig({ ...confirmConfig, isOpen: false });
    const roleTheme = getThemeForRole(user?.role);
    const { theme: appTheme, setTheme } = useTheme();
    const isDark = appTheme === 'dark';

    const [activeSection, setActiveSection] = useState('appearance');
    const [settings, setSettings] = useState({
        language: 'en',
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        soundEnabled: true,
        problemUpdates: true,
        volunteerActivity: true,
        paymentAlerts: true,
        weeklyDigest: true,
        profileVisibility: 'public',
        showEmail: false,
        showPhone: false,
        showLocation: true,
        dataSharing: false,
        twoFactorAuth: false,
        loginAlerts: true,
        sessionTimeout: '30',
        compactView: false,
        autoPlayVideos: true,
        reducedMotion: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current: '', new: '', confirm: ''
    });

    useEffect(() => {
        const loadSettings = () => {
            const saved = localStorage.getItem('userSettings');
            if (saved) setSettings(JSON.parse(saved));
        };
        loadSettings();

        const fetchUserData = async () => {
            if (user?.role && user?.id) {
                try {
                    const data = await profileService.getProfile(user.role, user.id);
                    setRealUser(data.user);
                } catch (err) {
                    console.error("Failed to fetch settings profile", err);
                }
            }
        };
        fetchUserData();
    }, [user]);

    useEffect(() => {
        localStorage.setItem('userSettings', JSON.stringify(settings));
    }, [settings]);


    const bgSecondary = isDark ? '#1e293b' : 'white';
    const bgTertiary = isDark ? '#334155' : colors.gray[50];
    const textPrimary = isDark ? '#f8fafc' : colors.text.primary;
    const textSecondary = isDark ? '#cbd5e1' : colors.text.secondary;
    const borderColor = isDark ? '#475569' : colors.border.light;

    const handleSettingChange = (key, value) => {
        setSettings({ ...settings, [key]: value });
    };

    const handlePasswordChange = () => {
        if (passwordData.new === passwordData.confirm) {
            showAlert('Success', 'Password changed successfully!', 'success');
            setPasswordData({ current: '', new: '', confirm: '' });
        } else {
            showAlert('Error', 'New passwords do not match!', 'error');
        }
    };

    const handleLogout = () => {
        showConfirm({
            title: 'Logout',
            message: 'Are you sure you want to logout?',
            onConfirm: logout,
            isDanger: false,
            confirmText: 'Logout'
        });
    };

    const handleDeleteAccount = () => {
        showConfirm({
            title: 'Delete Account',
            message: '⚠️ This will permanently delete your account. Are you sure?',
            onConfirm: async () => {
                try {
                    await profileService.deleteProfile(user.role, user.id);
                    showAlert('Account Deleted', 'Your account has been deleted.', 'success');
                    setTimeout(() => logout(), 2000);
                } catch (error) {
                    console.error("Delete failed", error);
                    showAlert('Error', 'Failed to delete account. Admin profiles cannot be deleted.', 'error');
                }
            },
            isDanger: true,
            confirmText: 'Delete Forever'
        });
    };



    const sections = [
        { id: 'appearance', label: 'Appearance', icon: <Moon size={20} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
        { id: 'privacy', label: 'Privacy', icon: <Shield size={20} /> },
        { id: 'security', label: 'Security', icon: <Lock size={20} /> },
        { id: 'help', label: 'Help & Support', icon: <HelpCircle size={20} /> }
    ];

    const Toggle = ({ enabled, onChange, label }) => (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: bgTertiary,
            borderRadius: '12px',
            marginBottom: '0.75rem'
        }}>
            <span style={{
                fontSize: '0.95rem',
                fontWeight: '600',
                color: textPrimary
            }}>
                {label}
            </span>
            <button
                onClick={() => onChange(!enabled)}
                style={{
                    width: '52px',
                    height: '28px',
                    borderRadius: '14px',
                    border: 'none',
                    backgroundColor: enabled ? roleTheme.primary : (isDark ? '#475569' : colors.gray[300]),
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                }}
            >
                <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    position: 'absolute',
                    top: '2px',
                    left: enabled ? '26px' : '2px',
                    transition: 'all 0.3s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} />
            </button>
        </div>
    );

    const Select = ({ value, onChange, options, label }) => (
        <div style={{
            padding: '1rem',
            backgroundColor: bgTertiary,
            borderRadius: '12px',
            marginBottom: '0.75rem'
        }}>
            <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: textPrimary,
                marginBottom: '0.5rem'
            }}>
                {label}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: `1px solid ${borderColor}`,
                    fontSize: '0.95rem',
                    backgroundColor: bgSecondary,
                    color: textPrimary,
                    cursor: 'pointer'
                }}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );

    return (
        <>
            <ResponsiveLayout fullWidth showRightSidebar={false}>
                <div style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    padding: 'clamp(1rem, 3vw, 2rem)'
                }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{
                            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                            fontWeight: '800',
                            color: textPrimary,
                            marginBottom: '0.5rem',
                            marginLeft: window.innerWidth < 768 ? '3rem' : '0'
                        }}>
                            Settings
                        </h1>
                        <p style={{
                            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                            color: textSecondary
                        }}>
                            Manage your account preferences and settings
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)',
                        gap: '0.75rem',
                        marginBottom: '2rem'
                    }}>
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: 'clamp(0.75rem, 2vw, 1rem)',
                                    borderRadius: '12px',
                                    border: `2px solid ${activeSection === section.id ? roleTheme.primary : borderColor}`,
                                    backgroundColor: activeSection === section.id ? roleTheme.light : bgSecondary,
                                    color: activeSection === section.id ? roleTheme.primary : textSecondary,
                                    fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                                    fontWeight: activeSection === section.id ? '700' : '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {section.icon}
                                <span style={{ flex: 1, textAlign: 'left' }}>{section.label}</span>
                                <ChevronRight size={16} />
                            </button>
                        ))}
                    </div>

                    <div style={{
                        backgroundColor: bgSecondary,
                        borderRadius: '16px',
                        padding: 'clamp(1rem, 3vw, 2rem)',
                        border: `1px solid ${borderColor}`
                    }}>


                        {activeSection === 'notifications' && (
                            <div>
                                <h2 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '700',
                                    color: textPrimary,
                                    marginBottom: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <Bell size={24} color={roleTheme.primary} />
                                    Notification Preferences
                                </h2>

                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{
                                        fontSize: '1rem',
                                        fontWeight: '700',
                                        color: textPrimary,
                                        marginBottom: '1rem'
                                    }}>
                                        Notification Channels
                                    </h3>
                                    <Toggle enabled={settings.emailNotifications} onChange={(val) => handleSettingChange('emailNotifications', val)} label="📧 Email Notifications" />
                                    <Toggle enabled={settings.pushNotifications} onChange={(val) => handleSettingChange('pushNotifications', val)} label="🔔 Push Notifications" />
                                    <Toggle enabled={settings.smsNotifications} onChange={(val) => handleSettingChange('smsNotifications', val)} label="📱 SMS Notifications" />
                                    <Toggle enabled={settings.soundEnabled} onChange={(val) => handleSettingChange('soundEnabled', val)} label="🔊 Sound Alerts" />
                                </div>

                                <div>
                                    <h3 style={{
                                        fontSize: '1rem',
                                        fontWeight: '700',
                                        color: textPrimary,
                                        marginBottom: '1rem'
                                    }}>
                                        What to notify me about
                                    </h3>
                                    <Toggle enabled={settings.problemUpdates} onChange={(val) => handleSettingChange('problemUpdates', val)} label="Problem Status Updates" />
                                    <Toggle enabled={settings.volunteerActivity} onChange={(val) => handleSettingChange('volunteerActivity', val)} label="Volunteer Activity" />
                                    <Toggle enabled={settings.paymentAlerts} onChange={(val) => handleSettingChange('paymentAlerts', val)} label="Payment & Transaction Alerts" />
                                    <Toggle enabled={settings.weeklyDigest} onChange={(val) => handleSettingChange('weeklyDigest', val)} label="Weekly Summary Digest" />
                                </div>
                            </div>
                        )}

                        {activeSection === 'privacy' && (
                            <div>
                                <h2 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '700',
                                    color: textPrimary,
                                    marginBottom: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <Shield size={24} color={roleTheme.primary} />
                                    Privacy Settings
                                </h2>

                                <Select
                                    value={settings.profileVisibility}
                                    onChange={(val) => handleSettingChange('profileVisibility', val)}
                                    label="Profile Visibility"
                                    options={[
                                        { value: 'public', label: '🌐 Public - Everyone can see' },
                                        { value: 'friends', label: '👥 Connections only' },
                                        { value: 'private', label: '🔒 Private - Only me' }
                                    ]}
                                />

                                <div style={{ marginTop: '1.5rem' }}>
                                    <h3 style={{
                                        fontSize: '1rem',
                                        fontWeight: '700',
                                        color: textPrimary,
                                        marginBottom: '1rem'
                                    }}>
                                        Contact Information Visibility
                                    </h3>
                                    <Toggle enabled={settings.showEmail} onChange={(val) => handleSettingChange('showEmail', val)} label="Show Email Address" />
                                    <Toggle enabled={settings.showPhone} onChange={(val) => handleSettingChange('showPhone', val)} label="Show Phone Number" />
                                    <Toggle enabled={settings.showLocation} onChange={(val) => handleSettingChange('showLocation', val)} label="Show Location" />
                                    <Toggle enabled={settings.dataSharing} onChange={(val) => handleSettingChange('dataSharing', val)} label="Allow Anonymous Analytics" />
                                </div>
                            </div>
                        )}

                        {activeSection === 'security' && (
                            <div>
                                <h2 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '700',
                                    color: textPrimary,
                                    marginBottom: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <Lock size={24} color={roleTheme.primary} />
                                    Security Settings
                                </h2>

                                <Toggle enabled={settings.twoFactorAuth} onChange={(val) => handleSettingChange('twoFactorAuth', val)} label="🔐 Two-Factor Authentication (2FA)" />
                                <Toggle enabled={settings.loginAlerts} onChange={(val) => handleSettingChange('loginAlerts', val)} label="🚨 Login Activity Alerts" />

                                <Select
                                    value={settings.sessionTimeout}
                                    onChange={(val) => handleSettingChange('sessionTimeout', val)}
                                    label="Session Timeout"
                                    options={[
                                        { value: '15', label: '15 minutes' },
                                        { value: '30', label: '30 minutes' },
                                        { value: '60', label: '1 hour' },
                                        { value: 'never', label: 'Never (Not recommended)' }
                                    ]}
                                />

                                <div style={{
                                    padding: '1.5rem',
                                    backgroundColor: colors.warning + '10',
                                    borderRadius: '12px',
                                    marginTop: '1.5rem',
                                    border: `1px solid ${colors.warning}`
                                }}>
                                    <h3 style={{
                                        fontSize: '1rem',
                                        fontWeight: '700',
                                        color: textPrimary,
                                        marginBottom: '0.75rem'
                                    }}>
                                        ⚠️ Active Sessions
                                    </h3>
                                    <p style={{
                                        fontSize: '0.9rem',
                                        color: textSecondary,
                                        marginBottom: '1rem'
                                    }}>
                                        You are currently logged in on 2 devices
                                    </p>
                                    <button
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '8px',
                                            border: 'none',
                                            backgroundColor: colors.error,
                                            color: 'white',
                                            fontSize: '0.9rem',
                                            fontWeight: '700',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Log Out All Devices
                                    </button>
                                </div>

                                <button
                                    onClick={handleDeleteAccount}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: colors.error,
                                        color: 'white',
                                        fontSize: '0.9rem',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        marginTop: '1.5rem'
                                    }}
                                >
                                    <Trash2 size={18} />
                                    Delete Account
                                </button>
                            </div>
                        )}

                        {activeSection === 'appearance' && (
                            <div>
                                <h2 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '700',
                                    color: textPrimary,
                                    marginBottom: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <Moon size={24} color={roleTheme.primary} />
                                    Appearance Settings
                                </h2>

                                <div style={{
                                    padding: '1.5rem',
                                    backgroundColor: bgTertiary,
                                    borderRadius: '12px',
                                    marginBottom: '1.5rem'
                                }}>
                                    <h3 style={{
                                        fontSize: '1rem',
                                        fontWeight: '700',
                                        color: textPrimary,
                                        marginBottom: '1rem'
                                    }}>
                                        Theme
                                    </h3>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: window.innerWidth < 640 ? '1fr' : 'repeat(2, 1fr)',
                                        gap: '0.75rem'
                                    }}>
                                        {[
                                            { value: 'light', label: 'Light', icon: <Sun size={20} /> },
                                            { value: 'dark', label: 'Dark', icon: <Moon size={20} /> }
                                        ].map((themeOpt) => (
                                            <button
                                                key={themeOpt.value}
                                                onClick={() => setTheme(themeOpt.value)}
                                                style={{
                                                    padding: '1rem',
                                                    borderRadius: '8px',
                                                    border: `2px solid ${appTheme === themeOpt.value ? roleTheme.primary : borderColor}`,
                                                    backgroundColor: appTheme === themeOpt.value ? roleTheme.light : bgSecondary,
                                                    color: appTheme === themeOpt.value ? roleTheme.primary : textSecondary,
                                                    fontSize: '0.9rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {themeOpt.icon}
                                                {themeOpt.label}
                                                {appTheme === themeOpt.value && <Check size={16} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Toggle enabled={settings.compactView} onChange={(val) => handleSettingChange('compactView', val)} label="Compact View" />
                                <Toggle enabled={settings.autoPlayVideos} onChange={(val) => handleSettingChange('autoPlayVideos', val)} label="Auto-play Videos" />
                                <Toggle enabled={settings.reducedMotion} onChange={(val) => handleSettingChange('reducedMotion', val)} label="Reduce Motion & Animations" />
                            </div>
                        )}

                        {activeSection === 'help' && (
                            <div>
                                <h2 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '700',
                                    color: textPrimary,
                                    marginBottom: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <HelpCircle size={24} color={roleTheme.primary} />
                                    Help & Support
                                </h2>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: window.innerWidth < 640 ? '1fr' : 'repeat(2, 1fr)',
                                    gap: '1rem',
                                    marginBottom: '2rem'
                                }}>
                                    <div style={{
                                        padding: '1.5rem',
                                        backgroundColor: bgTertiary,
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s'
                                    }}>
                                        <FileText size={28} color={roleTheme.primary} />
                                        <h3 style={{ fontWeight: '700', marginTop: '0.5rem', color: textPrimary }}>FAQs</h3>
                                        <p style={{ fontSize: '0.9rem', color: textSecondary, marginTop: '0.25rem' }}>
                                            Reach out to our support team
                                        </p>
                                    </div>

                                    <div style={{
                                        padding: '1.5rem',
                                        backgroundColor: bgTertiary,
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s'
                                    }}>
                                        <Heart size={28} color={roleTheme.primary} />
                                        <h3 style={{ fontWeight: '700', marginTop: '0.5rem', color: textPrimary }}>Report an Issue</h3>
                                        <p style={{ fontSize: '0.9rem', color: textSecondary, marginTop: '0.25rem' }}>
                                            Let us know if something isn't working
                                        </p>
                                    </div>

                                    <div style={{
                                        padding: '1.5rem',
                                        backgroundColor: bgTertiary,
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s'
                                    }}>
                                        <RefreshCw size={28} color={roleTheme.primary} />
                                        <h3 style={{ fontWeight: '700', marginTop: '0.5rem', color: textPrimary }}>App Version</h3>
                                        <p style={{ fontSize: '0.9rem', color: textSecondary, marginTop: '0.25rem' }}>
                                            Version 1.0.0 (Latest)
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    style={{
                                        width: '100%',
                                        padding: '0.9rem',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: roleTheme.gradient,
                                        color: 'white',
                                        fontSize: '1rem',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        transition: 'transform 0.2s'
                                    }}
                                >
                                    <LogOut size={20} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </ResponsiveLayout>
            <AlertModal
                isOpen={alertConfig.isOpen}
                onClose={closeAlert}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
            />
            <ConfirmationModal
                isOpen={confirmConfig.isOpen}
                onClose={closeConfirm}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                message={confirmConfig.message}
                confirmText={confirmConfig.confirmText}
                isDanger={confirmConfig.isDanger}
            />
        </>
    );
};

export default Settings; 
