import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Header from '@/components/Header';
import TeamLeadView from '@/components/TeamLeadView';
import TeamMemberView from '@/components/TeamMemberView';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchMembers, Status } from '@/redux/slices/membersSlice';
import { setUser } from '@/redux/slices/roleSlice';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Briefcase,
  ChevronRight,
  ChevronDown,
  CalendarClock,
  TrendingUp,
  CheckCircle2,
  Clock8,
  Coffee,
} from 'lucide-react';
import {
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  AreaChart,
  Area,
} from 'recharts';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, target: 'overview-section' },
  { label: 'Team', icon: Users, target: 'team-section' },
  { label: 'Status', icon: FolderKanban, target: 'status-section' },
  { label: 'Clients', icon: Briefcase },
];

const upcomingInterviews = [
  {
    name: 'Natalie Gibson',
    title: 'UI/UX Designer',
    time: '11:30 - 1:30',
  },
  {
    name: 'Peter Pieorg',
    title: 'Product Manager',
    time: '09:00 - 10:30',
  },
  {
    name: 'Andrew Miles',
    title: 'Data Analyst',
    time: '14:00 - 15:00',
  },
];

const chartOrder: Status[] = ['Working', 'Meeting', 'Break', 'Offline'];

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { currentRole, currentUser } = useAppSelector((state) => state.role);
  const isLead = currentRole === 'lead';
  const { members, loading } = useAppSelector((state) => state.members);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (!members.length && !loading) {
      dispatch(fetchMembers());
    }
  }, [dispatch, members.length, loading]);

  useEffect(() => {
    if (members.length && !members.some((member) => member.name === currentUser)) {
      dispatch(setUser(members[0].name));
    }
  }, [members, currentUser, dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const statusCounts = useMemo(
    () =>
      members.reduce(
        (acc, member) => {
          acc[member.status]++;
          return acc;
        },
        { Working: 0, Break: 0, Meeting: 0, Offline: 0 }
      ),
    [members]
  );

  const totalMembers = members.length;
  const activeCount = statusCounts.Working + statusCounts.Meeting;
  const awayCount = totalMembers - activeCount;
  const activePercent = totalMembers ? Math.round((activeCount / totalMembers) * 100) : 0;
  const donutStyle = {
    background: `conic-gradient(hsl(var(--primary)) 0 ${activePercent}% , #e2e8f0 ${activePercent}% 100%)`,
  };

  const availabilityCards = [
    {
      label: 'Attendance',
      value: activeCount,
      sublabel: 'present today',
      icon: CheckCircle2,
      accent: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Late Coming',
      value: Math.max(statusCounts.Break - 1, 1),
      sublabel: 'delayed check-ins',
      icon: Clock8,
      accent: 'text-amber-500',
      bg: 'bg-amber-50',
    },
    {
      label: 'Absent',
      value: statusCounts.Offline,
      sublabel: 'not logged in',
      icon: Users,
      accent: 'text-slate-500',
      bg: 'bg-slate-100',
    },
    {
      label: 'Leave Apply',
      value: Math.max(Math.round(totalMembers * 0.25) - awayCount, 1),
      sublabel: 'pending approvals',
      icon: Coffee,
      accent: 'text-pink-500',
      bg: 'bg-pink-50',
    },
  ];

  const chartData = useMemo(
    () => chartOrder.map((status) => ({ label: status, value: statusCounts[status] })),
    [statusCounts]
  );

  const trendData = useMemo(() => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    if (!totalMembers) {
      return labels.map((label) => ({ label, value: 0 }));
    }

    const activeRatio = totalMembers ? activeCount / totalMembers : 0;
    return labels.map((label, index) => {
      const wave = Math.sin((index / (labels.length - 1)) * Math.PI) * 0.2; // smooth hump
      const normalized = Math.min(0.95, Math.max(0.25, activeRatio + wave));
      return {
        label,
        value: Math.round(normalized * totalMembers),
      };
    });
  }, [activeCount, totalMembers]);
  const showLoadingState = loading && members.length === 0;

  const handleNavClick = (target?: string) => {
    if (target) {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div className="flex min-h-screen">
        {isLead && (
          <aside className="hidden lg:flex w-64 flex-col bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 text-white px-6 py-8 sticky top-0 h-screen">
            <div className="flex items-center gap-3 mb-10">
              <img
                src="/done.png"
                alt="Team Pulse logo"
                className="h-12 w-12 rounded-2xl bg-white/10 object-cover"
              />
              <div>
                <p className="text-xl font-semibold">My-Task</p>
                <p className="text-xs text-white/60">Team Pulse</p>
              </div>
            </div>

            <nav className="space-y-1 flex-1 overflow-y-auto pr-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item.target)}
                  className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white hover:translate-x-1 hover:shadow-lg/30"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>

          </aside>
        )}

        <div className="flex-1 flex flex-col bg-background">
          <Header isLead={isLead} isDarkMode={isDarkMode} onToggleDarkMode={setIsDarkMode} />
          <main className="flex-1 overflow-y-auto px-4 py-8 md:px-8 lg:px-10 space-y-8">
            {showLoadingState ? (
              <Card className="p-6 shadow-sm border-slate-100">
                <p className="text-sm text-slate-500">Syncing your team from RandomUser…</p>
              </Card>
            ) : null}
            {isLead && !showLoadingState ? (
              <div id="overview-section" className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
                <div className="space-y-6">
                  <Card className="p-6 shadow-sm border-slate-100">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Employees Info</p>
                      <h2 className="text-2xl font-semibold text-slate-900">Pulse over time</h2>
                      <p className="text-sm text-slate-500 mt-1">Monitored monthly sentiment and engagement</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-slate-200 text-slate-600 hover:text-slate-900"
                    >
                      Last 7 months
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-6">
                    <div className="mt-4 h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData} margin={{ top: 8, right: 12, left: -24, bottom: 0 }}>
                          <defs>
                            <linearGradient id="trendStroke" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#ec4899" />
                              <stop offset="100%" stopColor="#f97316" />
                            </linearGradient>
                            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.35" />
                              <stop offset="100%" stopColor="#fb923c" stopOpacity="0.05" />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                          <XAxis
                            dataKey="label"
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis hide domain={[0, totalMembers]} />
                          <Tooltip
                            contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                            labelStyle={{ fontWeight: 600 }}
                            formatter={(value: number) => [`${value} teammates`, 'Active']}
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="url(#trendStroke)"
                            strokeWidth={3}
                            fill="url(#trendFill)"
                            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-6 text-sm">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">Working now</p>
                        <p className="text-xl font-semibold text-slate-900">{statusCounts.Working}</p>
                        <p className="text-xs text-emerald-500 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Active teammates
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">Away or offline</p>
                        <p className="text-xl font-semibold text-slate-900">
                          {statusCounts.Break + statusCounts.Offline}
                        </p>
                        <p className="text-xs text-slate-500">Need follow ups</p>
                      </div>
                    </div>
                  </div>
                </Card>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" id="status-section">
                  <Card className="p-5 shadow-sm border-slate-100">
                    <p className="text-sm text-slate-500">Employees Availability</p>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {availabilityCards.map((item) => (
                        <div key={item.label} className={`rounded-2xl p-4 ${item.bg}`}>
                          <div className="flex items-center gap-2 text-xs font-medium uppercase text-slate-500">
                            <item.icon className={`h-4 w-4 ${item.accent}`} />
                            {item.label}
                          </div>
                          <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
                          <p className="text-xs text-slate-500">{item.sublabel}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-5 shadow-sm border-slate-100 flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Total Employees</p>
                      <p className="text-4xl font-semibold text-slate-900 mt-2">{totalMembers}</p>
                      <p className="text-xs text-slate-500">Active vs inactive</p>
                    </div>
                    <div className="mt-6 flex items-center gap-6">
                      <div
                        className="relative h-32 w-32 rounded-full border-8 border-slate-100"
                        style={donutStyle}
                      >
                        <div className="absolute inset-4 rounded-full bg-white flex flex-col items-center justify-center text-center">
                          <p className="text-xs text-slate-400">Active</p>
                          <p className="text-lg font-semibold text-slate-900">{activePercent}%</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-[hsl(var(--primary))]" />
                          <p className="text-slate-600">Engaged ({activeCount})</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-slate-200" />
                          <p className="text-slate-600">Offline ({awayCount})</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
                </div>

                <aside className="space-y-6">
                <Card className="p-5 shadow-sm border-slate-100 bg-indigo-600 text-white">
                  <p className="text-sm text-white/80">Applications</p>
                  <p className="text-5xl font-semibold mt-2">1546</p>
                  <p className="text-xs text-white/80">+24% vs last week</p>
                  <Button
                    variant="secondary"
                    className="mt-6 rounded-full bg-white/20 text-white hover:bg-white/30"
                  >
                    View Applications
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <Card className="p-5 shadow-sm border-slate-100">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-600">Interviews</p>
                      <CalendarClock className="h-5 w-5 text-indigo-500" />
                    </div>
                    <p className="text-3xl font-semibold text-slate-900 mt-3">246</p>
                    <p className="text-xs text-emerald-500">+12% scheduled</p>
                  </Card>

                  <Card className="p-5 shadow-sm border-slate-100">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-600">Hired</p>
                      <TrendingUp className="h-5 w-5 text-emerald-500" />
                    </div>
                    <p className="text-3xl font-semibold text-slate-900 mt-3">101</p>
                    <p className="text-xs text-emerald-500">+4% this week</p>
                  </Card>
                </div>

                <Card className="p-5 shadow-sm border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Upcoming</p>
                      <h3 className="text-lg font-semibold text-slate-900">Interviews</h3>
                    </div>
                    <Button variant="link" className="text-indigo-600 px-0">
                      View all
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {upcomingInterviews.map((interview, index) => (
                      <div
                        key={interview.name}
                        className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{interview.name}</p>
                          <p className="text-xs text-slate-500">{interview.title}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-700">{interview.time}</p>
                          <p className="text-xs text-slate-400">{index === 0 ? 'Today' : 'Tomorrow'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                </aside>
              </div>
            ) : null}

            <div
              className={`space-y-4 ${isLead ? '' : 'max-w-5xl mx-auto w-full'}`}
              id="team-section"
            >
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold text-slate-900">
                  {isLead ? 'Lead Overview' : 'Your Tasks'}
                </h2>
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                  {isLead ? 'Team Lead Panel' : 'Focused Mode'}
                </span>
              </div>
              {isLead ? (
                <Card className="p-6 shadow-sm border-slate-100">
                  <TeamLeadView />
                </Card>
              ) : (
                <div className="space-y-6">
                  <TeamMemberView />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
