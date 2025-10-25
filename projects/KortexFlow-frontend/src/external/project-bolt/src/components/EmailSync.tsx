import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Mail, RefreshCw, Sparkles } from 'lucide-react';

interface EmailSyncProps {
  onSync: () => void;
}

export function EmailSync({ onSync }: EmailSyncProps) {
  const { user, connectGmail } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const simulateEmailSync = async () => {
    if (!user) return;

    setSyncing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockEmails = [
        {
          user_id: user.id,
          gmail_id: `mock-${Date.now()}-1`,
          subject: 'Project deadline reminder',
          sender: 'manager@company.com',
          body: 'Hi, just a reminder that the Q4 report is due by Friday, November 1st. Please make sure to submit it before 5 PM.',
          received_at: new Date().toISOString(),
          processed: false,
          has_task: false,
        },
        {
          user_id: user.id,
          gmail_id: `mock-${Date.now()}-2`,
          subject: 'Team meeting follow-up',
          sender: 'colleague@company.com',
          body: 'Thanks for attending the meeting. Can you please review the proposal document and send your feedback by Wednesday?',
          received_at: new Date().toISOString(),
          processed: false,
          has_task: false,
        },
      ];

      // @ts-ignore - dynamic import of local supabase module
      const mod = await import('../lib/supabase');
      const supabase = mod.supabase;
      const { error } = await supabase.from('emails').insert(mockEmails);
      if (error) throw error;

      alert('Synced 2 new emails! Now analyzing for tasks...');
      await analyzeEmails();
    } catch (error) {
      console.error('Error syncing emails:', error);
      alert('Error syncing emails. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const analyzeEmails = async () => {
    if (!user) return;

    setAnalyzing(true);
    try {
      const { data: unprocessedEmails, error: fetchError } = await supabase
        .from('emails')
        .select('*')
        .eq('user_id', user.id)
        .eq('processed', false);

      if (fetchError) throw fetchError;

      if (!unprocessedEmails || unprocessedEmails.length === 0) {
        alert('No new emails to analyze.');
        return;
      }

      const tasksToCreate = [];

      for (const email of unprocessedEmails as any[]) {
        const aiAnalysis = analyzeEmailWithAI(email as any);

        if (aiAnalysis.hasTask) {
          tasksToCreate.push({
            user_id: user.id,
            title: aiAnalysis.title,
            description: aiAnalysis.description,
            due_date: aiAnalysis.dueDate,
            priority: aiAnalysis.priority,
            source_type: 'email',
            source_id: email.gmail_id,
            ai_confidence: aiAnalysis.confidence,
            status: 'pending',
          });

          // @ts-ignore - dynamic import of local supabase module
          const mod2 = await import('../lib/supabase');
          const supabase2 = mod2.supabase;
          await supabase2
            .from('emails')
            .update({ processed: true, has_task: true })
            .eq('id', email.id);
        } else {
          // @ts-ignore - dynamic import of local supabase module
          const mod3 = await import('../lib/supabase');
          const supabase3 = mod3.supabase;
          await supabase3
            .from('emails')
            .update({ processed: true, has_task: false })
            .eq('id', email.id);
        }
      }

      if (tasksToCreate.length > 0) {
        const { error: insertError } = await supabase
          .from('tasks')
          .insert(tasksToCreate);

        if (insertError) throw insertError;

        alert(`AI extracted ${tasksToCreate.length} task(s) from your emails!`);
        onSync();
      } else {
        alert('No actionable tasks found in emails.');
      }
    } catch (error) {
      console.error('Error analyzing emails:', error);
      alert('Error analyzing emails. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const analyzeEmailWithAI = (email: any) => {
    const body = email.body.toLowerCase();
    const subject = email.subject.toLowerCase();

    const taskKeywords = ['due', 'deadline', 'submit', 'review', 'complete', 'finish', 'by', 'before'];
    const hasTaskKeyword = taskKeywords.some(
      (keyword) => body.includes(keyword) || subject.includes(keyword)
    );

    if (!hasTaskKeyword) {
      return { hasTask: false };
    }

    let dueDate = null;
    const dateRegex = /(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|next week|this week)/gi;
    const dateMatch = body.match(dateRegex);
    if (dateMatch) {
      const matchedDay = dateMatch[0].toLowerCase();
      const date = new Date();
      if (matchedDay === 'tomorrow') {
        date.setDate(date.getDate() + 1);
        dueDate = date.toISOString();
      } else if (matchedDay === 'friday') {
        const daysUntilFriday = (5 - date.getDay() + 7) % 7 || 7;
        date.setDate(date.getDate() + daysUntilFriday);
        dueDate = date.toISOString();
      } else if (matchedDay === 'wednesday') {
        const daysUntilWednesday = (3 - date.getDay() + 7) % 7 || 7;
        date.setDate(date.getDate() + daysUntilWednesday);
        dueDate = date.toISOString();
      }
    }

    const priority = body.includes('urgent') || body.includes('asap') ? 'high' : 'medium';

    return {
      hasTask: true,
      title: email.subject,
      description: `From: ${email.sender}\n\n${email.body}`,
      dueDate,
      priority,
      confidence: 0.85,
    };
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Mail className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Gmail Sync</h3>
      </div>

      <p className="text-sm text-slate-600 mb-4">
        Connect your Gmail to automatically extract tasks from emails using AI.
      </p>

      <div className="space-y-2">
        <button
          onClick={simulateEmailSync}
          disabled={syncing || analyzing}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {syncing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Sync Emails (Demo)
            </>
          )}
        </button>

        <button
          onClick={analyzeEmails}
          disabled={syncing || analyzing}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {analyzing ? (
            <>
              <Sparkles className="w-4 h-4 animate-pulse" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              AI Analyze Emails
            </>
          )}
        </button>
      </div>

      <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-xs text-slate-600">
          <strong>Demo Mode:</strong> This simulates Gmail integration. Full OAuth setup requires backend configuration.
        </p>
      </div>
    </div>
  );
}
