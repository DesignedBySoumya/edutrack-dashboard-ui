import React from 'react';
import ReviewSessionDisplay from '@/components/ReviewSessionDisplay';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReviewSessionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0E27]">
      {/* Header */}
      <div className="bg-[#1C2541] border-b border-[#2563EB]/20 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate(-1)} 
              variant="ghost" 
              size="sm" 
              className="text-[#93A5CF] hover:text-white"
            >
              <ChevronLeft size={20} />
              Back
            </Button>
            <h1 className="text-xl font-semibold text-white">Review Session</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <ReviewSessionDisplay />
      </div>
    </div>
  );
};

export default ReviewSessionPage; 