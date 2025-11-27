import { useMemo } from 'react';
import { Search, Users, User, SunMedium, Moon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { switchRole } from '@/redux/slices/roleSlice';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Switch } from './ui/switch';

interface HeaderProps {
  isLead: boolean;
  isDarkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
}

const Header = ({ isLead, isDarkMode, onToggleDarkMode }: HeaderProps) => {
  const dispatch = useAppDispatch();
  const { currentRole, currentUser } = useAppSelector((state) => state.role);
  const members = useAppSelector((state) => state.members.members);

  const currentMember = members.find((member) => member.name === currentUser);
  const initials = useMemo(
    () =>
      currentUser
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    [currentUser]
  );

  const handleRoleSwitch = () => {
    dispatch(switchRole(currentRole === 'lead' ? 'member' : 'lead'));
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center gap-4 px-4 py-4 md:px-8 lg:px-10">
        <div className="flex flex-1 min-w-0 items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/done.png" alt="Team Pulse logo" className="h-11 w-11 rounded-2xl object-cover" />
            <div className="leading-tight">
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Team Pulse</span>
              <p className="text-base font-semibold text-slate-900 dark:text-slate-100">My-Task</p>
            </div>
          </div>
          {isLead ? (
            <div className="relative flex-1 max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder="Search members, tasks, or files"
                className="h-12 rounded-2xl border-transparent bg-slate-100 pl-11 text-sm text-slate-600 shadow-inner placeholder:text-slate-400 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-slate-800/60 dark:text-slate-100"
              />
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-300">Your work at a glance</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <SunMedium className={`h-4 w-4 ${isDarkMode ? 'text-slate-400' : 'text-amber-500'}`} />
            <Switch checked={isDarkMode} onCheckedChange={onToggleDarkMode} />
            <Moon className={`h-4 w-4 ${isDarkMode ? 'text-indigo-400' : 'text-slate-400'}`} />
          </div>

          <Button
            onClick={handleRoleSwitch}
            variant="outline"
            size="sm"
            className="rounded-full border-slate-200 text-slate-600 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200"
          >
            {currentRole === 'lead' ? (
              <>
                <User className="h-4 w-4" />
                Switch to Member
              </>
            ) : (
              <>
                <Users className="h-4 w-4" />
                Switch to Lead
              </>
            )}
          </Button>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-900/70">
            <div className="text-right leading-tight">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{currentUser}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentRole === 'lead' ? 'Team Lead' : 'Team Member'}
              </p>
            </div>
            <Avatar className="h-11 w-11 ring-2 ring-indigo-100 dark:ring-indigo-500/30">
              <AvatarImage
                src={
                  currentMember?.avatar ??
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser)}`
                }
                alt={currentUser}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
