"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { createSupportTicket } from '../../../store/slices/supportTicketSlice';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { ArrowLeft } from 'lucide-react';

export default function CreateTicketPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'low',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim()) {
      setError('Subject is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const resultAction = await dispatch(createSupportTicket(formData));
      if (createSupportTicket.fulfilled.match(resultAction)) {
        router.push('/support');
      } else {
        setError(resultAction.payload || 'Failed to create ticket');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-brand-muted hover:text-brand-dark transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">Create Support Ticket</h2>
          <p className="mt-1 text-sm text-brand-muted">
            Submit a new issue to our support team
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-border bg-white shadow-sm overflow-hidden p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Brief summary of the issue (e.g., POS Printer not working)"
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Description
              </label>
              <textarea
                placeholder="Detailed explanation of the issue..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full rounded-xl border border-brand-border px-4 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary min-h-[120px]"
              />
            </div>
            
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Priority
              </label>
              <Select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                options={[
                  { label: 'Low', value: 'low' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'High', value: 'high' },
                  { label: 'Critical', value: 'critical' },
                ]}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-brand-primary hover:bg-brand-primaryDark text-white"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
