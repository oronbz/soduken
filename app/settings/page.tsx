'use client';
import { useState } from 'react';
import { useProfileStore } from '@/stores/profileStore';
import { BottomNav } from '@/components/ui/BottomNav';

export default function SettingsPage() {
  const profile = useProfileStore(s => s.profile);
  const setName = useProfileStore(s => s.setName);
  const toggleSound = useProfileStore(s => s.toggleSound);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleNameSave = () => {
    if (nameInput.trim()) {
      setName(nameInput.trim());
    }
    setEditingName(false);
  };

  const handleReset = () => {
    localStorage.clear();
    window.location.href = '/onboarding';
  };

  return (
    <div className="px-5 pt-8 pb-28">
      <h1 className="font-display text-2xl font-bold text-brown-dark mb-6">Settings</h1>

      <div className="space-y-3">
        {/* Name */}
        <div className="bg-cream rounded-2xl p-4 shadow-[var(--shadow-warm)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-brown-light">Name</p>
              {editingName ? (
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                  autoFocus
                  className="font-semibold text-brown-dark bg-transparent border-b border-terracotta/40
                             focus:outline-none mt-0.5"
                />
              ) : (
                <p className="font-semibold text-brown-dark">{profile.name}</p>
              )}
            </div>
            {!editingName && (
              <button
                onClick={() => setEditingName(true)}
                className="text-xs text-terracotta font-medium"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Sound */}
        <div className="bg-cream rounded-2xl p-4 shadow-[var(--shadow-warm)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-brown-light">Sound Effects</p>
              <p className="font-semibold text-brown-dark">
                {profile.soundEnabled !== false ? 'On' : 'Off'}
              </p>
            </div>
            <button
              onClick={toggleSound}
              className={`
                relative w-12 h-7 rounded-full transition-colors duration-200
                ${profile.soundEnabled !== false ? 'bg-sage' : 'bg-cream-dark'}
              `}
            >
              <div
                className={`
                  absolute top-0.5 w-6 h-6 rounded-full bg-cream-light shadow transition-transform duration-200
                  ${profile.soundEnabled !== false ? 'translate-x-[1.375rem]' : 'translate-x-0.5'}
                `}
              />
            </button>
          </div>
        </div>

        {/* About */}
        <div className="bg-cream rounded-2xl p-4 shadow-[var(--shadow-warm)]">
          <p className="text-xs text-brown-light mb-1">About</p>
          <p className="font-display font-bold text-brown-dark">Soduken</p>
          <p className="text-xs text-brown-light mt-0.5">
            Made with love. A cozy puzzle companion.
          </p>
        </div>

        {/* Reset */}
        <div className="pt-4">
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-3 rounded-xl text-error/70 text-sm font-medium
                         hover:bg-error/5 transition-colors"
            >
              Reset All Data
            </button>
          ) : (
            <div className="bg-error/5 rounded-2xl p-4 text-center">
              <p className="text-sm text-brown mb-3">This will erase all progress. Are you sure?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-cream text-brown text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 rounded-xl bg-error text-cream-light text-sm font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
