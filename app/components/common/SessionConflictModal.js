'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import socketService from '../../services/socketService';

export default function SessionConflictModal() {
  const { sessionConflict, sessionConflictMessage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!sessionConflict) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pin) return;
    setIsSubmitting(true);
    socketService.emit("resolve_conflict", { pin });
    setTimeout(() => {
      // Re-enable in case of failure
      setIsSubmitting(false);
    }, 1500);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col p-6 animate-fade-in-up">
        <h2 className="text-xl font-bold text-brand-dark text-center mb-2">Session Conflict</h2>
        <p className="text-sm text-brand-secondary text-center mb-6 leading-relaxed">
          {sessionConflictMessage}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Enter your PIN"
            className="w-full px-4 py-3 bg-brand-light/50 border border-brand-accent/20 rounded-xl text-center text-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={6}
            disabled={isSubmitting}
            autoFocus
          />

          <button
            type="submit"
            className="w-full py-3 bg-brand-primary text-white font-semibold rounded-xl disabled:opacity-70 transition-opacity"
            disabled={isSubmitting || !pin}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            ) : (
              'Take Over Session'
            )}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-3 bg-transparent border border-red-500 text-red-500 font-semibold rounded-xl hover:bg-red-50 transition-colors"
            disabled={isSubmitting}
          >
            Log Out
          </button>
        </form>
      </div>
    </div>
  );
}
