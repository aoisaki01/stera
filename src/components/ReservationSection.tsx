'use client';

import React, { useState } from 'react';
import { SmallStar } from './StarShape';
import { saveReservation } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';
import {
    Home,
    Plug,
    PartyPopper,
    Calendar,
    Clock,
    Users,
    User,
    Phone,
    MessageSquare,
    Check,
    Send
} from 'lucide-react';

interface ReservationData {
    date: string;
    time: string;
    guests: number;
    name: string;
    phone: string;
    notes: string;
}

export default function ReservationSection() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<ReservationData>({
        date: '',
        time: '',
        guests: 2,
        name: '',
        phone: '',
        notes: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Generate available times
    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00', '13:00',
        '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
    ];

    // Get minimum date (today)
    const today = new Date().toISOString().split('T')[0];

    // Get maximum date (30 days from now)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    const maxDateStr = maxDate.toISOString().split('T')[0];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Save to Firebase
        try {
            await saveReservation({
                date: formData.date,
                time: formData.time,
                guests: formData.guests,
                customer: {
                    name: formData.name,
                    phone: formData.phone
                },
                notes: formData.notes || undefined
            });
        } catch (error) {
            console.error('Error saving reservation:', error);
        }

        // Format WhatsApp message
        const message = encodeURIComponent(
            `Halo Stéra! Saya ingin reservasi:\n\n` +
            `Tanggal: ${formData.date}\n` +
            `Jam: ${formData.time}\n` +
            `Jumlah: ${formData.guests} orang\n` +
            `Nama: ${formData.name}\n` +
            `Telepon: ${formData.phone}\n` +
            (formData.notes ? `Catatan: ${formData.notes}\n` : '') +
            `\nMohon konfirmasi ya!`
        );

        // Open WhatsApp
        window.open(`https://wa.me/6283197498693?text=${message}`, '_blank');
        setIsSubmitted(true);

        // Reset after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
                date: '',
                time: '',
                guests: 2,
                name: '',
                phone: '',
                notes: ''
            });
        }, 3000);
    };

    const features = [
        { icon: <Home size={24} />, title: t('reservation.feature1.title'), desc: t('reservation.feature1.desc') },
        { icon: <Plug size={24} />, title: t('reservation.feature2.title'), desc: t('reservation.feature2.desc') },
        { icon: <PartyPopper size={24} />, title: t('reservation.feature3.title'), desc: t('reservation.feature3.desc') }
    ];

    return (
        <section id="reservation" className="section" style={{
            background: 'linear-gradient(180deg, var(--color-bg-cream) 0%, var(--color-bg) 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative elements */}
            <div style={{
                position: 'absolute',
                top: '20%',
                right: '5%',
                opacity: 0.1
            }}>
                <svg width="200" height="200" viewBox="0 0 100 100">
                    <ellipse cx="50" cy="50" rx="15" ry="45" fill="var(--color-primary)" transform="rotate(30 50 50)" />
                </svg>
            </div>

            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '4rem',
                    alignItems: 'center'
                }}>
                    {/* Left: Info */}
                    <div>
                        <SmallStar size={24} className="animate-pulse" />
                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            fontWeight: 700,
                            color: 'var(--color-text)',
                            marginTop: '1rem',
                            marginBottom: '1rem'
                        }}>
                            {t('reservation.title')}
                        </h2>
                        <p style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '1.1rem',
                            lineHeight: 1.8,
                            color: 'var(--color-text-light)',
                            marginBottom: '2rem'
                        }}>
                            {t('reservation.description')}
                        </p>

                        {/* Features */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}>
                            {features.map((feature, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '1rem',
                                    padding: '1rem',
                                    background: 'rgba(255,255,255,0.7)',
                                    borderRadius: '12px'
                                }}>
                                    <span style={{ color: 'var(--color-primary)' }}>{feature.icon}</span>
                                    <div>
                                        <h4 style={{
                                            fontFamily: 'var(--font-body)',
                                            fontWeight: 600,
                                            color: 'var(--color-text)',
                                            marginBottom: '0.25rem'
                                        }}>
                                            {feature.title}
                                        </h4>
                                        <p style={{
                                            fontFamily: 'var(--font-body)',
                                            fontSize: '0.9rem',
                                            color: 'var(--color-text-muted)'
                                        }}>
                                            {feature.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div style={{
                        background: 'var(--color-white)',
                        borderRadius: '24px',
                        padding: '2rem',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
                    }}>
                        {isSubmitted ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '3rem 1rem'
                            }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem auto'
                                }}>
                                    <Check size={40} color="white" strokeWidth={2.5} />
                                </div>
                                <h3 style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    color: 'var(--color-primary)',
                                    marginBottom: '0.5rem'
                                }}>
                                    {t('reservation.success.title')}
                                </h3>
                                <p style={{
                                    fontFamily: 'var(--font-body)',
                                    color: 'var(--color-text-muted)'
                                }}>
                                    {t('reservation.success.message')}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <h3 style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    color: 'var(--color-text)',
                                    marginBottom: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <SmallStar size={18} />
                                    Booking Form
                                </h3>

                                {/* Date & Time */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '1rem',
                                    marginBottom: '1rem'
                                }}>
                                    <div>
                                        <label style={labelStyle}>
                                            <Calendar size={14} style={{ marginRight: '0.5rem' }} />
                                            Tanggal *
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            required
                                            min={today}
                                            max={maxDateStr}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>
                                            <Clock size={14} style={{ marginRight: '0.5rem' }} />
                                            Waktu *
                                        </label>
                                        <select
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            required
                                            style={inputStyle}
                                        >
                                            <option value="">Pilih jam</option>
                                            {timeSlots.map((time) => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Guests */}
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={labelStyle}>
                                        <Users size={14} style={{ marginRight: '0.5rem' }} />
                                        Jumlah Tamu *
                                    </label>
                                    <div style={{
                                        display: 'flex',
                                        gap: '0.5rem',
                                        flexWrap: 'wrap'
                                    }}>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, guests: num })}
                                                style={{
                                                    width: '44px',
                                                    height: '44px',
                                                    borderRadius: '10px',
                                                    border: formData.guests === num
                                                        ? '2px solid var(--color-primary)'
                                                        : '2px solid var(--color-bg-cream)',
                                                    background: formData.guests === num
                                                        ? 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))'
                                                        : 'var(--color-white)',
                                                    color: formData.guests === num ? 'white' : 'var(--color-text)',
                                                    fontFamily: 'var(--font-body)',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Name */}
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={labelStyle}>
                                        <User size={14} style={{ marginRight: '0.5rem' }} />
                                        Nama *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        style={inputStyle}
                                        placeholder="Nama untuk reservasi"
                                    />
                                </div>

                                {/* Phone */}
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={labelStyle}>
                                        <Phone size={14} style={{ marginRight: '0.5rem' }} />
                                        WhatsApp *
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                        style={inputStyle}
                                        placeholder="08xxxxxxxxxx"
                                    />
                                </div>

                                {/* Notes */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={labelStyle}>
                                        <MessageSquare size={14} style={{ marginRight: '0.5rem' }} />
                                        Catatan (Opsional)
                                    </label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                                        placeholder="Contoh: meja di outdoor, ulang tahun, dsb"
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <Send size={18} />
                                    Kirim via WhatsApp
                                </button>

                                <p style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '0.8rem',
                                    color: 'var(--color-text-muted)',
                                    textAlign: 'center',
                                    marginTop: '1rem'
                                }}>
                                    Reservasi akan dikonfirmasi oleh tim kami
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

const labelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: '0.9rem',
    color: 'var(--color-text)',
    marginBottom: '0.5rem'
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: '12px',
    border: '2px solid var(--color-bg-cream)',
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    color: 'var(--color-text)',
    background: 'var(--color-white)',
    outline: 'none',
    transition: 'border-color 0.2s ease'
};
