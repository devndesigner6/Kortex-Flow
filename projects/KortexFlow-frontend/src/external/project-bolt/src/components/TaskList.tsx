import { useState } from 'react';
import { CheckCircle2, Circle, Trash2, Mail, Calendar, User, Clock, AlertCircle } from 'lucide-react';

interface TaskListProps {
  tasks: any[];
  onTaskUpdated: () => void;
}

export function TaskList({ tasks, onTaskUpdated }: TaskListProps) {
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);

  const toggleTaskStatus = async (task: any) => {
    setLoadingTaskId(task.id);
    try {
      // @ts-ignore - dynamic import of local supabase module
      const mod = await import('../lib/supabase');
      const supabase = mod.supabase;
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const { error } = await supabase
        .from('tasks')
        .update({
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
        })
        .eq('id', task.id);

      if (error) throw error;
      onTaskUpdated();
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setLoadingTaskId(null);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      onTaskUpdated();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const isOverdue = date < now;

    return {
      formatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isOverdue,
    };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'calendar': return <Calendar className="w-4 h-4" />;
      case 'manual': return <User className="w-4 h-4" />;
      default: return null;
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
          <CheckCircle2 className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No tasks yet</h3>
        <p className="text-slate-600">
          Connect your Gmail and Calendar or add tasks manually to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const dateInfo = formatDate(task.due_date);
        const isCompleted = task.status === 'completed';

        return (
          <div
            key={task.id}
            className={`border rounded-lg p-4 transition-all hover:shadow-md ${isCompleted ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-slate-200'
              }`}
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleTaskStatus(task)}
                disabled={loadingTaskId === task.id}
                className="flex-shrink-0 mt-1 transition-transform hover:scale-110 disabled:opacity-50"
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-400 hover:text-blue-600" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4
                      className={`text-base font-semibold mb-1 ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                    >
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-sm text-slate-600 mb-2">{task.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>

                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-700">
                        {getSourceIcon(task.source_type)}
                        {task.source_type}
                      </span>

                      {task.ai_confidence !== null && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 rounded text-xs font-medium text-blue-700">
                          AI: {Math.round(task.ai_confidence * 100)}%
                        </span>
                      )}

                      {dateInfo && (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${dateInfo.isOverdue && !isCompleted
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-slate-100 text-slate-700'
                            }`}
                        >
                          {dateInfo.isOverdue && !isCompleted && <AlertCircle className="w-3 h-3" />}
                          <Clock className="w-3 h-3" />
                          {dateInfo.formatted}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex-shrink-0 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
