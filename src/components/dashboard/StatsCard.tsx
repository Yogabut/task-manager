import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient: string;
  trend?: string;
}

const StatsCard = ({ title, value, icon: Icon, gradient, trend }: StatsCardProps) => {
  return (
    <div className="bg-card rounded-3xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium mb-2">{title}</p>
          <h3 className="text-4xl font-bold mb-1">{value}</h3>
          {trend && (
            <p className="text-sm text-success font-medium">{trend}</p>
          )}
        </div>
        <div className={`${gradient} p-4 rounded-2xl shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
