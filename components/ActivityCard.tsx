// components/ActivityCard.tsx
interface ActivityCardProps {
  activity: string;
  index: number;
}

export function ActivityCard({ activity, index }: ActivityCardProps) {
  const getActivityIcon = (index: number) => {
    const icons = ['🏛️', '🌅', '🏜️', '🕌', '🛍️', '🍴', '🚶', '📸', '🎨', '🎭'];
    return icons[index % icons.length];
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 group hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-gold to-moroccan-blue text-white rounded-xl flex items-center justify-center text-xl">
          {getActivityIcon(index)}
        </div>
        <div>
          <h3 className="font-amiri text-lg font-bold text-dark-charcoal">{activity}</h3>
          <p className="text-sm text-gray-600 mt-1">Experience this unique activity</p>
        </div>
      </div>
      <button className="w-full mt-4 bg-gray-100 text-dark-charcoal py-2 rounded-lg font-semibold hover:bg-primary-gold hover:text-white transition duration-300">
        Learn More
      </button>
    </div>
  );
}