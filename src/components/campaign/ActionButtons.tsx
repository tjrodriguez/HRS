'use client';

import { Loader2, Send, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useState } from 'react';

interface ActionButtonsProps {
  isPosting: boolean;
  isScheduling: boolean;
  onPostNow: () => void;
  onSchedule: (date: Date) => void;
  onBack: () => void;
}

export function ActionButtons({
  isPosting,
  isScheduling,
  onPostNow,
  onSchedule,
  onBack,
}: ActionButtonsProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

  const handleSchedule = () => {
    if (selectedDate) {
      onSchedule(selectedDate);
      setScheduleDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Calendar
      </Button>

      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <Button
          variant="outline"
          disabled={isPosting || isScheduling}
          onClick={() => setScheduleDialogOpen(true)}
        >
          {isScheduling ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Calendar className="mr-2 h-4 w-4" />
          )}
          Schedule
        </Button>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Post</DialogTitle>
            <DialogDescription>
              Choose a date to schedule your holiday post.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleSchedule}
              disabled={!selectedDate || isScheduling}
            >
              {isScheduling ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Confirm Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button onClick={onPostNow} disabled={isPosting || isScheduling}>
        {isPosting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Send className="mr-2 h-4 w-4" />
        )}
        Post Now
      </Button>
    </div>
  );
}
