import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Calendar, RefreshCw, Sparkles } from 'lucide-react';

interface CalendarSyncProps {
  onSync: () => void;
}

export function CalendarSync({ onSync }: CalendarSyncProps) {
  const { user, connectCalendar } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const simulateCalendarSync = async () => {
    if (!user) return;

    setSyncing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockEvents = [
        {
          user_id: user.id,
          google_event_id: `mock-event-${Date.now()}-1`,
          title: 'Client presentation',
          description: 'Present Q4 results to the client. Please confirm attendance.',
          start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
          location: 'Conference Room A',
          needs_action: true,
        },
        {
          user_id: user.id,
          google_event_id: `mock-event-${Date.now()}-2`,
          title: 'Team standup',
          description: 'Daily standup meeting',
          start_time: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
          location: 'Zoom',
          needs_action: false,
        },
      ];

      // @ts-ignore - dynamic import of local supabase module
      const mod = await import('../lib/supabase');
      const supabase = mod.supabase;
      const { error } = await supabase.from('calendar_events').insert(mockEvents);
      if (error) throw error;

      alert('Synced 2 calendar events! Now analyzing for action items...');
      await analyzeCalendarEvents();
    } catch (error) {
      console.error('Error syncing calendar:', error);
      alert('Error syncing calendar. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const analyzeCalendarEvents = async () => {
    if (!user) return;

    setAnalyzing(true);
    try {
      const { data: events, error: fetchError } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .eq('needs_action', true);

      if (fetchError) throw fetchError;

      if (!events || events.length === 0) {
        alert('No calendar events requiring action.');
        return;
      }

      const tasksToCreate = events.map((event: any) => ({
        user_id: user.id,
        title: `Confirm: ${event.title}`,
        description: `Event: ${event.title}\nLocation: ${event.location}\nTime: ${new Date(
          event.start_time
        ).toLocaleString()}\n\n${event.description}`,
        due_date: new Date(new Date(event.start_time).getTime() - 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        source_type: 'calendar',
        source_id: event.google_event_id,
        ai_confidence: 0.95,
        status: 'pending',
      }));

      if (tasksToCreate.length > 0) {
        const { error: insertError } = await supabase.from('tasks').insert(tasksToCreate);

        if (insertError) throw insertError;

        alert(`Created ${tasksToCreate.length} task(s) from calendar events!`);
        onSync();
      }
    } catch (error) {
      console.error('Error analyzing calendar:', error);
      alert('Error analyzing calendar. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Calendar Sync</h3>
      </div>

      <p className="text-sm text-slate-600 mb-4">
        Connect Google Calendar to track meetings and events that need confirmation.
      </p>

      <div className="space-y-2">
        <button
          onClick={simulateCalendarSync}
          disabled={syncing || analyzing}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {syncing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Sync Calendar (Demo)
            </>
          )}
        </button>

        <button
          onClick={analyzeCalendarEvents}
          disabled={syncing || analyzing}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {analyzing ? (
            <>
              <Sparkles className="w-4 h-4 animate-pulse" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              AI Analyze Events
            </>
          )}
        </button>
      </div>

      <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-xs text-slate-600">
          <strong>Demo Mode:</strong> This simulates Calendar integration. Full OAuth setup requires backend configuration.
        </p>
      </div>
    </div>
  );
}
