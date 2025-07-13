
import { CalendarEvent } from '@/types/calendar';
import { formatDate } from '@/lib/dateUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, GripVertical, Calendar, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EventCardProps {
  event: CalendarEvent;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onResizeStart?: (e: React.MouseEvent) => void;
  className?: string;
  style?: React.CSSProperties;
  view?: 'month' | 'week' | 'day';
}

export const EventCard = ({ 
  event, 
  onClick, 
  onDragStart, 
  onDragEnd,
  onResizeStart, 
  className, 
  style,
  view = 'week'
}: EventCardProps) => {
  
  // Month view: Show only start time and title
  if (view === 'month') {
    return (
      <div
        className={`
          relative cursor-pointer transition-all duration-200 rounded-md shadow-sm
          hover:shadow-md group overflow-hidden
          ${className || ''}
        `}
        style={{ 
          backgroundColor: event.color ? `${event.color}15` : 'hsl(var(--primary) / 0.08)',
          borderLeft: `3px solid ${event.color || 'hsl(var(--primary))'}`,
          ...style
        }}
        onClick={onClick}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        draggable
      >
        <div className="p-2">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xs font-medium text-muted-foreground">
              🕘 {formatDate(event.start, 'h:mm a')}
            </span>
          </div>
          <div className="text-xs font-semibold truncate" style={{ color: event.color || 'hsl(var(--primary))' }}>
            📌 {event.title}
          </div>
        </div>
      </div>
    );
  }
  
  // Week/Day view: Show start-end time and title
  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-200 rounded-md shadow-sm
        hover:shadow-md group overflow-hidden
        ${className || ''}
      `}
      style={{ 
        backgroundColor: event.color ? `${event.color}20` : 'hsl(var(--primary) / 0.1)',
        borderLeft: `3px solid ${event.color || 'hsl(var(--primary))'}`,
        ...style
      }}
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      draggable
    >
      <div className="p-2">
        <div className="text-xs font-medium text-muted-foreground mb-1">
          {formatDate(event.start, 'h:mm a')} – {formatDate(event.end, 'h:mm a')}
        </div>
        <div className="text-xs font-semibold truncate" style={{ color: event.color || 'hsl(var(--primary))' }}>
          {event.title}
        </div>
      </div>
      
      {/* Resize handle */}
      {onResizeStart && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize opacity-0 group-hover:opacity-100 transition-opacity rounded-b-md flex items-center justify-center"
          style={{ backgroundColor: `${event.color || 'hsl(var(--primary))'}40` }}
          onMouseDown={onResizeStart}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-4 h-0.5 bg-white/60 rounded-full" />
        </div>
      )}
    </div>
  );
};
